package com.bookverse.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ReadingTrackerDashboardDto {
    private int targetGoal;
    private int completedBooksCount;
    private int streakDays;
    private List<ReadingProgressDto> activeBooks;
    private List<WeeklyReadingStats> weeklyStats;
    private List<GenreStats> genreStats;
    private List<String> unlockedBadges;

    public ReadingTrackerDashboardDto() {
    }

    public ReadingTrackerDashboardDto(int targetGoal, int completedBooksCount, int streakDays, List<ReadingProgressDto> activeBooks, List<WeeklyReadingStats> weeklyStats, List<GenreStats> genreStats, List<String> unlockedBadges) {
        this.targetGoal = targetGoal;
        this.completedBooksCount = completedBooksCount;
        this.streakDays = streakDays;
        this.activeBooks = activeBooks;
        this.weeklyStats = weeklyStats;
        this.genreStats = genreStats;
        this.unlockedBadges = unlockedBadges;
    }

    public int getTargetGoal() {
        return targetGoal;
    }

    public void setTargetGoal(int targetGoal) {
        this.targetGoal = targetGoal;
    }

    public int getCompletedBooksCount() {
        return completedBooksCount;
    }

    public void setCompletedBooksCount(int completedBooksCount) {
        this.completedBooksCount = completedBooksCount;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public List<ReadingProgressDto> getActiveBooks() {
        return activeBooks;
    }

    public void setActiveBooks(List<ReadingProgressDto> activeBooks) {
        this.activeBooks = activeBooks;
    }

    public List<WeeklyReadingStats> getWeeklyStats() {
        return weeklyStats;
    }

    public void setWeeklyStats(List<WeeklyReadingStats> weeklyStats) {
        this.weeklyStats = weeklyStats;
    }

    public List<GenreStats> getGenreStats() {
        return genreStats;
    }

    public void setGenreStats(List<GenreStats> genreStats) {
        this.genreStats = genreStats;
    }

    public List<String> getUnlockedBadges() {
        return unlockedBadges;
    }

    public void setUnlockedBadges(List<String> unlockedBadges) {
        this.unlockedBadges = unlockedBadges;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private int targetGoal;
        private int completedBooksCount;
        private int streakDays;
        private List<ReadingProgressDto> activeBooks;
        private List<WeeklyReadingStats> weeklyStats;
        private List<GenreStats> genreStats;
        private List<String> unlockedBadges;

        public Builder targetGoal(int targetGoal) {
            this.targetGoal = targetGoal;
            return this;
        }

        public Builder completedBooksCount(int completedBooksCount) {
            this.completedBooksCount = completedBooksCount;
            return this;
        }

        public Builder streakDays(int streakDays) {
            this.streakDays = streakDays;
            return this;
        }

        public Builder activeBooks(List<ReadingProgressDto> activeBooks) {
            this.activeBooks = activeBooks;
            return this;
        }

        public Builder weeklyStats(List<WeeklyReadingStats> weeklyStats) {
            this.weeklyStats = weeklyStats;
            return this;
        }

        public Builder genreStats(List<GenreStats> genreStats) {
            this.genreStats = genreStats;
            return this;
        }

        public Builder unlockedBadges(List<String> unlockedBadges) {
            this.unlockedBadges = unlockedBadges;
            return this;
        }

        public ReadingTrackerDashboardDto build() {
            return new ReadingTrackerDashboardDto(targetGoal, completedBooksCount, streakDays, activeBooks, weeklyStats, genreStats, unlockedBadges);
        }
    }

    public static class ReadingProgressDto {
        private Long id;
        private Long bookId;
        private String bookTitle;
        private String bookSubtitle;
        private String coverImage;
        private String authorName;
        private String status;
        private int currentPage;
        private int totalPages;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;

        public ReadingProgressDto() {
        }

        public ReadingProgressDto(Long id, Long bookId, String bookTitle, String bookSubtitle, String coverImage, String authorName, String status, int currentPage, int totalPages, LocalDateTime startedAt, LocalDateTime completedAt) {
            this.id = id;
            this.bookId = bookId;
            this.bookTitle = bookTitle;
            this.bookSubtitle = bookSubtitle;
            this.coverImage = coverImage;
            this.authorName = authorName;
            this.status = status;
            this.currentPage = currentPage;
            this.totalPages = totalPages;
            this.startedAt = startedAt;
            this.completedAt = completedAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getBookId() {
            return bookId;
        }

        public void setBookId(Long bookId) {
            this.bookId = bookId;
        }

        public String getBookTitle() {
            return bookTitle;
        }

        public void setBookTitle(String bookTitle) {
            this.bookTitle = bookTitle;
        }

        public String getBookSubtitle() {
            return bookSubtitle;
        }

        public void setBookSubtitle(String bookSubtitle) {
            this.bookSubtitle = bookSubtitle;
        }

        public String getCoverImage() {
            return coverImage;
        }

        public void setCoverImage(String coverImage) {
            this.coverImage = coverImage;
        }

        public String getAuthorName() {
            return authorName;
        }

        public void setAuthorName(String authorName) {
            this.authorName = authorName;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public int getCurrentPage() {
            return currentPage;
        }

        public void setCurrentPage(int currentPage) {
            this.currentPage = currentPage;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }

        public LocalDateTime getStartedAt() {
            return startedAt;
        }

        public void setStartedAt(LocalDateTime startedAt) {
            this.startedAt = startedAt;
        }

        public LocalDateTime getCompletedAt() {
            return completedAt;
        }

        public void setCompletedAt(LocalDateTime completedAt) {
            this.completedAt = completedAt;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private Long id;
            private Long bookId;
            private String bookTitle;
            private String bookSubtitle;
            private String coverImage;
            private String authorName;
            private String status;
            private int currentPage;
            private int totalPages;
            private LocalDateTime startedAt;
            private LocalDateTime completedAt;

            public Builder id(Long id) {
                this.id = id;
                return this;
            }

            public Builder bookId(Long bookId) {
                this.bookId = bookId;
                return this;
            }

            public Builder bookTitle(String bookTitle) {
                this.bookTitle = bookTitle;
                return this;
            }

            public Builder bookSubtitle(String bookSubtitle) {
                this.bookSubtitle = bookSubtitle;
                return this;
            }

            public Builder coverImage(String coverImage) {
                this.coverImage = coverImage;
                return this;
            }

            public Builder authorName(String authorName) {
                this.authorName = authorName;
                return this;
            }

            public Builder status(String status) {
                this.status = status;
                return this;
            }

            public Builder currentPage(int currentPage) {
                this.currentPage = currentPage;
                return this;
            }

            public Builder totalPages(int totalPages) {
                this.totalPages = totalPages;
                return this;
            }

            public Builder startedAt(LocalDateTime startedAt) {
                this.startedAt = startedAt;
                return this;
            }

            public Builder completedAt(LocalDateTime completedAt) {
                this.completedAt = completedAt;
                return this;
            }

            public ReadingProgressDto build() {
                return new ReadingProgressDto(id, bookId, bookTitle, bookSubtitle, coverImage, authorName, status, currentPage, totalPages, startedAt, completedAt);
            }
        }
    }

    public static class WeeklyReadingStats {
        private String day;
        private int minutes;

        public WeeklyReadingStats() {
        }

        public WeeklyReadingStats(String day, int minutes) {
            this.day = day;
            this.minutes = minutes;
        }

        public String getDay() {
            return day;
        }

        public void setDay(String day) {
            this.day = day;
        }

        public int getMinutes() {
            return minutes;
        }

        public void setMinutes(int minutes) {
            this.minutes = minutes;
        }
    }

    public static class GenreStats {
        private String genre;
        private int count;

        public GenreStats() {
        }

        public GenreStats(String genre, int count) {
            this.genre = genre;
            this.count = count;
        }

        public String getGenre() {
            return genre;
        }

        public void setGenre(String genre) {
            this.genre = genre;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }
}
