package com.bookverse.backend.repository;

import com.bookverse.backend.entity.BookRental;
import com.bookverse.backend.entity.RentalStatus;
import com.bookverse.backend.entity.RentalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRentalRepository extends JpaRepository<BookRental, Long> {
    List<BookRental> findByUserIdOrderByStartedAtDesc(Long userId);
    List<BookRental> findByUserIdAndBookIdAndStatus(Long userId, Long bookId, RentalStatus status);
    long countByUserIdAndRentalTypeAndStatus(Long userId, RentalType rentalType, RentalStatus status);
    List<BookRental> findByStatus(RentalStatus status);
    List<BookRental> findAllByOrderByStartedAtDesc();
}
