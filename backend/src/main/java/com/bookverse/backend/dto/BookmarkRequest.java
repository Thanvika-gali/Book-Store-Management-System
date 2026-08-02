package com.bookverse.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookmarkRequest {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotBlank(message = "Highlight text cannot be empty")
    private String highlightText;

    private String note;

    private String color;

    @NotNull(message = "Chapter number is required")
    private Integer chapterNumber;

    public BookmarkRequest() {
    }

    public BookmarkRequest(Long bookId, String highlightText, String note, String color, Integer chapterNumber) {
        this.bookId = bookId;
        this.highlightText = highlightText;
        this.note = note;
        this.color = color;
        this.chapterNumber = chapterNumber;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getHighlightText() {
        return highlightText;
    }

    public void setHighlightText(String highlightText) {
        this.highlightText = highlightText;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getChapterNumber() {
        return chapterNumber;
    }

    public void setChapterNumber(Integer chapterNumber) {
        this.chapterNumber = chapterNumber;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long bookId;
        private String highlightText;
        private String note;
        private String color;
        private Integer chapterNumber;

        public Builder bookId(Long bookId) {
            this.bookId = bookId;
            return this;
        }

        public Builder highlightText(String highlightText) {
            this.highlightText = highlightText;
            return this;
        }

        public Builder note(String note) {
            this.note = note;
            return this;
        }

        public Builder color(String color) {
            this.color = color;
            return this;
        }

        public Builder chapterNumber(Integer chapterNumber) {
            this.chapterNumber = chapterNumber;
            return this;
        }

        public BookmarkRequest build() {
            return new BookmarkRequest(bookId, highlightText, note, color, chapterNumber);
        }
    }
}
