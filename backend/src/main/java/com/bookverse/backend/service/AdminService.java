package com.bookverse.backend.service;

import com.bookverse.backend.dto.*;

import java.util.List;

public interface AdminService {
    // Dashboard Stats
    AdminDashboardDto getDashboardAnalytics();
    List<MonthlyRevenueDto> getMonthlyRevenueCharts();
    List<MostSoldBookDto> getMostSoldBooks();
    byte[] exportSalesReport();

    // Books CRUD
    BookDto addBook(BookRequest request);
    BookDto updateBook(Long id, BookRequest request);
    void deleteBook(Long id);
    void uploadBookImages(Long bookId, List<String> imageUrls);

    // Categories CRUD
    CategoryDto addCategory(CategoryDto request);
    CategoryDto updateCategory(Long id, CategoryDto request);
    void deleteCategory(Long id);

    // Metadata Creators
    AuthorDto addAuthor(AuthorDto request);
    PublisherDto addPublisher(PublisherDto request);

    // User Controls
    List<UserDto> getAllUsers();
    UserDto updateUserStatus(Long userId, String status);

    // Order Status
    OrderDto updateOrderStatus(Long orderId, String status);
}
