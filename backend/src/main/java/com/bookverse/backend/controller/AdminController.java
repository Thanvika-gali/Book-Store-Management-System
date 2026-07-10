package com.bookverse.backend.controller;

import com.bookverse.backend.dto.*;
import com.bookverse.backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminDashboardDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getDashboardAnalytics());
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<MonthlyRevenueDto>> getMonthlyRevenue() {
        return ResponseEntity.ok(adminService.getMonthlyRevenueCharts());
    }

    @GetMapping("/most-sold")
    public ResponseEntity<List<MostSoldBookDto>> getMostSold() {
        return ResponseEntity.ok(adminService.getMostSoldBooks());
    }

    @GetMapping("/sales-report")
    public ResponseEntity<byte[]> getSalesReport() {
        byte[] csvReport = adminService.exportSalesReport();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "sales-report.csv");
        headers.setContentLength(csvReport.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvReport);
    }

    // Books Management
    @PostMapping("/books")
    public ResponseEntity<BookDto> addBook(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(adminService.addBook(request));
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id, @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(adminService.updateBook(id, request));
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<MessageResponse> deleteBook(@PathVariable Long id) {
        adminService.deleteBook(id);
        return ResponseEntity.ok(new MessageResponse("Book deleted successfully from catalog"));
    }

    @PostMapping("/books/{id}/images")
    public ResponseEntity<MessageResponse> uploadImages(@PathVariable Long id, @RequestBody List<String> imageUrls) {
        adminService.uploadBookImages(id, imageUrls);
        return ResponseEntity.ok(new MessageResponse("Book gallery images uploaded successfully"));
    }

    // Categories Management
    @PostMapping("/categories")
    public ResponseEntity<CategoryDto> addCategory(@Valid @RequestBody CategoryDto request) {
        return ResponseEntity.ok(adminService.addCategory(request));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDto request) {
        return ResponseEntity.ok(adminService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<MessageResponse> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return ResponseEntity.ok(new MessageResponse("Category deleted successfully"));
    }

    // Metadata Management
    @PostMapping("/authors")
    public ResponseEntity<AuthorDto> addAuthor(@Valid @RequestBody AuthorDto request) {
        return ResponseEntity.ok(adminService.addAuthor(request));
    }

    @PostMapping("/publishers")
    public ResponseEntity<PublisherDto> addPublisher(@Valid @RequestBody PublisherDto request) {
        return ResponseEntity.ok(adminService.addPublisher(request));
    }

    // User Accounts Management
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserDto> updateUserStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, status));
    }

    // Orders Fullfilment Management
    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(adminService.updateOrderStatus(id, status));
    }
}
