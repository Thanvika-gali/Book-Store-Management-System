package com.bookverse.backend.dto;

import java.math.BigDecimal;

public class MostSoldBookDto {
    private Long bookId;
    private String title;
    private String authorName;
    private Long quantitySold;
    private BigDecimal revenueGenerated;
    private String coverImage;

    public MostSoldBookDto() {
    }

    public MostSoldBookDto(Long bookId, String title, String authorName, Long quantitySold, BigDecimal revenueGenerated, String coverImage) {
        this.bookId = bookId;
        this.title = title;
        this.authorName = authorName;
        this.quantitySold = quantitySold;
        this.revenueGenerated = revenueGenerated;
        this.coverImage = coverImage;
    }

    public Long getBookId() {
        return this.bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthorName() {
        return this.authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public Long getQuantitySold() {
        return this.quantitySold;
    }

    public void setQuantitySold(Long quantitySold) {
        this.quantitySold = quantitySold;
    }

    public BigDecimal getRevenueGenerated() {
        return this.revenueGenerated;
    }

    public void setRevenueGenerated(BigDecimal revenueGenerated) {
        this.revenueGenerated = revenueGenerated;
    }

    public String getCoverImage() {
        return this.coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long bookId;
        private String title;
        private String authorName;
        private Long quantitySold;
        private BigDecimal revenueGenerated;
        private String coverImage;

        public Builder() {
        }

        public Builder bookId(Long bookId) {
            this.bookId = bookId;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder authorName(String authorName) {
            this.authorName = authorName;
            return this;
        }

        public Builder quantitySold(Long quantitySold) {
            this.quantitySold = quantitySold;
            return this;
        }

        public Builder revenueGenerated(BigDecimal revenueGenerated) {
            this.revenueGenerated = revenueGenerated;
            return this;
        }

        public Builder coverImage(String coverImage) {
            this.coverImage = coverImage;
            return this;
        }

        public MostSoldBookDto build() {
            return new MostSoldBookDto(this.bookId, this.title, this.authorName, this.quantitySold, this.revenueGenerated, this.coverImage);
        }
    }
}
