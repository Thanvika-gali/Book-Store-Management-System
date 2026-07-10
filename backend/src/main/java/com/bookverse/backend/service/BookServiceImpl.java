package com.bookverse.backend.service;

import com.bookverse.backend.dto.*;
import com.bookverse.backend.entity.*;
import com.bookverse.backend.exception.ResourceNotFoundException;
import com.bookverse.backend.mapper.*;
import com.bookverse.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final UserRepository userRepository;

    public BookServiceImpl(BookRepository bookRepository,
                           CategoryRepository categoryRepository,
                           AuthorRepository authorRepository,
                           PublisherRepository publisherRepository,
                           SearchHistoryRepository searchHistoryRepository,
                           UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.searchHistoryRepository = searchHistoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Page<BookDto> getAllBooks(String keyword, Long categoryId, Long authorId, Long publisherId,
                                     String language, BigDecimal minPrice, BigDecimal maxPrice,
                                     Boolean discount, Pageable pageable) {

        Specification<Book> spec = Specification.where(null);

        if (keyword != null && !keyword.trim().isEmpty()) {
            spec = spec.and(BookSpecification.hasKeyword(keyword.trim()));
        }
        if (categoryId != null) {
            spec = spec.and(BookSpecification.hasCategory(categoryId));
        }
        if (authorId != null) {
            spec = spec.and(BookSpecification.hasAuthor(authorId));
        }
        if (publisherId != null) {
            spec = spec.and(BookSpecification.hasPublisher(publisherId));
        }
        if (language != null && !language.trim().isEmpty()) {
            spec = spec.and(BookSpecification.hasLanguage(language.trim()));
        }
        if (minPrice != null || maxPrice != null) {
            spec = spec.and(BookSpecification.hasPriceBetween(minPrice, maxPrice));
        }
        if (discount != null && discount) {
            spec = spec.and(BookSpecification.hasDiscount());
        }

        return bookRepository.findAll(spec, pageable).map(BookMapper::toDto);
    }

    @Override
    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));
        return BookMapper.toDto(book);
    }

    @Override
    public BookDto getBookByIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ISBN: " + isbn));
        return BookMapper.toDto(book);
    }

    @Override
    public List<BookDto> getTrendingBooks() {
        // Return top 5 books sorted by rating and review count descending
        Pageable topFive = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "rating", "reviewCount"));
        return bookRepository.findAll(topFive).getContent().stream()
                .map(BookMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookDto> getNewArrivals() {
        // Return top 5 newest books
        Pageable topFive = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        return bookRepository.findAll(topFive).getContent().stream()
                .map(BookMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookDto> getRecommendedBooks(Long userId) {
        // Find user's search history to recommend related categories
        List<SearchHistory> history = searchHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (history.isEmpty()) {
            // Fallback: return highest-rated books
            return getTrendingBooks();
        }

        // Get the latest query keyword
        String latestQuery = history.get(0).getQuery();
        
        // Find books matching this keyword or category
        Pageable topFive = PageRequest.of(0, 5);
        Specification<Book> spec = BookSpecification.hasKeyword(latestQuery);
        List<Book> books = bookRepository.findAll(spec, topFive).getContent();

        if (books.isEmpty()) {
            return getTrendingBooks();
        }

        return books.stream()
                .map(BookMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookDto> getRelatedBooks(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));
        
        // Return up to 5 books in the same category (excluding current book)
        Pageable topFive = PageRequest.of(0, 5);
        Specification<Book> spec = BookSpecification.hasCategory(book.getCategory().getId())
                .and((root, query, cb) -> cb.notEqual(root.get("id"), bookId));

        return bookRepository.findAll(spec, topFive).getContent().stream()
                .map(BookMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AuthorDto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(AuthorMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PublisherDto> getAllPublishers() {
        return publisherRepository.findAll().stream()
                .map(PublisherMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addSearchHistory(Long userId, String query) {
        if (query == null || query.trim().isEmpty()) {
            return;
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            SearchHistory history = SearchHistory.builder()
                    .user(user)
                    .query(query.trim())
                    .build();
            searchHistoryRepository.save(history);
        }
    }

    @Override
    public List<String> getSearchSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        // Fetch top 5 books containing this keyword in title and return their titles
        Pageable topFive = PageRequest.of(0, 5);
        Specification<Book> spec = (root, q, cb) -> cb.like(cb.lower(root.get("title")), "%" + query.toLowerCase() + "%");
        return bookRepository.findAll(spec, topFive).getContent().stream()
                .map(Book::getTitle)
                .collect(Collectors.toList());
    }
}
