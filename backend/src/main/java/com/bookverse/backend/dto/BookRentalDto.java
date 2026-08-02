package com.bookverse.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookRentalDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String coverImage;
    private String authorName;
    private String rentalType;
    private BigDecimal price;
    private int durationDays;
    private LocalDateTime startedAt;
    private LocalDateTime dueDate;
    private LocalDateTime returnedAt;
    private String status;
    private String userEmail;
    private String userName;

    public BookRentalDto() {
    }

    public BookRentalDto(Long id, Long bookId, String bookTitle, String coverImage, String authorName, String rentalType, BigDecimal price, int durationDays, LocalDateTime startedAt, LocalDateTime dueDate, LocalDateTime returnedAt, String status, String userEmail, String userName) {
        this.id = id;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.coverImage = coverImage;
        this.authorName = authorName;
        this.rentalType = rentalType;
        this.price = price;
        this.durationDays = durationDays;
        this.startedAt = startedAt;
        this.dueDate = dueDate;
        this.returnedAt = returnedAt;
        this.status = status;
        this.userEmail = userEmail;
        this.userName = userName;
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

    public String getRentalType() {
        return rentalType;
    }

    public void setRentalType(String rentalType) {
        this.rentalType = rentalType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getReturnedAt() {
        return returnedAt;
    }

    public void setReturnedAt(LocalDateTime returnedAt) {
        this.returnedAt = returnedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long bookId;
        private String bookTitle;
        private String coverImage;
        private String authorName;
        private String rentalType;
        private BigDecimal price;
        private int durationDays;
        private LocalDateTime startedAt;
        private LocalDateTime dueDate;
        private LocalDateTime returnedAt;
        private String status;
        private String userEmail;
        private String userName;

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

        public Builder coverImage(String coverImage) {
            this.coverImage = coverImage;
            return this;
        }

        public Builder authorName(String authorName) {
            this.authorName = authorName;
            return this;
        }

        public Builder rentalType(String rentalType) {
            this.rentalType = rentalType;
            return this;
        }

        public Builder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public Builder durationDays(int durationDays) {
            this.durationDays = durationDays;
            return this;
        }

        public Builder startedAt(LocalDateTime startedAt) {
            this.startedAt = startedAt;
            return this;
        }

        public Builder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public Builder returnedAt(LocalDateTime returnedAt) {
            this.returnedAt = returnedAt;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder userEmail(String userEmail) {
            this.userEmail = userEmail;
            return this;
        }

        public Builder userName(String userName) {
            this.userName = userName;
            return this;
        }

        public BookRentalDto build() {
            return new BookRentalDto(id, bookId, bookTitle, coverImage, authorName, rentalType, price, durationDays, startedAt, dueDate, returnedAt, status, userEmail, userName);
        }
    }
}
