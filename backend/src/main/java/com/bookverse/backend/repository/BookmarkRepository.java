package com.bookverse.backend.repository;

import com.bookverse.backend.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserIdAndBookIdOrderByCreatedAtDesc(Long userId, Long bookId);
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);
}
