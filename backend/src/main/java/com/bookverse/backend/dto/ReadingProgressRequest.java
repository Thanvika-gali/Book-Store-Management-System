package com.bookverse.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ReadingProgressRequest {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotNull(message = "Reading status is required")
    private String status;

    private int currentPage;

    public ReadingProgressRequest() {
    }

    public ReadingProgressRequest(Long bookId, String status, int currentPage) {
        this.bookId = bookId;
        this.status = status;
        this.currentPage = currentPage;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
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

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long bookId;
        private String status;
        private int currentPage;

        public Builder bookId(Long bookId) {
            this.bookId = bookId;
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

        public ReadingProgressRequest build() {
            return new ReadingProgressRequest(bookId, status, currentPage);
        }
    }
}
