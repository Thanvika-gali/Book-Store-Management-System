package com.bookverse.backend.service;

import com.bookverse.backend.dto.BookRentalDto;
import com.bookverse.backend.dto.LibraryAdminStatsDto;
import com.bookverse.backend.dto.RentalRequest;
import java.util.List;

public interface BookRentalService {
    BookRentalDto checkoutRental(Long userId, RentalRequest request);
    void returnBook(Long userId, Long rentalId);
    List<BookRentalDto> getMyActiveRentals(Long userId);
    List<BookRentalDto> getAllActiveLoansAdmin();
    LibraryAdminStatsDto getLibraryStatsAdmin();
    void checkAndUpdateOverdueLoans();
    boolean hasActiveRental(Long userId, Long bookId);
}
