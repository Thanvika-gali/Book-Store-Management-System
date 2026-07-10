package com.bookverse.backend.service;

import com.bookverse.backend.dto.*;
import com.bookverse.backend.entity.*;
import com.bookverse.backend.exception.BadRequestException;
import com.bookverse.backend.exception.ResourceNotFoundException;
import com.bookverse.backend.mapper.*;
import com.bookverse.backend.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookImageRepository bookImageRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final NotificationRepository notificationRepository;

    public AdminServiceImpl(OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            UserRepository userRepository,
                            BookRepository bookRepository,
                            BookImageRepository bookImageRepository,
                            CategoryRepository categoryRepository,
                            AuthorRepository authorRepository,
                            PublisherRepository publisherRepository,
                            NotificationRepository notificationRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.bookImageRepository = bookImageRepository;
        this.categoryRepository = categoryRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public AdminDashboardDto getDashboardAnalytics() {
        List<Order> allOrders = orderRepository.findAll();
        
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.COMPLETED)
                .map(Order::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrdersCount = allOrders.size();
        
        long totalCustomers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.CUSTOMER)
                .count();

        long totalBooksSold = orderItemRepository.findAll().stream()
                .mapToLong(OrderItem::getQuantity)
                .sum();

        List<Book> lowStockBooks = bookRepository.findAll().stream()
                .filter(b -> b.getStock() < 5)
                .collect(Collectors.toList());

        Pageable latestOrdersLimit = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<RecentOrderDto> recentOrders = orderRepository.findAll(latestOrdersLimit).getContent().stream()
                .map(o -> RecentOrderDto.builder()
                        .id(o.getId())
                        .customerName(o.getUser().getName())
                        .finalAmount(o.getFinalAmount())
                        .status(o.getStatus().name())
                        .createdAt(o.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        List<LowStockBookDto> lowStockBookDtos = lowStockBooks.stream()
                .limit(5)
                .map(b -> LowStockBookDto.builder()
                        .id(b.getId())
                        .title(b.getTitle())
                        .stock(b.getStock())
                        .coverImage(b.getCoverImage())
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrdersCount)
                .totalCustomers(totalCustomers)
                .totalBooksSold(totalBooksSold)
                .lowStockBooksCount((long) lowStockBooks.size())
                .recentOrders(recentOrders)
                .lowStockBooks(lowStockBookDtos)
                .build();
    }

    @Override
    public List<MonthlyRevenueDto> getMonthlyRevenueCharts() {
        List<Order> orders = orderRepository.findAll();
        Map<String, BigDecimal> monthlyTotals = new HashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        for (Order order : orders) {
            if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
                String monthKey = order.getCreatedAt().format(formatter);
                monthlyTotals.put(monthKey, monthlyTotals.getOrDefault(monthKey, BigDecimal.ZERO).add(order.getFinalAmount()));
            }
        }

        return monthlyTotals.entrySet().stream()
                .map(e -> MonthlyRevenueDto.builder()
                        .month(e.getKey())
                        .revenue(e.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<MostSoldBookDto> getMostSoldBooks() {
        List<OrderItem> items = orderItemRepository.findAll();
        Map<Book, Long> quantityMap = items.stream()
                .collect(Collectors.groupingBy(OrderItem::getBook, Collectors.summingLong(OrderItem::getQuantity)));

        Map<Book, BigDecimal> revenueMap = items.stream()
                .collect(Collectors.groupingBy(OrderItem::getBook, 
                        Collectors.mapping(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())), 
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));

        return quantityMap.entrySet().stream()
                .map(e -> {
                    Book book = e.getKey();
                    return MostSoldBookDto.builder()
                            .bookId(book.getId())
                            .title(book.getTitle())
                            .authorName(book.getAuthor().getName())
                            .quantitySold(e.getValue())
                            .revenueGenerated(revenueMap.getOrDefault(book, BigDecimal.ZERO))
                            .coverImage(book.getCoverImage())
                            .build();
                })
                .sorted((b1, b2) -> b2.getQuantitySold().compareTo(b1.getQuantitySold()))
                .limit(5)
                .collect(Collectors.toList());
    }

    @Override
    public byte[] exportSalesReport() {
        List<Order> orders = orderRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("Order ID,Date,Customer Name,Subtotal,Discount,Final Total,Fulfillment Status,Payment Method\n");
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (Order o : orders) {
            sb.append(o.getId()).append(",")
              .append(o.getCreatedAt().format(formatter)).append(",")
              .append("\"").append(o.getUser().getName().replace("\"", "\"\"")).append("\",")
              .append(o.getOriginalAmount()).append(",")
              .append(o.getDiscountAmount()).append(",")
              .append(o.getFinalAmount()).append(",")
              .append(o.getStatus().name()).append(",")
              .append(o.getPaymentMethod()).append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional
    public BookDto addBook(BookRequest request) {
        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new BadRequestException("ISBN '" + request.getIsbn() + "' already exists in catalog.");
        }

        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with ID: " + request.getAuthorId()));
        
        Publisher publisher = publisherRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found with ID: " + request.getPublisherId()));
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Book book = BookMapper.toEntity(request, author, publisher, category);
        Book savedBook = bookRepository.save(book);
        return BookMapper.toDto(savedBook);
    }

    @Override
    @Transactional
    public BookDto updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));

        // Ensure ISBN uniqueness if changed
        if (!book.getIsbn().equals(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new BadRequestException("ISBN '" + request.getIsbn() + "' already exists in database.");
        }

        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with ID: " + request.getAuthorId()));
        
        Publisher publisher = publisherRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found with ID: " + request.getPublisherId()));
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        BookMapper.updateEntityFromRequest(request, book, author, publisher, category);
        Book updatedBook = bookRepository.save(book);
        return BookMapper.toDto(updatedBook);
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));
        bookRepository.delete(book);
    }

    @Override
    @Transactional
    public void uploadBookImages(Long bookId, List<String> imageUrls) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));
        
        // Remove old additional images
        List<BookImage> oldImages = bookImageRepository.findByBookId(bookId);
        bookImageRepository.deleteAll(oldImages);

        // Add new images
        List<BookImage> newImages = imageUrls.stream()
                .map(url -> BookImage.builder()
                        .book(book)
                        .imageUrl(url)
                        .build())
                .collect(Collectors.toList());
        bookImageRepository.saveAll(newImages);
    }

    @Override
    @Transactional
    public CategoryDto addCategory(CategoryDto request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category already exists with name: " + request.getName());
        }
        Category cat = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        Category saved = categoryRepository.save(cat);
        return CategoryMapper.toDto(saved);
    }

    @Override
    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        if (!category.getName().equalsIgnoreCase(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category already exists with name: " + request.getName());
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        Category saved = categoryRepository.save(category);
        return CategoryMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        categoryRepository.delete(category);
    }

    @Override
    @Transactional
    public AuthorDto addAuthor(AuthorDto request) {
        if (authorRepository.existsByName(request.getName())) {
            throw new BadRequestException("Author already exists with name: " + request.getName());
        }
        Author author = Author.builder()
                .name(request.getName())
                .bio(request.getBio())
                .build();
        Author saved = authorRepository.save(author);
        return AuthorMapper.toDto(saved);
    }

    @Override
    @Transactional
    public PublisherDto addPublisher(PublisherDto request) {
        if (publisherRepository.existsByName(request.getName())) {
            throw new BadRequestException("Publisher already exists with name: " + request.getName());
        }
        Publisher publisher = Publisher.builder()
                .name(request.getName())
                .address(request.getAddress())
                .build();
        Publisher saved = publisherRepository.save(publisher);
        return PublisherMapper.toDto(saved);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        try {
            UserStatus userStatus = UserStatus.valueOf(status.toUpperCase());
            user.setStatus(userStatus);
            User saved = userRepository.save(user);

            // Push notification to user
            Notification notif = Notification.builder()
                    .user(saved)
                    .title("Account Status Update")
                    .message("Your account status has been updated to " + userStatus.name() + " by administrative staff.")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);

            return UserMapper.toDto(saved);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status option. Choose ACTIVE or BLOCKED.");
        }
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(orderStatus);
            Order saved = orderRepository.save(order);

            // Push notification to customer
            Notification notif = Notification.builder()
                    .user(order.getUser())
                    .title("Order Update - #" + order.getId())
                    .message("Your order status has been updated to " + orderStatus.name() + ".")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);

            return OrderMapper.toDto(saved);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }
    }
}
