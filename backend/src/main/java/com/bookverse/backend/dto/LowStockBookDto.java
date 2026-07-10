package com.bookverse.backend.dto;

public class LowStockBookDto {
    private Long id;
    private String title;
    private Integer stock;
    private String coverImage;

    public LowStockBookDto() {
    }

    public LowStockBookDto(Long id, String title, Integer stock, String coverImage) {
        this.id = id;
        this.title = title;
        this.stock = stock;
        this.coverImage = coverImage;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getStock() {
        return this.stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
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
        private Long id;
        private String title;
        private Integer stock;
        private String coverImage;

        public Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder stock(Integer stock) {
            this.stock = stock;
            return this;
        }

        public Builder coverImage(String coverImage) {
            this.coverImage = coverImage;
            return this;
        }

        public LowStockBookDto build() {
            return new LowStockBookDto(this.id, this.title, this.stock, this.coverImage);
        }
    }
}
