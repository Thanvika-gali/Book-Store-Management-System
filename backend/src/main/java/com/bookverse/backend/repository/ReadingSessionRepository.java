package com.bookverse.backend.repository;

import com.bookverse.backend.entity.ReadingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReadingSessionRepository extends JpaRepository<ReadingSession, Long> {
    List<ReadingSession> findByUserIdAndReadAtAfterOrderByReadAtAsc(Long userId, LocalDate date);
    List<ReadingSession> findByUserIdOrderByReadAtDesc(Long userId);
}
