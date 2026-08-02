package com.bookverse.backend.controller;

import com.bookverse.backend.dto.BookRentalDto;
import com.bookverse.backend.dto.LibraryAdminStatsDto;
import com.bookverse.backend.dto.MessageResponse;
import com.bookverse.backend.dto.RentalRequest;
import com.bookverse.backend.security.SecurityUtils;
import com.bookverse.backend.service.BookRentalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BookRentalController {

    private final BookRentalService rentalService;

    public BookRentalController(BookRentalService rentalService) {
        this.rentalService = rentalService;
    }

    // Customer Endpoints

    @PostMapping("/library/checkout")
    public ResponseEntity<BookRentalDto> checkoutBook(@Valid @RequestBody RentalRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(rentalService.checkoutRental(userId, request));
    }

    @PostMapping("/library/return/{id}")
    public ResponseEntity<MessageResponse> returnBook(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        rentalService.returnBook(userId, id);
        return ResponseEntity.ok(new MessageResponse("Book returned to the library successfully"));
    }

    @GetMapping("/library/my-books")
    public ResponseEntity<List<BookRentalDto>> getMyActiveBooks() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(rentalService.getMyActiveRentals(userId));
    }

    // Admin Endpoints

    @GetMapping("/admin/library/active-loans")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookRentalDto>> getAllActiveLoans() {
        return ResponseEntity.ok(rentalService.getAllActiveLoansAdmin());
    }

    @GetMapping("/admin/library/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LibraryAdminStatsDto> getLibraryStats() {
        return ResponseEntity.ok(rentalService.getLibraryStatsAdmin());
    }
}
