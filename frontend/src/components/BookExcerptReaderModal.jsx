import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, Square, ChevronLeft, ChevronRight, 
  Settings, Highlighter, Trash2, Plus, Loader2, AlertCircle, Volume2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookExcerptReaderModal = ({ isOpen, onClose, bookId, bookTitle }) => {
  const { isAuthenticated } = useAuth();
  
  const [excerpts, setExcerpts] = useState([]);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Customization States
  const [theme, setTheme] = useState('sepia'); // 'light' | 'dark' | 'sepia'
  const [fontSize, setFontSize] = useState('text-base'); // 'text-sm' | 'text-base' | 'text-lg' | 'text-xl'
  const [showSettings, setShowSettings] = useState(false);
  
  // TTS Narration States
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [rate, setRate] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const sentencesRef = useRef([]);
  const speakingIndexRef = useRef(-1);
  
  // Highlights & Notes States
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [highlightNote, setHighlightNote] = useState('');
  const [highlightColor, setHighlightColor] = useState('bg-yellow-100 border-yellow-300 text-yellow-900');
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  // Colors mapping for highlights
  const colorOptions = [
    { name: 'Yellow', bg: 'bg-yellow-200 text-yellow-900', apiColor: 'yellow', btnClass: 'bg-yellow-300' },
    { name: 'Pink', bg: 'bg-pink-200 text-pink-900', apiColor: 'pink', btnClass: 'bg-pink-300' },
    { name: 'Green', bg: 'bg-green-200 text-green-900', apiColor: 'green', btnClass: 'bg-green-300' },
    { name: 'Blue', bg: 'bg-blue-200 text-blue-900', apiColor: 'blue', btnClass: 'bg-blue-300' },
  ];
  
  const [selectedColorOption, setSelectedColorOption] = useState(colorOptions[0]);

  // Load Excerpts and Bookmarks
  useEffect(() => {
    if (!isOpen) return;
    
    const loadReaderData = async () => {
      setLoading(true);
      setError('');
      try {
        const excerptRes = await api.get(`/books/${bookId}/excerpts`);
        setExcerpts(excerptRes.data);
        setActiveChapterIndex(0);

        if (isAuthenticated) {
          const bookmarkRes = await api.get(`/users/bookmarks/book/${bookId}`);
          setBookmarks(bookmarkRes.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load book preview. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadReaderData();
    
    // Stop speaking on close
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isOpen, bookId, isAuthenticated]);

  // Load voices for Speech Synthesis
  useEffect(() => {
    const loadVoices = () => {
      if (!synthRef.current) return;
      const allVoices = synthRef.current.getVoices();
      setVoices(allVoices);
      // Default to first English voice if available
      const defaultVoice = allVoices.find(v => v.lang.startsWith('en')) || allVoices[0];
      if (defaultVoice) {
        setSelectedVoiceName(defaultVoice.name);
      }
    };

    loadVoices();
    if (synthRef.current && typeof synthRef.current.onvoiceschanged !== 'undefined') {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  const activeChapter = excerpts[activeChapterIndex];

  // Helper to split chapter content into clean sentences for TTS
  useEffect(() => {
    if (activeChapter) {
      // Split by sentence ending characters followed by space
      const text = activeChapter.content;
      const matches = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
      sentencesRef.current = matches.map(s => s.trim()).filter(Boolean);
      // Reset speaking index if chapter changes
      stopSpeaking();
    }
  }, [activeChapterIndex, excerpts]);

  // Text selection listener for Highlights
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text.length > 3) {
      setSelectedText(text);
      setShowBookmarkForm(true);
    }
  };

  const handleSaveBookmark = async (e) => {
    e.preventDefault();
    if (!selectedText) return;
    setSavingBookmark(true);
    try {
      const response = await api.post('/users/bookmarks', {
        bookId: bookId,
        highlightText: selectedText,
        note: highlightNote,
        color: selectedColorOption.apiColor,
        chapterNumber: activeChapter.chapterNumber
      });
      setBookmarks([response.data, ...bookmarks]);
      setSelectedText('');
      setHighlightNote('');
      setShowBookmarkForm(false);
      window.getSelection().removeAllRanges();
    } catch (err) {
      console.error(err);
      alert('Failed to save highlight.');
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    if (!window.confirm('Are you sure you want to delete this highlight?')) return;
    try {
      await api.delete(`/users/bookmarks/${bookmarkId}`);
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete highlight.');
    }
  };

  // Text-To-Speech Narration Core Functions
  const speakSentence = (index) => {
    if (!synthRef.current || index >= sentencesRef.current.length) {
      stopSpeaking();
      return;
    }
    
    synthRef.current.cancel();
    speakingIndexRef.current = index;
    setCurrentSentenceIndex(index);

    const textToSpeak = sentencesRef.current[index];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    
    if (selectedVoiceName) {
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) utterance.voice = voice;
    }
    
    utterance.rate = rate;

    utterance.onend = () => {
      if (isSpeaking && !isPaused) {
        speakSentence(speakingIndexRef.current + 1);
      }
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      stopSpeaking();
    };

    synthRef.current.speak(utterance);
  };

  const handlePlayTTS = () => {
    if (!sentencesRef.current.length) return;
    
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    setIsSpeaking(true);
    setIsPaused(false);
    const startFrom = currentSentenceIndex >= 0 ? currentSentenceIndex : 0;
    speakSentence(startFrom);
  };

  const handlePauseTTS = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
    speakingIndexRef.current = -1;
  };

  const handleVoiceChange = (e) => {
    setSelectedVoiceName(e.target.value);
    if (isSpeaking) {
      // Restart speaking with new voice from the current sentence
      setTimeout(() => {
        speakSentence(speakingIndexRef.current);
      }, 50);
    }
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    if (isSpeaking) {
      // Restart speaking with new speed from current sentence
      setTimeout(() => {
        speakSentence(speakingIndexRef.current);
      }, 50);
    }
  };

  if (!isOpen) return null;

  // Custom colors styling based on themes
  const themeClasses = {
    sepia: 'bg-amber-50/95 text-amber-950 border-amber-200/50',
    light: 'bg-white/95 text-slate-900 border-slate-200/50',
    dark: 'bg-slate-950/95 text-slate-100 border-slate-800/80',
  };

  const currentThemeClass = themeClasses[theme] || themeClasses.sepia;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs font-sans">
      <div className={`h-full w-full max-w-4xl shadow-2xl flex flex-col md:flex-row transition-all duration-300 ${currentThemeClass} border-l`}>
        
        {/* Main Reading Window */}
        <div className="flex-1 flex flex-col h-full border-r border-inherit overflow-hidden">
          
          {/* Header Toolbar */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-inherit shrink-0">
            <div className="flex flex-col">
              <span className="text-4xs font-bold uppercase tracking-wider text-primary-500">Excerpt Preview</span>
              <h2 className="text-xs font-bold truncate max-w-xs md:max-w-md">{bookTitle}</h2>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Settings Toggle */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Reader Options"
              >
                <Settings className="h-4.5 w-4.5" />
              </button>

              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Settings Sub-Toolbar */}
          {showSettings && (
            <div className="px-6 py-3 border-b border-inherit bg-black/5 dark:bg-white/5 flex flex-wrap gap-4 items-center justify-between text-xs font-medium shrink-0 animate-fade-in">
              <div className="flex items-center gap-2">
                <span>Theme:</span>
                {['sepia', 'light', 'dark'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 rounded-md border text-3xs font-bold capitalize transition-all ${
                      theme === t ? 'border-primary-500 bg-primary-500/10 text-primary-600' : 'border-gray-300 hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span>Font Size:</span>
                {[
                  { size: 'text-sm', label: 'Small' },
                  { size: 'text-base', label: 'Normal' },
                  { size: 'text-lg', label: 'Large' },
                  { size: 'text-xl', label: 'Huge' }
                ].map((f) => (
                  <button
                    key={f.size}
                    onClick={() => setFontSize(f.size)}
                    className={`px-2.5 py-1 rounded-md border text-3xs font-bold transition-all ${
                      fontSize === f.size ? 'border-primary-500 bg-primary-500/10 text-primary-600' : 'border-gray-300 hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TTS Narration Controls */}
          {activeChapter && (
            <div className="px-6 py-3.5 border-b border-inherit flex flex-wrap gap-4 items-center justify-between shrink-0 bg-black/3 dark:bg-white/3">
              <div className="flex items-center gap-2">
                <button
                  onClick={isSpeaking && !isPaused ? handlePauseTTS : handlePlayTTS}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 shadow-sm"
                  title={isSpeaking && !isPaused ? 'Pause Narration' : 'Listen with Speech Narration (TTS)'}
                >
                  {isSpeaking && !isPaused ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5 fill-current ml-0.5" />}
                </button>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5"
                    title="Stop Narration"
                  >
                    <Square className="h-4 w-4 fill-current text-red-500" />
                  </button>
                )}
                <span className="text-3xs text-gray-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                  <Volume2 className="h-3.5 w-3.5 text-primary-500" />
                  TTS Audible Mode
                </span>
              </div>

              {/* TTS Settings */}
              <div className="flex items-center gap-4 text-3xs font-bold">
                {/* Voice Selection */}
                {voices.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 dark:text-slate-400">Voice:</span>
                    <select
                      value={selectedVoiceName}
                      onChange={handleVoiceChange}
                      className="rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent px-2 py-1 text-3xs outline-none max-w-44 truncate"
                    >
                      {voices.map((v, i) => (
                        <option key={i} value={v.name} className="text-slate-800">
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Speed rate */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-slate-400">Speed: {rate.toFixed(1)}x</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={rate}
                    onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                    className="w-18 accent-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reading Body Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6" onMouseUp={handleTextSelection}>
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500 mb-2" />
                <span className="text-xs text-gray-500">Fetching ebook excerpts...</span>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                <h3 className="text-sm font-bold text-red-600">{error}</h3>
              </div>
            ) : excerpts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <AlertCircle className="h-10 w-10 mb-2 text-gray-300" />
                <h3 className="text-sm font-bold">No previews available for this title.</h3>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Chapter Title */}
                <div className="text-center pb-6 border-b border-inherit">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-primary-500">Chapter {activeChapter.chapterNumber}</span>
                  <h1 className="font-outfit text-xl font-extrabold mt-1">{activeChapter.chapterTitle}</h1>
                </div>

                {/* Main Excerpt Content */}
                <div className={`leading-relaxed space-y-4 font-medium select-text ${fontSize}`}>
                  {sentencesRef.current.map((sentence, idx) => {
                    const isCurrent = idx === currentSentenceIndex;
                    return (
                      <span
                        key={idx}
                        className={`transition-colors duration-200 inline ${
                          isCurrent ? 'bg-primary-500/25 border-b-2 border-primary-500' : ''
                        }`}
                      >
                        {sentence}{' '}
                      </span>
                    );
                  })}
                </div>

                {/* Instructions Alert */}
                {isAuthenticated && (
                  <div className="p-3.5 bg-primary-50/5 border border-primary-500/20 rounded-xl text-3xs text-gray-500 dark:text-slate-400 text-center select-none mt-12">
                    💡 Highlight and select text inside the reading area to log custom bookmarks, annotations or notes.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          {!loading && excerpts.length > 0 && (
            <div className="h-16 px-6 border-t border-inherit flex items-center justify-between shrink-0 select-none bg-black/3 dark:bg-white/3">
              <button
                disabled={activeChapterIndex === 0}
                onClick={() => setActiveChapterIndex(activeChapterIndex - 1)}
                className="inline-flex h-9 items-center gap-1 px-3 text-xs font-bold rounded-lg border border-gray-300 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev Chapter
              </button>

              <span className="text-3xs text-gray-500 font-bold">
                Chapter {activeChapterIndex + 1} of {excerpts.length}
              </span>

              <button
                disabled={activeChapterIndex === excerpts.length - 1}
                onClick={() => setActiveChapterIndex(activeChapterIndex + 1)}
                className="inline-flex h-9 items-center gap-1 px-3 text-xs font-bold rounded-lg border border-gray-300 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                Next Chapter
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>

        {/* Sidebar Panel: Annotations, Highlights, and Bookmark Form */}
        <div className="w-full md:w-80 flex flex-col h-1/2 md:h-full overflow-hidden bg-black/5 dark:bg-white/3">
          
          {/* Section Header */}
          <div className="h-16 px-5 border-b border-inherit flex items-center shrink-0">
            <Highlighter className="h-4.5 w-4.5 text-primary-500 mr-2" />
            <h3 className="text-xs font-bold">Bookmarks & Highlights</h3>
          </div>

          {/* Annotation Creation Form */}
          {showBookmarkForm && (
            <div className="p-4 border-b border-inherit bg-primary-500/5 animate-fade-in shrink-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-3xs font-extrabold uppercase text-primary-500 tracking-wider">Add Highlight Note</span>
                <button 
                  onClick={() => {
                    setShowBookmarkForm(false);
                    setSelectedText('');
                    window.getSelection().removeAllRanges();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveBookmark} className="space-y-3">
                <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/25 text-3xs italic line-clamp-3">
                  "{selectedText}"
                </div>

                {/* Color Selection */}
                <div className="space-y-1">
                  <span className="text-4xs uppercase tracking-wider text-gray-500 block">Highlight Color:</span>
                  <div className="flex gap-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColorOption(c)}
                        className={`h-5 w-5 rounded-full ${c.btnClass} border ${
                          selectedColorOption.apiColor === c.apiColor ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-transparent'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Optional Note */}
                <div className="space-y-1">
                  <span className="text-4xs uppercase tracking-wider text-gray-500 block">Personal Note:</span>
                  <textarea
                    rows="2.5"
                    value={highlightNote}
                    onChange={(e) => setHighlightNote(e.target.value)}
                    placeholder="Write your thoughts or quotes notes..."
                    className="w-full text-3xs rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent p-2 outline-none focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingBookmark}
                  className="w-full flex h-8 items-center justify-center rounded-lg bg-primary-500 text-3xs font-bold text-white shadow-soft disabled:bg-gray-400"
                >
                  {savingBookmark ? 'Saving...' : 'Save Annotation'}
                </button>
              </form>
            </div>
          )}

          {/* Bookmarks List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!isAuthenticated ? (
              <div className="text-center py-8 text-3xs text-gray-400">
                Please <span className="underline cursor-pointer" onClick={() => window.location.href='/login'}>log in</span> to add and view bookmarks.
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-8 text-3xs text-gray-400">
                No highlights or bookmarks recorded.
              </div>
            ) : (
              bookmarks.map((b) => {
                const colorOpt = colorOptions.find(o => o.apiColor === b.color) || colorOptions[0];
                return (
                  <div key={b.id} className="p-3 rounded-xl border border-inherit bg-white dark:bg-slate-900 shadow-soft relative group">
                    <button
                      onClick={() => handleDeleteBookmark(b.id)}
                      className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Bookmark"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    
                    <span className="text-4xs uppercase tracking-wider text-primary-500 font-bold block mb-1">
                      Chapter {b.chapterNumber}
                    </span>
                    
                    <div className={`p-1.5 rounded text-3xs border-l-2 leading-relaxed italic ${colorOpt.bg}`}>
                      "{b.highlightText}"
                    </div>

                    {b.note && (
                      <p className="text-3xs mt-2 text-gray-600 dark:text-slate-300 font-medium">
                        <span className="font-bold text-gray-400 block text-4xs uppercase tracking-wide">Note:</span>
                        {b.note}
                      </p>
                    )}

                    <span className="text-4xs text-gray-400 block mt-1.5">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookExcerptReaderModal;
