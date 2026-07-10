package com.bookverse.backend.dto;

import java.math.BigDecimal;

public class WishlistDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private BigDecimal bookPrice;
    private BigDecimal bookDiscountPrice;
    private String bookCoverImage;

    public WishlistDto() {
    }

    public WishlistDto(Long id, Long bookId, String bookTitle, BigDecimal bookPrice, BigDecimal bookDiscountPrice, String bookCoverImage) {
        this.id = id;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.bookPrice = bookPrice;
        this.bookDiscountPrice = bookDiscountPrice;
        this.bookCoverImage = bookCoverImage;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookId() {
        return this.bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getBookTitle() {
        return this.bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public BigDecimal getBookPrice() {
        return this.bookPrice;
    }

    public void setBookPrice(BigDecimal bookPrice) {
        this.bookPrice = bookPrice;
    }

    public BigDecimal getBookDiscountPrice() {
        return this.bookDiscountPrice;
    }

    public void setBookDiscountPrice(BigDecimal bookDiscountPrice) {
        this.bookDiscountPrice = bookDiscountPrice;
    }

    public String getBookCoverImage() {
        return this.bookCoverImage;
    }

    public void setBookCoverImage(String bookCoverImage) {
        this.bookCoverImage = bookCoverImage;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long bookId;
        private String bookTitle;
        private BigDecimal bookPrice;
        private BigDecimal bookDiscountPrice;
        private String bookCoverImage;

        public Builder() {
        }

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

        public Builder bookPrice(BigDecimal bookPrice) {
            this.bookPrice = bookPrice;
            return this;
        }

        public Builder bookDiscountPrice(BigDecimal bookDiscountPrice) {
            this.bookDiscountPrice = bookDiscountPrice;
            return this;
        }

        public Builder bookCoverImage(String bookCoverImage) {
            this.bookCoverImage = bookCoverImage;
            return this;
        }

        public WishlistDto build() {
            return new WishlistDto(this.id, this.bookId, this.bookTitle, this.bookPrice, this.bookDiscountPrice, this.bookCoverImage);
        }
    }
}
