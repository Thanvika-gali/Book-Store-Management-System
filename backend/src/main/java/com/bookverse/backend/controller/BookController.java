package com.bookverse.backend.controller;

import com.bookverse.backend.dto.*;
import com.bookverse.backend.security.SecurityUtils;
import com.bookverse.backend.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/books")
    public ResponseEntity<Page<BookDto>> getBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) Long publisherId,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean discount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {

        // Build sorting criteria
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
        
        // Handle custom sorting overrides for client compatibility
        if (sortField.equalsIgnoreCase("newest")) {
            sortField = "createdAt";
        } else if (sortField.equalsIgnoreCase("rating")) {
            sortField = "rating";
        } else if (sortField.equalsIgnoreCase("popularity")) {
            sortField = "reviewCount";
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        
        // Dynamic search history logging if keyword is present
        if (keyword != null && !keyword.trim().isEmpty()) {
            Long currentUserId = SecurityUtils.getCurrentUserId();
            if (currentUserId != null) {
                bookService.addSearchHistory(currentUserId, keyword);
            }
        }

        Page<BookDto> books = bookService.getAllBooks(keyword, categoryId, authorId, publisherId, 
                language, minPrice, maxPrice, discount, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        BookDto book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    @GetMapping("/books/isbn/{isbn}")
    public ResponseEntity<BookDto> getBookByIsbn(@PathVariable String isbn) {
        BookDto book = bookService.getBookByIsbn(isbn);
        return ResponseEntity.ok(book);
    }

    @GetMapping("/books/trending")
    public ResponseEntity<List<BookDto>> getTrending() {
        return ResponseEntity.ok(bookService.getTrendingBooks());
    }

    @GetMapping("/books/new-arrivals")
    public ResponseEntity<List<BookDto>> getNewArrivals() {
        return ResponseEntity.ok(bookService.getNewArrivals());
    }

    @GetMapping("/books/recommended")
    public ResponseEntity<List<BookDto>> getRecommended() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.ok(bookService.getTrendingBooks());
        }
        return ResponseEntity.ok(bookService.getRecommendedBooks(currentUserId));
    }

    @GetMapping("/books/{id}/related")
    public ResponseEntity<List<BookDto>> getRelated(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getRelatedBooks(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(bookService.getAllCategories());
    }

    @GetMapping("/authors")
    public ResponseEntity<List<AuthorDto>> getAuthors() {
        return ResponseEntity.ok(bookService.getAllAuthors());
    }

    @GetMapping("/publishers")
    public ResponseEntity<List<PublisherDto>> getPublishers() {
        return ResponseEntity.ok(bookService.getAllPublishers());
    }

    @GetMapping("/books/suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam String query) {
        return ResponseEntity.ok(bookService.getSearchSuggestions(query));
    }
}
