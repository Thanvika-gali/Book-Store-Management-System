import React, { useState, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  BookOpen, Flame, Trophy, Calendar, Clock, Edit2, 
  Plus, Play, Pause, Square, AlertCircle, Loader2, Award, BookCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Register ChartJS modules
ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend
);

const ReadingTracker = () => {
  const { isAuthenticated } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reading stopwatch timer states
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedTimerBookId, setSelectedTimerBookId] = useState('');
  const timerIntervalRef = useRef(null);
  
  // Modals / forms states
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalValue, setNewGoalValue] = useState(10);
  
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedProgressBook, setSelectedProgressBook] = useState(null);
  const [progressStatus, setProgressStatus] = useState('READING');
  const [progressPage, setProgressPage] = useState(0);

  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    fetchTrackerData();
  }, [isAuthenticated]);

  // Stopwatch timer counter
  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning]);

  const fetchTrackerData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/reading-tracker/dashboard');
      setDashboardData(res.data);
      setNewGoalValue(res.data.targetGoal || 10);
      if (res.data.activeBooks && res.data.activeBooks.length > 0) {
        setSelectedTimerBookId(res.data.activeBooks[0].bookId);
      }
    } catch (err) {
      console.error('Error fetching reading tracker stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Log reading session
  const handleLogManualSession = async (minutes, bookId) => {
    if (!bookId) {
      alert('Please select a book to log reading minutes.');
      return;
    }
    try {
      await api.post('/users/reading-tracker/session', {
        bookId: Number(bookId),
        durationMinutes: minutes
      });
      alert(`Logged ${minutes} minutes of reading successfully!`);
      fetchTrackerData();
    } catch (err) {
      console.error(err);
      alert('Failed to log reading session.');
    }
  };

  const startTimer = () => {
    if (!selectedTimerBookId) {
      alert('Please select a book to start tracking your session.');
      return;
    }
    setElapsedSeconds(0);
    setTimerRunning(true);
  };

  const stopAndLogTimer = async () => {
    setTimerRunning(false);
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const confirmLog = window.confirm(`Log session of ${minutes} minutes for this book?`);
    if (confirmLog) {
      await handleLogManualSession(minutes, selectedTimerBookId);
    }
    setElapsedSeconds(0);
  };

  // Goal updates
  const handleUpdateGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentYear = new Date().getFullYear();
      await api.post(`/users/reading-tracker/goal?targetBooks=${newGoalValue}&year=${currentYear}`);
      setShowGoalModal(false);
      fetchTrackerData();
    } catch (err) {
      console.error(err);
      alert('Failed to update yearly goal.');
    }
  };

  // Book progress updates
  const handleOpenProgressModal = (book) => {
    setSelectedProgressBook(book);
    setProgressStatus(book.status);
    setProgressPage(book.currentPage);
    setShowProgressModal(true);
  };

  const handleUpdateProgressSubmit = async (e) => {
    e.preventDefault();
    setSavingProgress(true);
    try {
      await api.post('/users/reading-tracker/progress', {
        bookId: selectedProgressBook.bookId,
        status: progressStatus,
        currentPage: Number(progressPage)
      });
      setShowProgressModal(false);
      fetchTrackerData();
    } catch (err) {
      console.error(err);
      alert('Failed to update reading progress.');
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex h-96 flex-col items-center justify-center dark:text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-2" />
        <span className="text-xs font-semibold text-gray-500">Syncing reading logs & dashboard...</span>
      </div>
    );
  }

  // Calculate percentages
  const goalPercent = dashboardData.targetGoal > 0 
    ? Math.min(100, Math.round((dashboardData.completedBooksCount / dashboardData.targetGoal) * 100))
    : 0;

  // Chart 1: Bar Chart (Weekly consistency)
  const barChartData = {
    labels: dashboardData.weeklyStats.map(d => d.day),
    datasets: [
      {
        label: 'Minutes Read',
        data: dashboardData.weeklyStats.map(d => d.minutes),
        backgroundColor: '#4f46e5',
        borderRadius: 6,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  // Chart 2: Doughnut Chart (Genres completed)
  const doughnutChartData = {
    labels: dashboardData.genreStats.map(g => g.genre),
    datasets: [
      {
        data: dashboardData.genreStats.map(g => g.count),
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
        borderWidth: 1,
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
    }
  };

  const badgeDefinitions = [
    { id: 'Bookworm Starter', title: 'Bookworm Starter', desc: 'Read your first book', icon: '🏆', color: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/50' },
    { id: 'Bookworm Elite', title: 'Bookworm Elite', desc: 'Read 5 completed books', icon: '👑', color: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50' },
    { id: 'Genre Explorer', title: 'Genre Explorer', desc: 'Read across 3 categories', icon: '🗺️', color: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900/50' },
    { id: 'Streak Master', title: 'Streak Master', desc: 'Keep a 3-day streak active', icon: '🔥', color: 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/20 dark:border-orange-900/50' },
    { id: 'Marathoner', title: 'Marathoner', desc: 'Log 500+ minutes reading', icon: '🏃‍♂️', color: 'bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-950/20 dark:border-pink-900/50' },
    { id: 'Night Owl', title: 'Night Owl', desc: 'Read late past 10 PM', icon: '🦉', color: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900/50' }
  ];

  // Helper to check if badge is unlocked
  const isBadgeUnlocked = (badgeId) => {
    return dashboardData.unlockedBadges.includes(badgeId);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">Reading Tracker</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">Log reading sessions, configure yearly milestones, and analyze category breakdowns</p>
      </div>

      {/* Grid: Goal, Streak, and Session Timer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Challenge Goal Widget */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center text-center justify-between">
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider">Yearly Challenge</h3>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="text-3xs font-bold text-primary-500 hover:underline"
              >
                Set Goal
              </button>
            </div>
            
            {dashboardData.targetGoal > 0 ? (
              <div className="space-y-4 my-2">
                {/* SVG Progress Ring */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="8" fill="transparent" className="dark:stroke-slate-800" />
                    <circle cx="56" cy="56" r="48" stroke="#4f46e5" strokeWidth="8" fill="transparent"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - goalPercent / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white">{goalPercent}%</span>
                    <span className="text-4xs text-gray-400 uppercase font-bold">Complete</span>
                  </div>
                </div>

                <p className="text-xs font-bold text-gray-700 dark:text-slate-300">
                  Read <span className="text-primary-500">{dashboardData.completedBooksCount}</span> of <span className="text-slate-800 dark:text-slate-200">{dashboardData.targetGoal}</span> books
                </p>
              </div>
            ) : (
              <div className="py-8 space-y-3">
                <p className="text-xs text-gray-400 font-medium">No challenge set for {new Date().getFullYear()}.</p>
                <button 
                  onClick={() => setShowGoalModal(true)}
                  className="inline-flex h-8 items-center justify-center rounded-xl bg-primary-500 px-4 text-3xs font-bold text-white hover:bg-primary-600"
                >
                  Create Yearly Goal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Streak Tracker Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider mb-4">Reading Consistency</h3>
            <div className="flex items-center gap-4 py-3">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${dashboardData.streakDays > 0 ? 'bg-orange-100 text-orange-500 dark:bg-orange-950/20' : 'bg-gray-100 text-gray-400 dark:bg-slate-800'}`}>
                <Flame className={`h-8 w-8 ${dashboardData.streakDays > 0 ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wide">Current Streak</span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {dashboardData.streakDays} {dashboardData.streakDays === 1 ? 'Day' : 'Days'}
                </span>
                <p className="text-4xs text-gray-500 dark:text-slate-400 font-medium mt-0.5">
                  {dashboardData.streakDays > 0 ? 'Splendid! You read daily. Keep the flame alive!' : 'Log a session today to start your reading streak!'}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-50 dark:border-slate-800 pt-3 flex items-center gap-1.5 text-3xs text-gray-400 font-semibold select-none">
            <Calendar className="h-4 w-4 text-primary-500" />
            <span>Streak updates automatically with daily logs.</span>
          </div>
        </div>

        {/* Session Timer (Stopwatch Widget) */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider mb-3">Live Reading Timer</h3>
            
            {dashboardData.activeBooks.length === 0 ? (
              <p className="text-3xs text-gray-400 font-medium py-6 text-center">Add books to "Currently Reading" or "Want to Read" to enable stopwatch timer tracking.</p>
            ) : (
              <div className="space-y-3">
                {/* Book select dropdown */}
                <select
                  disabled={timerRunning}
                  value={selectedTimerBookId}
                  onChange={(e) => setSelectedTimerBookId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-3xs font-bold dark:border-slate-800 dark:bg-slate-900 outline-none"
                >
                  {dashboardData.activeBooks.map(b => (
                    <option key={b.bookId} value={b.bookId}>
                      {b.bookTitle} ({b.currentPage}/{b.totalPages}p)
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between py-1 px-2.5 rounded-xl bg-gray-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-primary-500" />
                    <span className="font-mono text-base font-extrabold text-gray-900 dark:text-white">
                      {formatTimer(elapsedSeconds)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {!timerRunning ? (
                      <button
                        onClick={startTimer}
                        className="flex h-7 items-center gap-1 rounded-lg bg-green-500 px-3 text-4xs font-bold text-white hover:bg-green-600 transition-colors"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        Start
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setTimerRunning(false)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                          title="Pause"
                        >
                          <Pause className="h-3 w-3" />
                        </button>
                        <button
                          onClick={stopAndLogTimer}
                          className="flex h-7 items-center gap-1 rounded-lg bg-red-500 px-3 text-4xs font-bold text-white hover:bg-red-600"
                        >
                          <Square className="h-3 w-3 fill-current" />
                          Stop & Log
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-50 dark:border-slate-800 pt-3">
            <span className="text-4xs text-gray-400 font-bold block uppercase mb-1.5">Quick log minutes:</span>
            <div className="flex gap-1.5">
              {[15, 30, 45].map((mins) => (
                <button
                  key={mins}
                  disabled={dashboardData.activeBooks.length === 0}
                  onClick={() => handleLogManualSession(mins, selectedTimerBookId)}
                  className="flex-1 h-6 rounded-lg border border-gray-200 text-4xs font-bold text-gray-600 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-45"
                >
                  +{mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Active Tracker Items & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Books Tracker List */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800">
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-primary-500" />
              Books Currently Tracking
            </h3>
          </div>

          {dashboardData.activeBooks.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <BookCheck className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-400 font-medium">No books are being tracked currently.</p>
              <p className="text-4xs text-gray-400 font-medium">Go to the catalog and click "Want to Read" or "Start Reading" on book profiles to populate this list.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {dashboardData.activeBooks.map((b) => {
                const percent = b.totalPages > 0 ? Math.min(100, Math.round((b.currentPage / b.totalPages) * 100)) : 0;
                return (
                  <div key={b.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 hover:border-gray-200 dark:hover:border-slate-700 transition-all">
                    <img 
                      src={b.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=150'} 
                      alt={b.bookTitle} 
                      className="h-16 w-12 object-cover rounded-lg border dark:border-slate-800 shrink-0" 
                    />
                    
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-xs font-extrabold text-gray-800 dark:text-slate-100 leading-snug line-clamp-1">{b.bookTitle}</h4>
                            <span className="text-4xs text-gray-400 font-bold block">by {b.authorName}</span>
                          </div>
                          
                          <span className={`text-4xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            b.status === 'READING' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                          }`}>
                            {b.status === 'READING' ? 'Reading' : 'Want to Read'}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2.5 space-y-1">
                          <div className="flex justify-between text-4xs font-bold text-gray-500 dark:text-slate-400">
                            <span>Page {b.currentPage} of {b.totalPages}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-dashed border-gray-100 dark:border-slate-800/80 mt-2">
                        <button
                          onClick={() => handleOpenProgressModal(b)}
                          className="inline-flex h-6.5 items-center gap-1 rounded-lg border border-gray-200 dark:border-slate-800 px-2.5 text-4xs font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-3 w-3" />
                          Log Progress
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badge Shelf Showcase Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="w-full">
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider pb-2 border-b border-gray-50 dark:border-slate-800 mb-4 flex items-center gap-1.5">
              <Trophy className="h-4.5 w-4.5 text-primary-500" />
              Achievements
            </h3>

            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {badgeDefinitions.map((badge) => {
                const unlocked = isBadgeUnlocked(badge.id);
                return (
                  <div 
                    key={badge.id} 
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                      unlocked 
                        ? badge.color + ' shadow-soft' 
                        : 'border-dashed border-gray-200 bg-gray-50/50 text-gray-300 dark:border-slate-800 dark:bg-slate-950/20'
                    }`}
                  >
                    <span className={`text-xl mb-1 ${unlocked ? '' : 'grayscale opacity-30'}`}>{badge.icon}</span>
                    <span className={`text-4xs font-extrabold line-clamp-1 ${unlocked ? 'text-gray-800 dark:text-slate-100' : 'text-gray-400'}`}>
                      {badge.title}
                    </span>
                    <span className="text-5xs text-gray-400 dark:text-slate-500 leading-tight mt-0.5 font-medium line-clamp-2">
                      {badge.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Analytical Charts Segment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Consistency Bar Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Clock className="h-4.5 w-4.5 text-primary-500" />
            Weekly Consistency (Minutes)
          </h3>
          <div className="h-60">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Category breakdown doughnut chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 text-primary-500" />
            Category distribution
          </h3>
          <div className="h-60">
            {dashboardData.genreStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-6 text-xs text-gray-400 font-medium">
                Complete reading books to view category distribution analytics.
              </div>
            ) : (
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            )}
          </div>
        </div>

      </div>

      {/* 1. Modal: Yearly goal challenge update */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border dark:border-slate-800 dark:bg-slate-900 text-xs font-semibold space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white">Configure Reading Challenge</h3>
              <button onClick={() => setShowGoalModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleUpdateGoalSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-3xs uppercase tracking-wider text-gray-400">Target Books for {new Date().getFullYear()}:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newGoalValue}
                  onChange={(e) => setNewGoalValue(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full flex h-10 items-center justify-center rounded-xl bg-primary-500 text-xs font-bold text-white shadow-soft"
              >
                Set Yearly Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Update book progress page */}
      {showProgressModal && selectedProgressBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border dark:border-slate-800 dark:bg-slate-900 text-xs font-semibold space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white">Update Reading Progress</h3>
              <button onClick={() => setShowProgressModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl flex gap-3">
              <img src={selectedProgressBook.coverImage} className="h-12 w-9 object-cover rounded-md" alt="cover" />
              <div>
                <h4 className="font-bold text-gray-800 dark:text-slate-100 leading-snug line-clamp-1">{selectedProgressBook.bookTitle}</h4>
                <span className="text-4xs text-gray-400">Total pages: {selectedProgressBook.totalPages}</span>
              </div>
            </div>

            <form onSubmit={handleUpdateProgressSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-3xs uppercase tracking-wider text-gray-400">Reading Status:</label>
                <select
                  value={progressStatus}
                  onChange={(e) => setProgressStatus(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 bg-white outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                >
                  <option value="WANT_TO_READ">Want to Read</option>
                  <option value="READING">Currently Reading</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {progressStatus !== 'COMPLETED' && (
                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-gray-400">Current Page:</label>
                  <input
                    type="number"
                    min="0"
                    max={selectedProgressBook.totalPages}
                    value={progressPage}
                    onChange={(e) => setProgressPage(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={savingProgress}
                className="w-full flex h-10 items-center justify-center rounded-xl bg-primary-500 text-xs font-bold text-white shadow-soft"
              >
                {savingProgress ? 'Saving Progress...' : 'Update Progress'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReadingTracker;
