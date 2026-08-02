package com.bookverse.backend.service;

import com.bookverse.backend.dto.BookmarkDto;
import com.bookverse.backend.dto.BookmarkRequest;
import java.util.List;

public interface BookmarkService {
    BookmarkDto saveBookmark(Long userId, BookmarkRequest request);
    void deleteBookmark(Long userId, Long bookmarkId);
    List<BookmarkDto> getBookmarksForBook(Long userId, Long bookId);
    List<BookmarkDto> getBookmarksForUser(Long userId);
}
