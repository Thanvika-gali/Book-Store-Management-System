package com.bookverse.backend.controller;

import com.bookverse.backend.dto.BookmarkDto;
import com.bookverse.backend.dto.BookmarkRequest;
import com.bookverse.backend.dto.MessageResponse;
import com.bookverse.backend.security.SecurityUtils;
import com.bookverse.backend.service.BookmarkService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping
    public ResponseEntity<BookmarkDto> saveBookmark(@Valid @RequestBody BookmarkRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(bookmarkService.saveBookmark(userId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteBookmark(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        bookmarkService.deleteBookmark(userId, id);
        return ResponseEntity.ok(new MessageResponse("Highlight bookmark deleted successfully"));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BookmarkDto>> getBookmarksForBook(@PathVariable Long bookId) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(bookmarkService.getBookmarksForBook(userId, bookId));
    }

    @GetMapping
    public ResponseEntity<List<BookmarkDto>> getBookmarksForUser() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(bookmarkService.getBookmarksForUser(userId));
    }
}
