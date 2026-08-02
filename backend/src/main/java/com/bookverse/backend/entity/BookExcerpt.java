package com.bookverse.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "book_excerpts")
public class BookExcerpt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "chapter_number", nullable = false)
    private int chapterNumber;

    @Column(name = "chapter_title", nullable = false)
    private String chapterTitle;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    public BookExcerpt() {
    }

    public BookExcerpt(Long id, Book book, int chapterNumber, String chapterTitle, String content) {
        this.id = id;
        this.book = book;
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

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
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
        private Book book;
        private int chapterNumber;
        private String chapterTitle;
        private String content;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder book(Book book) {
            this.book = book;
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

        public BookExcerpt build() {
            return new BookExcerpt(id, book, chapterNumber, chapterTitle, content);
        }
    }
}
