package com.bookverse.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reading_sessions")
public class ReadingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;

    @Column(name = "read_at", nullable = false)
    private LocalDate readAt;

    public ReadingSession() {
    }

    public ReadingSession(Long id, User user, Book book, int durationMinutes, LocalDate readAt) {
        this.id = id;
        this.user = user;
        this.book = book;
        this.durationMinutes = durationMinutes;
        this.readAt = readAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LocalDate getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDate readAt) {
        this.readAt = readAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private Book book;
        private int durationMinutes;
        private LocalDate readAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder book(Book book) {
            this.book = book;
            return this;
        }

        public Builder durationMinutes(int durationMinutes) {
            this.durationMinutes = durationMinutes;
            return this;
        }

        public Builder readAt(LocalDate readAt) {
            this.readAt = readAt;
            return this;
        }

        public ReadingSession build() {
            return new ReadingSession(id, user, book, durationMinutes, readAt);
        }
    }
}
