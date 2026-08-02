package com.bookverse.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ReadingSessionRequest {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private int durationMinutes;

    public ReadingSessionRequest() {
    }

    public ReadingSessionRequest(Long bookId, int durationMinutes) {
        this.bookId = bookId;
        this.durationMinutes = durationMinutes;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long bookId;
        private int durationMinutes;

        public Builder bookId(Long bookId) {
            this.bookId = bookId;
            return this;
        }

        public Builder durationMinutes(int durationMinutes) {
            this.durationMinutes = durationMinutes;
            return this;
        }

        public ReadingSessionRequest build() {
            return new ReadingSessionRequest(bookId, durationMinutes);
        }
    }
}
