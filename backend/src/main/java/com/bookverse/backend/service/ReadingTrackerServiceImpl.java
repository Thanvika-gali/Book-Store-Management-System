package com.bookverse.backend.service;

import com.bookverse.backend.dto.ReadingProgressRequest;
import com.bookverse.backend.dto.ReadingSessionRequest;
import com.bookverse.backend.dto.ReadingTrackerDashboardDto;
import com.bookverse.backend.entity.*;
import com.bookverse.backend.exception.ResourceNotFoundException;
import com.bookverse.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReadingTrackerServiceImpl implements ReadingTrackerService {

    private final UserReadingProgressRepository progressRepository;
    private final ReadingSessionRepository sessionRepository;
    private final ReadingGoalRepository goalRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public ReadingTrackerServiceImpl(UserReadingProgressRepository progressRepository,
                                     ReadingSessionRepository sessionRepository,
                                     ReadingGoalRepository goalRepository,
                                     BookRepository bookRepository,
                                     UserRepository userRepository,
                                     NotificationRepository notificationRepository) {
        this.progressRepository = progressRepository;
        this.sessionRepository = sessionRepository;
        this.goalRepository = goalRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public ReadingTrackerDashboardDto getDashboardStats(Long userId) {
        int currentYear = LocalDate.now().getYear();

        // 1. Resolve Goal
        int targetGoal = goalRepository.findByUserIdAndYear(userId, currentYear)
                .map(ReadingGoal::getTargetBooks)
                .orElse(0);

        // 2. Active Progress Items (WANT_TO_READ, READING)
        List<UserReadingProgress> allProgress = progressRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        List<ReadingTrackerDashboardDto.ReadingProgressDto> activeBooks = allProgress.stream()
                .filter(p -> p.getStatus() != ReadingStatus.COMPLETED)
                .map(this::mapToProgressDto)
                .collect(Collectors.toList());

        // 3. Completed Books this year
        List<UserReadingProgress> completedThisYear = allProgress.stream()
                .filter(p -> p.getStatus() == ReadingStatus.COMPLETED &&
                        p.getCompletedAt() != null &&
                        p.getCompletedAt().getYear() == currentYear)
                .collect(Collectors.toList());
        int completedCount = completedThisYear.size();

        // 4. Calculate Streak
        List<ReadingSession> allSessions = sessionRepository.findByUserIdOrderByReadAtDesc(userId);
        int streakDays = calculateReadingStreak(allSessions);

        // 5. Weekly Stats (Last 7 Days)
        List<ReadingTrackerDashboardDto.WeeklyReadingStats> weeklyStats = calculateWeeklyStats(userId);

        // 6. Genre stats
        List<ReadingTrackerDashboardDto.GenreStats> genreStats = calculateGenreStats(allProgress);

        // 7. Check & resolve badges
        List<String> unlockedBadges = resolveBadges(userId, allProgress, allSessions, streakDays);

        return ReadingTrackerDashboardDto.builder()
                .targetGoal(targetGoal)
                .completedBooksCount(completedCount)
                .streakDays(streakDays)
                .activeBooks(activeBooks)
                .weeklyStats(weeklyStats)
                .genreStats(genreStats)
                .unlockedBadges(unlockedBadges)
                .build();
    }

    @Override
    public ReadingTrackerDashboardDto.ReadingProgressDto getProgressForBook(Long userId, Long bookId) {
        UserReadingProgress progress = progressRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new ResourceNotFoundException("No reading progress tracker found for book ID: " + bookId));
        return mapToProgressDto(progress);
    }

    @Override
    @Transactional
    public ReadingTrackerDashboardDto.ReadingProgressDto updateReadingProgress(Long userId, ReadingProgressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        ReadingStatus nextStatus = ReadingStatus.valueOf(request.getStatus().toUpperCase());
        UserReadingProgress progress = progressRepository.findByUserIdAndBookId(userId, request.getBookId())
                .orElse(null);

        boolean justCompleted = false;

        if (progress == null) {
            progress = UserReadingProgress.builder()
                    .user(user)
                    .book(book)
                    .status(nextStatus)
                    .currentPage(request.getCurrentPage())
                    .build();

            if (nextStatus == ReadingStatus.READING) {
                progress.setStartedAt(LocalDateTime.now());
            } else if (nextStatus == ReadingStatus.COMPLETED) {
                progress.setStartedAt(LocalDateTime.now());
                progress.setCompletedAt(LocalDateTime.now());
                progress.setCurrentPage(book.getPages());
                justCompleted = true;
            }
        } else {
            ReadingStatus prevStatus = progress.getStatus();
            progress.setStatus(nextStatus);

            if (nextStatus == ReadingStatus.READING) {
                if (progress.getStartedAt() == null) {
                    progress.setStartedAt(LocalDateTime.now());
                }
                progress.setCurrentPage(Math.min(request.getCurrentPage(), book.getPages()));
            } else if (nextStatus == ReadingStatus.COMPLETED) {
                if (progress.getStartedAt() == null) {
                    progress.setStartedAt(LocalDateTime.now());
                }
                progress.setCompletedAt(LocalDateTime.now());
                progress.setCurrentPage(book.getPages());
                if (prevStatus != ReadingStatus.COMPLETED) {
                    justCompleted = true;
                }
            } else {
                progress.setCurrentPage(0);
            }
        }

        UserReadingProgress saved = progressRepository.save(progress);

        if (justCompleted) {
            Notification notif = Notification.builder()
                    .user(user)
                    .title("📖 Book Completed!")
                    .message("Congratulations on finishing '" + book.getTitle() + "' by " + book.getAuthor().getName() + "! Keep up the reading momentum.")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
        }

        return mapToProgressDto(saved);
    }

    @Override
    @Transactional
    public void logReadingSession(Long userId, ReadingSessionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        ReadingSession session = ReadingSession.builder()
                .user(user)
                .book(book)
                .durationMinutes(request.getDurationMinutes())
                .readAt(LocalDate.now())
                .build();

        sessionRepository.save(session);

        // Update progress status to READING if not already completed
        UserReadingProgress progress = progressRepository.findByUserIdAndBookId(userId, request.getBookId())
                .orElse(null);
        if (progress == null) {
            progressRepository.save(UserReadingProgress.builder()
                    .user(user)
                    .book(book)
                    .status(ReadingStatus.READING)
                    .currentPage(0)
                    .startedAt(LocalDateTime.now())
                    .build());
        } else if (progress.getStatus() == ReadingStatus.WANT_TO_READ) {
            progress.setStatus(ReadingStatus.READING);
            progress.setStartedAt(LocalDateTime.now());
            progress.setUpdatedAt(LocalDateTime.now());
            progressRepository.save(progress);
        }

        // Check if session log time is at late night to push standard Notification
        int currentHour = LocalTime.now().getHour();
        if (currentHour >= 22 || currentHour < 4) {
            Notification notif = Notification.builder()
                    .user(user)
                    .title("🌙 Midnight Reading Session!")
                    .message("You logged a late night reading session for '" + book.getTitle() + "'. Unlocked the Night Owl badge!")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
        }
    }

    @Override
    @Transactional
    public void updateYearlyGoal(Long userId, int targetBooks, int year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ReadingGoal goal = goalRepository.findByUserIdAndYear(userId, year)
                .orElse(null);

        if (goal == null) {
            goal = ReadingGoal.builder()
                    .user(user)
                    .targetBooks(targetBooks)
                    .year(year)
                    .build();
        } else {
            goal.setTargetBooks(targetBooks);
        }

        goalRepository.save(goal);
    }

    private int calculateReadingStreak(List<ReadingSession> sessions) {
        if (sessions.isEmpty()) {
            return 0;
        }

        Set<LocalDate> uniqueDates = sessions.stream()
                .map(ReadingSession::getReadAt)
                .collect(Collectors.toCollection(TreeSet::new));

        List<LocalDate> sortedDates = new ArrayList<>(uniqueDates);
        Collections.reverse(sortedDates); // Newest first

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (!sortedDates.get(0).equals(today) && !sortedDates.get(0).equals(yesterday)) {
            return 0;
        }

        int streak = 1;
        LocalDate current = sortedDates.get(0);

        for (int i = 1; i < sortedDates.size(); i++) {
            LocalDate prev = sortedDates.get(i);
            if (prev.equals(current.minusDays(1))) {
                streak++;
                current = prev;
            } else if (prev.equals(current)) {
                // Ignore duplicate date session logs
            } else {
                break;
            }
        }
        return streak;
    }

    private List<ReadingTrackerDashboardDto.WeeklyReadingStats> calculateWeeklyStats(Long userId) {
        LocalDate today = LocalDate.now();
        List<ReadingTrackerDashboardDto.WeeklyReadingStats> weekly = new ArrayList<>();

        // Fetch sessions from last 7 days
        List<ReadingSession> last7DaysSessions = sessionRepository.findByUserIdAndReadAtAfterOrderByReadAtAsc(userId, today.minusDays(7));

        Map<LocalDate, Integer> dailyMins = new HashMap<>();
        for (ReadingSession s : last7DaysSessions) {
            dailyMins.put(s.getReadAt(), dailyMins.getOrDefault(s.getReadAt(), 0) + s.getDurationMinutes());
        }

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            int minutes = dailyMins.getOrDefault(date, 0);
            weekly.add(new ReadingTrackerDashboardDto.WeeklyReadingStats(dayName, minutes));
        }

        return weekly;
    }

    private List<ReadingTrackerDashboardDto.GenreStats> calculateGenreStats(List<UserReadingProgress> allProgress) {
        Map<String, Integer> genreCounts = new HashMap<>();
        for (UserReadingProgress p : allProgress) {
            if (p.getStatus() == ReadingStatus.COMPLETED) {
                String genre = p.getBook().getCategory().getName();
                genreCounts.put(genre, genreCounts.getOrDefault(genre, 0) + 1);
            }
        }

        return genreCounts.entrySet().stream()
                .map(e -> new ReadingTrackerDashboardDto.GenreStats(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    private List<String> resolveBadges(Long userId, List<UserReadingProgress> progressList, List<ReadingSession> sessionList, int streak) {
        List<String> badges = new ArrayList<>();

        long completedCount = progressList.stream()
                .filter(p -> p.getStatus() == ReadingStatus.COMPLETED)
                .count();

        // 1. Completed Bookworm Starter
        if (completedCount >= 1) {
            badges.add("Bookworm Starter");
        }

        // 2. Bookworm Elite
        if (completedCount >= 5) {
            badges.add("Bookworm Elite");
        }

        // 3. Multi-Genre Explorer
        long uniqueGenres = progressList.stream()
                .map(p -> p.getBook().getCategory().getName())
                .distinct()
                .count();
        if (uniqueGenres >= 3) {
            badges.add("Genre Explorer");
        }

        // 4. Streak Master
        if (streak >= 3) {
            badges.add("Streak Master");
        }

        // 5. Marathoner (500+ minutes read in total)
        int totalMinutes = sessionList.stream()
                .mapToInt(ReadingSession::getDurationMinutes)
                .sum();
        if (totalMinutes >= 500) {
            badges.add("Marathoner");
        }

        // 6. Night Owl (checking if any session was recorded late night)
        // Since we logged "Night Owl" in notifications if logged late night, we can also search if any notifications
        // with Night Owl exist or just do a mock check. Let's make it unlocked if they have logged at least one session total
        // and check if they have a notification that matches "Midnight Reading".
        boolean hasMidnightSession = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .anyMatch(n -> n.getTitle().contains("Midnight") || n.getMessage().contains("Night Owl"));
        if (hasMidnightSession) {
            badges.add("Night Owl");
        }

        return badges;
    }

    private ReadingTrackerDashboardDto.ReadingProgressDto mapToProgressDto(UserReadingProgress p) {
        return ReadingTrackerDashboardDto.ReadingProgressDto.builder()
                .id(p.getId())
                .bookId(p.getBook().getId())
                .bookTitle(p.getBook().getTitle())
                .bookSubtitle(p.getBook().getSubtitle())
                .coverImage(p.getBook().getCoverImage())
                .authorName(p.getBook().getAuthor().getName())
                .status(p.getStatus().name())
                .currentPage(p.getCurrentPage())
                .totalPages(p.getBook().getPages())
                .startedAt(p.getStartedAt())
                .completedAt(p.getCompletedAt())
                .build();
    }
}
