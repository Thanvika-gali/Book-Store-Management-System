package com.bookverse.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class BookDto {
    private Long id;
    private String title;
    private String subtitle;
    private String isbn;
    private AuthorDto author;
    private PublisherDto publisher;
    private CategoryDto category;
    private String language;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer discountPercentage;
    private Integer stock;
    private Integer pages;
    private LocalDate publicationDate;
    private BigDecimal rating;
    private Integer reviewCount;
    private Boolean availability;
    private String coverImage;
    private List<String> bookImages;

    public BookDto() {
    }

    public BookDto(Long id, String title, String subtitle, String isbn, AuthorDto author, PublisherDto publisher, CategoryDto category, String language, String description, BigDecimal price, BigDecimal discountPrice, Integer discountPercentage, Integer stock, Integer pages, LocalDate publicationDate, BigDecimal rating, Integer reviewCount, Boolean availability, String coverImage, List<String> bookImages) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.isbn = isbn;
        this.author = author;
        this.publisher = publisher;
        this.category = category;
        this.language = language;
        this.description = description;
        this.price = price;
        this.discountPrice = discountPrice;
        this.discountPercentage = discountPercentage;
        this.stock = stock;
        this.pages = pages;
        this.publicationDate = publicationDate;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.availability = availability;
        this.coverImage = coverImage;
        this.bookImages = bookImages;
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

    public String getSubtitle() {
        return this.subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getIsbn() {
        return this.isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public AuthorDto getAuthor() {
        return this.author;
    }

    public void setAuthor(AuthorDto author) {
        this.author = author;
    }

    public PublisherDto getPublisher() {
        return this.publisher;
    }

    public void setPublisher(PublisherDto publisher) {
        this.publisher = publisher;
    }

    public CategoryDto getCategory() {
        return this.category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscountPrice() {
        return this.discountPrice;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }

    public Integer getDiscountPercentage() {
        return this.discountPercentage;
    }

    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public Integer getStock() {
        return this.stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getPages() {
        return this.pages;
    }

    public void setPages(Integer pages) {
        this.pages = pages;
    }

    public LocalDate getPublicationDate() {
        return this.publicationDate;
    }

    public void setPublicationDate(LocalDate publicationDate) {
        this.publicationDate = publicationDate;
    }

    public BigDecimal getRating() {
        return this.rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return this.reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Boolean getAvailability() {
        return this.availability;
    }

    public void setAvailability(Boolean availability) {
        this.availability = availability;
    }

    public String getCoverImage() {
        return this.coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public List<String> getBookImages() {
        return this.bookImages;
    }

    public void setBookImages(List<String> bookImages) {
        this.bookImages = bookImages;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String subtitle;
        private String isbn;
        private AuthorDto author;
        private PublisherDto publisher;
        private CategoryDto category;
        private String language;
        private String description;
        private BigDecimal price;
        private BigDecimal discountPrice;
        private Integer discountPercentage;
        private Integer stock;
        private Integer pages;
        private LocalDate publicationDate;
        private BigDecimal rating;
        private Integer reviewCount;
        private Boolean availability;
        private String coverImage;
        private List<String> bookImages;

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

        public Builder subtitle(String subtitle) {
            this.subtitle = subtitle;
            return this;
        }

        public Builder isbn(String isbn) {
            this.isbn = isbn;
            return this;
        }

        public Builder author(AuthorDto author) {
            this.author = author;
            return this;
        }

        public Builder publisher(PublisherDto publisher) {
            this.publisher = publisher;
            return this;
        }

        public Builder category(CategoryDto category) {
            this.category = category;
            return this;
        }

        public Builder language(String language) {
            this.language = language;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public Builder discountPrice(BigDecimal discountPrice) {
            this.discountPrice = discountPrice;
            return this;
        }

        public Builder discountPercentage(Integer discountPercentage) {
            this.discountPercentage = discountPercentage;
            return this;
        }

        public Builder stock(Integer stock) {
            this.stock = stock;
            return this;
        }

        public Builder pages(Integer pages) {
            this.pages = pages;
            return this;
        }

        public Builder publicationDate(LocalDate publicationDate) {
            this.publicationDate = publicationDate;
            return this;
        }

        public Builder rating(BigDecimal rating) {
            this.rating = rating;
            return this;
        }

        public Builder reviewCount(Integer reviewCount) {
            this.reviewCount = reviewCount;
            return this;
        }

        public Builder availability(Boolean availability) {
            this.availability = availability;
            return this;
        }

        public Builder coverImage(String coverImage) {
            this.coverImage = coverImage;
            return this;
        }

        public Builder bookImages(List<String> bookImages) {
            this.bookImages = bookImages;
            return this;
        }

        public BookDto build() {
            return new BookDto(this.id, this.title, this.subtitle, this.isbn, this.author, this.publisher, this.category, this.language, this.description, this.price, this.discountPrice, this.discountPercentage, this.stock, this.pages, this.publicationDate, this.rating, this.reviewCount, this.availability, this.coverImage, this.bookImages);
        }
    }
}
