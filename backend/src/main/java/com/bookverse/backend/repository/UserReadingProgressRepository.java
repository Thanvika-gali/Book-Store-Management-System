package com.bookverse.backend.repository;

import com.bookverse.backend.entity.ReadingStatus;
import com.bookverse.backend.entity.UserReadingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserReadingProgressRepository extends JpaRepository<UserReadingProgress, Long> {
    Optional<UserReadingProgress> findByUserIdAndBookId(Long userId, Long bookId);
    List<UserReadingProgress> findByUserIdOrderByUpdatedAtDesc(Long userId);
    List<UserReadingProgress> findByUserIdAndStatus(Long userId, ReadingStatus status);
}
