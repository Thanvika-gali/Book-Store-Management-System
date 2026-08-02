package com.bookverse.backend.repository;

import com.bookverse.backend.entity.BookExcerpt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookExcerptRepository extends JpaRepository<BookExcerpt, Long> {
    List<BookExcerpt> findByBookIdOrderByChapterNumberAsc(Long bookId);
}
