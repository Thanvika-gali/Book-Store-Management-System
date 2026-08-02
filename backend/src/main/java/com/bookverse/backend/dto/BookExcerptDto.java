package com.bookverse.backend.dto;

public class BookExcerptDto {
    private Long id;
    private Long bookId;
    private int chapterNumber;
    private String chapterTitle;
    private String content;

    public BookExcerptDto() {
    }

    public BookExcerptDto(Long id, Long bookId, int chapterNumber, String chapterTitle, String content) {
        this.id = id;
        this.bookId = bookId;
        this.chapterNumber = chapterNumber;
        this.chapterTitle = chapterTitle;
        this.content = content;
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

    public int getChapterNumber() {
        return chapterNumber;
    }

    public void setChapterNumber(int chapterNumber) {
        this.chapterNumber = chapterNumber;
    }

    public String getChapterTitle() {
        return chapterTitle;
    }

    public void setChapterTitle(String chapterTitle) {
        this.chapterTitle = chapterTitle;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long bookId;
        private int chapterNumber;
        private String chapterTitle;
        private String content;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder bookId(Long bookId) {
            this.bookId = bookId;
            return this;
        }

        public Builder chapterNumber(int chapterNumber) {
            this.chapterNumber = chapterNumber;
            return this;
        }

        public Builder chapterTitle(String chapterTitle) {
            this.chapterTitle = chapterTitle;
            return this;
        }

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public BookExcerptDto build() {
            return new BookExcerptDto(id, bookId, chapterNumber, chapterTitle, content);
        }
    }
}
