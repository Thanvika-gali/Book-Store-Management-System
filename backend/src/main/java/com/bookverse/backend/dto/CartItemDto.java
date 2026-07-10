package com.bookverse.backend.dto;

import java.math.BigDecimal;

public class CartItemDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private BigDecimal bookPrice;
    private BigDecimal bookDiscountPrice;
    private Integer bookDiscountPercentage;
    private String bookCoverImage;
    private Integer quantity;

    public CartItemDto() {
    }

    public CartItemDto(Long id, Long bookId, String bookTitle, BigDecimal bookPrice, BigDecimal bookDiscountPrice, Integer bookDiscountPercentage, String bookCoverImage, Integer quantity) {
        this.id = id;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.bookPrice = bookPrice;
        this.bookDiscountPrice = bookDiscountPrice;
        this.bookDiscountPercentage = bookDiscountPercentage;
        this.bookCoverImage = bookCoverImage;
        this.quantity = quantity;
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

    public Integer getBookDiscountPercentage() {
        return this.bookDiscountPercentage;
    }

    public void setBookDiscountPercentage(Integer bookDiscountPercentage) {
        this.bookDiscountPercentage = bookDiscountPercentage;
    }

    public String getBookCoverImage() {
        return this.bookCoverImage;
    }

    public void setBookCoverImage(String bookCoverImage) {
        this.bookCoverImage = bookCoverImage;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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
        private Integer bookDiscountPercentage;
        private String bookCoverImage;
        private Integer quantity;

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

        public Builder bookDiscountPercentage(Integer bookDiscountPercentage) {
            this.bookDiscountPercentage = bookDiscountPercentage;
            return this;
        }

        public Builder bookCoverImage(String bookCoverImage) {
            this.bookCoverImage = bookCoverImage;
            return this;
        }

        public Builder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public CartItemDto build() {
            return new CartItemDto(this.id, this.bookId, this.bookTitle, this.bookPrice, this.bookDiscountPrice, this.bookDiscountPercentage, this.bookCoverImage, this.quantity);
        }
    }
}
