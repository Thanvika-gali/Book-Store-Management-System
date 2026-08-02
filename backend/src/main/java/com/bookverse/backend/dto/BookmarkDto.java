package com.bookverse.backend.dto;

import java.time.LocalDateTime;

public class BookmarkDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String highlightText;
    private String note;
    private String color;
    private int chapterNumber;
    private LocalDateTime createdAt;

    public BookmarkDto() {
    }

    public BookmarkDto(Long id, Long bookId, String bookTitle, String highlightText, String note, String color, int chapterNumber, LocalDateTime createdAt) {
        this.id = id;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.highlightText = highlightText;
        this.note = note;
        this.color = color;
        this.chapterNumber = chapterNumber;
        this.createdAt = createdAt;
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

    public int getChapterNumber() {
        return chapterNumber;
    }

    public void setChapterNumber(int chapterNumber) {
        this.chapterNumber = chapterNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long bookId;
        private String bookTitle;
        private String highlightText;
        private String note;
        private String color;
        private int chapterNumber;
        private LocalDateTime createdAt;

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

        public Builder chapterNumber(int chapterNumber) {
            this.chapterNumber = chapterNumber;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public BookmarkDto build() {
            return new BookmarkDto(id, bookId, bookTitle, highlightText, note, color, chapterNumber, createdAt);
        }
    }
}
