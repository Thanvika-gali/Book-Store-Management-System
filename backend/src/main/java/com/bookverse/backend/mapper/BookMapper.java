package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.BookDto;
import com.bookverse.backend.dto.BookRequest;
import com.bookverse.backend.entity.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class BookMapper {

    public static BookDto toDto(Book book) {
        if (book == null) {
            return null;
        }

        List<String> additionalImages = new ArrayList<>();
        if (book.getBookImages() != null) {
            additionalImages = book.getBookImages().stream()
                    .map(BookImage::getImageUrl)
                    .collect(Collectors.toList());
        }

        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .subtitle(book.getSubtitle())
                .isbn(book.getIsbn())
                .author(AuthorMapper.toDto(book.getAuthor()))
                .publisher(PublisherMapper.toDto(book.getPublisher()))
                .category(CategoryMapper.toDto(book.getCategory()))
                .language(book.getLanguage())
                .description(book.getDescription())
                .price(book.getPrice())
                .discountPrice(book.getDiscountPrice())
                .discountPercentage(book.getDiscountPercentage())
                .stock(book.getStock())
                .pages(book.getPages())
                .publicationDate(book.getPublicationDate())
                .rating(book.getRating())
                .reviewCount(book.getReviewCount())
                .availability(book.getAvailability() != null ? book.getAvailability() : book.getStock() > 0)
                .coverImage(book.getCoverImage())
                .bookImages(additionalImages)
                .build();
    }

    public static Book toEntity(BookRequest request, Author author, Publisher publisher, Category category) {
        if (request == null) {
            return null;
        }

        return Book.builder()
                .title(request.getTitle())
                .subtitle(request.getSubtitle())
                .isbn(request.getIsbn())
                .author(author)
                .publisher(publisher)
                .category(category)
                .language(request.getLanguage() != null ? request.getLanguage() : "English")
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice() != null ? request.getDiscountPrice() : java.math.BigDecimal.ZERO)
                .discountPercentage(request.getDiscountPercentage() != null ? request.getDiscountPercentage() : 0)
                .stock(request.getStock())
                .pages(request.getPages())
                .publicationDate(request.getPublicationDate())
                .coverImage(request.getCoverImage())
                .build();
    }

    public static void updateEntityFromRequest(BookRequest request, Book book, Author author, Publisher publisher, Category category) {
        if (request == null || book == null) {
            return;
        }

        book.setTitle(request.getTitle());
        book.setSubtitle(request.getSubtitle());
        book.setIsbn(request.getIsbn());
        book.setAuthor(author);
        book.setPublisher(publisher);
        book.setCategory(category);
        if (request.getLanguage() != null) {
            book.setLanguage(request.getLanguage());
        }
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        if (request.getDiscountPrice() != null) {
            book.setDiscountPrice(request.getDiscountPrice());
        }
        if (request.getDiscountPercentage() != null) {
            book.setDiscountPercentage(request.getDiscountPercentage());
        }
        book.setStock(request.getStock());
        book.setPages(request.getPages());
        if (request.getPublicationDate() != null) {
            book.setPublicationDate(request.getPublicationDate());
        }
        if (request.getCoverImage() != null) {
            book.setCoverImage(request.getCoverImage());
        }
    }
}
