package com.bookverse.backend.service;

import com.bookverse.backend.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface BookService {
    Page<BookDto> getAllBooks(String keyword, Long categoryId, Long authorId, Long publisherId, 
                              String language, BigDecimal minPrice, BigDecimal maxPrice, 
                              Boolean discount, Pageable pageable);
    BookDto getBookById(Long id);
    BookDto getBookByIsbn(String isbn);
    List<BookDto> getTrendingBooks();
    List<BookDto> getNewArrivals();
    List<BookDto> getRecommendedBooks(Long userId);
    List<BookDto> getRelatedBooks(Long bookId);
    
    // Metadata Lookup
    List<CategoryDto> getAllCategories();
    List<AuthorDto> getAllAuthors();
    List<PublisherDto> getAllPublishers();
    
    // Search Helpers
    void addSearchHistory(Long userId, String query);
    List<String> getSearchSuggestions(String query);
}
