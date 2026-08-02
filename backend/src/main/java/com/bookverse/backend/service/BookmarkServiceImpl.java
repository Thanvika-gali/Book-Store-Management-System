package com.bookverse.backend.service;

import com.bookverse.backend.dto.BookmarkDto;
import com.bookverse.backend.dto.BookmarkRequest;
import com.bookverse.backend.entity.Book;
import com.bookverse.backend.entity.Bookmark;
import com.bookverse.backend.entity.User;
import com.bookverse.backend.exception.ResourceNotFoundException;
import com.bookverse.backend.repository.BookRepository;
import com.bookverse.backend.repository.BookmarkRepository;
import com.bookverse.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookmarkServiceImpl(BookmarkRepository bookmarkRepository,
                               BookRepository bookRepository,
                               UserRepository userRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public BookmarkDto saveBookmark(Long userId, BookmarkRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + request.getBookId()));

        Bookmark bookmark = Bookmark.builder()
                .user(user)
                .book(book)
                .highlightText(request.getHighlightText().trim())
                .note(request.getNote() != null ? request.getNote().trim() : null)
                .color(request.getColor() != null ? request.getColor().trim() : "yellow")
                .chapterNumber(request.getChapterNumber())
                .build();

        Bookmark saved = bookmarkRepository.save(bookmark);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void deleteBookmark(Long userId, Long bookmarkId) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found with ID: " + bookmarkId));

        if (!bookmark.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to delete this bookmark");
        }

        bookmarkRepository.delete(bookmark);
    }

    @Override
    public List<BookmarkDto> getBookmarksForBook(Long userId, Long bookId) {
        return bookmarkRepository.findByUserIdAndBookIdOrderByCreatedAtDesc(userId, bookId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookmarkDto> getBookmarksForUser(Long userId) {
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private BookmarkDto mapToDto(Bookmark bookmark) {
        return BookmarkDto.builder()
                .id(bookmark.getId())
                .bookId(bookmark.getBook().getId())
                .bookTitle(bookmark.getBook().getTitle())
                .highlightText(bookmark.getHighlightText())
                .note(bookmark.getNote())
                .color(bookmark.getColor())
                .chapterNumber(bookmark.getChapterNumber())
                .createdAt(bookmark.getCreatedAt())
                .build();
    }
}
