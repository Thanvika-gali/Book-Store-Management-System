package com.bookverse.backend.service;

import com.bookverse.backend.dto.BookRentalDto;
import com.bookverse.backend.dto.LibraryAdminStatsDto;
import com.bookverse.backend.dto.RentalRequest;
import com.bookverse.backend.entity.*;
import com.bookverse.backend.exception.BadRequestException;
import com.bookverse.backend.exception.ResourceNotFoundException;
import com.bookverse.backend.repository.BookRentalRepository;
import com.bookverse.backend.repository.BookRepository;
import com.bookverse.backend.repository.NotificationRepository;
import com.bookverse.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookRentalServiceImpl implements BookRentalService {

    private final BookRentalRepository rentalRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public BookRentalServiceImpl(BookRentalRepository rentalRepository,
                                 BookRepository bookRepository,
                                 UserRepository userRepository,
                                 NotificationRepository notificationRepository) {
        this.rentalRepository = rentalRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public BookRentalDto checkoutRental(Long userId, RentalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        RentalType type = RentalType.valueOf(request.getRentalType().toUpperCase());
        
        // 1. Refresh overdue items
        checkAndUpdateOverdueLoans();

        // 2. Check if user already has an active loan for this book
        List<BookRental> activeForBook = rentalRepository.findByUserIdAndBookIdAndStatus(userId, book.getId(), RentalStatus.ACTIVE);
        List<BookRental> overdueForBook = rentalRepository.findByUserIdAndBookIdAndStatus(userId, book.getId(), RentalStatus.OVERDUE);
        if (!activeForBook.isEmpty() || !overdueForBook.isEmpty()) {
            throw new BadRequestException("You already have an active checkout or rental for '" + book.getTitle() + "'!");
        }

        BigDecimal calculatedPrice = BigDecimal.ZERO;
        int duration = request.getDurationDays();

        if (type == RentalType.BORROW) {
            // Borrow validation: limit of 3 concurrent loans
            long activeBorrows = rentalRepository.countByUserIdAndRentalTypeAndStatus(userId, RentalType.BORROW, RentalStatus.ACTIVE);
            long overdueBorrows = rentalRepository.countByUserIdAndRentalTypeAndStatus(userId, RentalType.BORROW, RentalStatus.OVERDUE);
            if ((activeBorrows + overdueBorrows) >= 3) {
                throw new BadRequestException("Borrowing Limit Receeded! You can have a maximum of 3 active library borrowed books at a time. Please return a book first.");
            }
            duration = 14; // Default borrow is fixed at 14 days
        } else {
            // Rent validation: calculate fractional price
            BigDecimal retailPrice = book.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0 ? book.getDiscountPrice() : book.getPrice();
            if (duration <= 7) {
                calculatedPrice = retailPrice.multiply(new BigDecimal("0.10")); // 10%
            } else if (duration <= 14) {
                calculatedPrice = retailPrice.multiply(new BigDecimal("0.15")); // 15%
            } else {
                calculatedPrice = retailPrice.multiply(new BigDecimal("0.25")); // 25%
            }
            calculatedPrice = calculatedPrice.setScale(2, RoundingMode.HALF_UP);
        }

        LocalDateTime due = LocalDateTime.now().plusDays(duration);

        BookRental rental = BookRental.builder()
                .user(user)
                .book(book)
                .rentalType(type)
                .price(calculatedPrice)
                .durationDays(duration)
                .dueDate(due)
                .status(RentalStatus.ACTIVE)
                .build();

        BookRental saved = rentalRepository.save(rental);

        // Push notification
        String typeLabel = type == RentalType.BORROW ? "Borrowed" : "Rented";
        String dateString = due.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        Notification notif = Notification.builder()
                .user(user)
                .title("📚 Library Book " + typeLabel + "!")
                .message("You checked out '" + book.getTitle() + "'. It is due on " + dateString + ". Happy reading!")
                .isRead(false)
                .build();
        notificationRepository.save(notif);

        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void returnBook(Long userId, Long rentalId) {
        BookRental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental log not found"));

        // Allow return if user is owner or admin
        boolean isAdmin = rental.getUser().getRole() == Role.ADMIN; // Check if logged in user is admin is simpler in controller, but we can verify ownership here
        if (!rental.getUser().getId().equals(userId)) {
            // Check if user is actually admin
            User requestingUser = userRepository.findById(userId).orElseThrow();
            if (requestingUser.getRole() != Role.ADMIN) {
                throw new IllegalArgumentException("Unauthorized to return this rental");
            }
        }

        rental.setStatus(RentalStatus.RETURNED);
        rental.setReturnedAt(LocalDateTime.now());
        rentalRepository.save(rental);

        // Push return notification
        Notification notif = Notification.builder()
                .user(rental.getUser())
                .title("🔄 Book Returned")
                .message("'" + rental.getBook().getTitle() + "' has been successfully returned to the digital library. Thank you!")
                .isRead(false)
                .build();
        notificationRepository.save(notif);
    }

    @Override
    public List<BookRentalDto> getMyActiveRentals(Long userId) {
        checkAndUpdateOverdueLoans();
        return rentalRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookRentalDto> getAllActiveLoansAdmin() {
        checkAndUpdateOverdueLoans();
        return rentalRepository.findAllByOrderByStartedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public LibraryAdminStatsDto getLibraryStatsAdmin() {
        checkAndUpdateOverdueLoans();
        
        List<BookRental> allRentals = rentalRepository.findAll();
        long activeCount = allRentals.stream().filter(r -> r.getStatus() == RentalStatus.ACTIVE).count();
        long overdueCount = allRentals.stream().filter(r -> r.getStatus() == RentalStatus.OVERDUE).count();
        
        BigDecimal revenue = allRentals.stream()
                .map(BookRental::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate language stats
        Map<String, Long> langCounts = allRentals.stream()
                .filter(r -> r.getStatus() == RentalStatus.ACTIVE || r.getStatus() == RentalStatus.OVERDUE)
                .collect(Collectors.groupingBy(r -> r.getBook().getLanguage(), Collectors.counting()));

        List<LibraryAdminStatsDto.LanguageLoanStat> langStats = langCounts.entrySet().stream()
                .map(e -> new LibraryAdminStatsDto.LanguageLoanStat(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        return LibraryAdminStatsDto.builder()
                .totalActiveLoans(activeCount)
                .totalOverdueLoans(overdueCount)
                .totalRevenue(revenue)
                .loansByLanguage(langStats)
                .build();
    }

    @Override
    @Transactional
    public void checkAndUpdateOverdueLoans() {
        List<BookRental> activeLoans = rentalRepository.findByStatus(RentalStatus.ACTIVE);
        LocalDateTime now = LocalDateTime.now();
        List<BookRental> overdueLoans = new ArrayList<>();
        for (BookRental r : activeLoans) {
            if (r.getDueDate().isBefore(now)) {
                r.setStatus(RentalStatus.OVERDUE);
                overdueLoans.add(r);
                
                // Alert user
                Notification notif = Notification.builder()
                        .user(r.getUser())
                        .title("⚠️ Library Loan Overdue!")
                        .message("Your checkout for '" + r.getBook().getTitle() + "' was due on " + r.getDueDate() + ". Please return it soon.")
                        .isRead(false)
                        .build();
                notificationRepository.save(notif);
            }
        }
        if (!overdueLoans.isEmpty()) {
            rentalRepository.saveAll(overdueLoans);
        }
    }

    @Override
    public boolean hasActiveRental(Long userId, Long bookId) {
        checkAndUpdateOverdueLoans();
        List<BookRental> active = rentalRepository.findByUserIdAndBookIdAndStatus(userId, bookId, RentalStatus.ACTIVE);
        List<BookRental> overdue = rentalRepository.findByUserIdAndBookIdAndStatus(userId, bookId, RentalStatus.OVERDUE);
        return !active.isEmpty() || !overdue.isEmpty();
    }

    private BookRentalDto mapToDto(BookRental r) {
        return BookRentalDto.builder()
                .id(r.getId())
                .bookId(r.getBook().getId())
                .bookTitle(r.getBook().getTitle())
                .coverImage(r.getBook().getCoverImage())
                .authorName(r.getBook().getAuthor().getName())
                .rentalType(r.getRentalType().name())
                .price(r.getPrice())
                .durationDays(r.getDurationDays())
                .startedAt(r.getStartedAt())
                .dueDate(r.getDueDate())
                .returnedAt(r.getReturnedAt())
                .status(r.getStatus().name())
                .userEmail(r.getUser().getEmail())
                .userName(r.getUser().getName())
                .build();
    }
}
