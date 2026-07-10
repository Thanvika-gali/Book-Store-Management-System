package com.bookverse.backend.dto;

import java.math.BigDecimal;

public class OrderItemDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookCoverImage;
    private Integer quantity;
    private BigDecimal price;

    public OrderItemDto() {
    }

    public OrderItemDto(Long id, Long bookId, String bookTitle, String bookCoverImage, Integer quantity, BigDecimal price) {
        this.id = id;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.bookCoverImage = bookCoverImage;
        this.quantity = quantity;
        this.price = price;
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

    public BigDecimal getPrice() {
        return this.price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long bookId;
        private String bookTitle;
        private String bookCoverImage;
        private Integer quantity;
        private BigDecimal price;

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

        public Builder bookCoverImage(String bookCoverImage) {
            this.bookCoverImage = bookCoverImage;
            return this;
        }

        public Builder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public OrderItemDto build() {
            return new OrderItemDto(this.id, this.bookId, this.bookTitle, this.bookCoverImage, this.quantity, this.price);
        }
    }
}
