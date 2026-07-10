package com.bookverse.backend.service;

import com.bookverse.backend.dto.CheckoutRequest;
import com.bookverse.backend.dto.CouponDto;
import com.bookverse.backend.dto.OrderDto;
import com.bookverse.backend.entity.*;
import com.bookverse.backend.exception.BadRequestException;
import com.bookverse.backend.exception.InsufficientStockException;
import com.bookverse.backend.exception.ResourceNotFoundException;
import com.bookverse.backend.mapper.CouponMapper;
import com.bookverse.backend.mapper.OrderMapper;
import com.bookverse.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CouponRepository couponRepository;
    private final BookRepository bookRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            CartItemRepository cartItemRepository,
                            UserRepository userRepository,
                            AddressRepository addressRepository,
                            CouponRepository couponRepository,
                            BookRepository bookRepository,
                            PaymentRepository paymentRepository,
                            NotificationRepository notificationRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.couponRepository = couponRepository;
        this.bookRepository = bookRepository;
        this.paymentRepository = paymentRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public OrderDto placeOrder(Long userId, CheckoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your shopping cart is empty.");
        }

        Address address = addressRepository.findByIdAndUserId(request.getAddressId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery address not found."));

        // Calculate checkout totals and verify stock
        BigDecimal originalAmount = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Book book = item.getBook();
            if (book.getStock() < item.getQuantity()) {
                throw new InsufficientStockException("Book '" + book.getTitle() + "' has insufficient stock. Only " + book.getStock() + " copies available.");
            }
            BigDecimal itemPrice = book.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0 ? book.getDiscountPrice() : book.getPrice();
            BigDecimal lineTotal = itemPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            originalAmount = originalAmount.add(lineTotal);
        }

        // Apply coupon if eligible
        Coupon coupon = null;
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            coupon = couponRepository.findByCode(request.getCouponCode().trim().toUpperCase())
                    .orElseThrow(() -> new BadRequestException("Invalid coupon code."));

            if (!coupon.isValid(originalAmount)) {
                throw new BadRequestException("Coupon is expired or cart value is below minimum threshold.");
            }

            if (coupon.getDiscountType() == DiscountType.FLAT) {
                discountAmount = coupon.getDiscountAmount();
            } else {
                discountAmount = originalAmount.multiply(coupon.getDiscountAmount())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            }
            
            if (discountAmount.compareTo(originalAmount) > 0) {
                discountAmount = originalAmount;
            }
        }

        BigDecimal finalAmount = originalAmount.subtract(discountAmount);

        // Deduct Inventory Stock
        for (CartItem item : cartItems) {
            Book book = item.getBook();
            book.setStock(book.getStock() - item.getQuantity());
            bookRepository.save(book);
        }

        // Create Order
        Order order = Order.builder()
                .user(user)
                .address(address)
                .coupon(coupon)
                .originalAmount(originalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.COMPLETED) // Pre-completed for simulated checkout
                .paymentMethod(request.getPaymentMethod())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Create Order Items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cartItems) {
            BigDecimal itemPrice = item.getBook().getDiscountPrice().compareTo(BigDecimal.ZERO) > 0 ? item.getBook().getDiscountPrice() : item.getBook().getPrice();
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .book(item.getBook())
                    .quantity(item.getQuantity())
                    .price(itemPrice)
                    .build();
            orderItems.add(orderItem);
        }
        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems);

        // Save Payment record
        Payment payment = Payment.builder()
                .order(savedOrder)
                .amount(finalAmount)
                .status(PaymentStatus.COMPLETED)
                .paymentMethod(request.getPaymentMethod())
                .transactionId(request.getTransactionId())
                .build();
        paymentRepository.save(payment);

        // Empty user's shopping cart
        cartItemRepository.deleteByUserId(userId);

        // Create checkout notification
        Notification notification = Notification.builder()
                .user(user)
                .title("Order Placed Successfully!")
                .message("Your order #" + savedOrder.getId() + " has been placed. You paid $" + finalAmount + ". Track it in your Profile.")
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        return OrderMapper.toDto(savedOrder);
    }

    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto getOrderDetails(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not have permission to view this order.");
        }

        return OrderMapper.toDto(order);
    }

    @Override
    public byte[] downloadInvoice(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not have permission to download this invoice.");
        }

        User user = order.getUser();
        Address addr = order.getAddress();

        // Compile text invoice formatting
        StringBuilder sb = new StringBuilder();
        sb.append("========================================================\n");
        sb.append("                       BOOKVERSE                        \n");
        sb.append("                  INVOICE RECEIPT                       \n");
        sb.append("========================================================\n\n");
        sb.append("Invoice Date:   ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))).append("\n");
        sb.append("Order Reference: #").append(order.getId()).append("\n");
        sb.append("Payment Status:  ").append(order.getPaymentStatus()).append("\n");
        sb.append("Payment Method:  ").append(order.getPaymentMethod()).append("\n\n");
        
        sb.append("Billed To:\n");
        sb.append("Name:    ").append(user.getName()).append("\n");
        sb.append("Address: ").append(addr.getStreet()).append(", ").append(addr.getCity()).append(", ").append(addr.getState()).append(", ").append(addr.getCountry()).append(" - ").append(addr.getZipCode()).append("\n");
        sb.append("Phone:   ").append(addr.getPhone()).append("\n\n");

        sb.append("--------------------------------------------------------\n");
        sb.append(String.format("%-25s %-10s %-8s %-8s\n", "Book Title", "Unit Price", "Qty", "Total"));
        sb.append("--------------------------------------------------------\n");
        
        for (OrderItem item : order.getOrderItems()) {
            String title = item.getBook().getTitle();
            if (title.length() > 23) {
                title = title.substring(0, 20) + "...";
            }
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            sb.append(String.format("%-25s $%-9.2f %-8d $%-8.2f\n", title, item.getPrice(), item.getQuantity(), itemTotal));
        }
        sb.append("--------------------------------------------------------\n");
        sb.append(String.format("%-36s $%-8.2f\n", "Cart Subtotal:", order.getOriginalAmount()));
        if (order.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
            sb.append(String.format("%-36s -$%-7.2f\n", "Coupon Discount:", order.getDiscountAmount()));
        }
        sb.append(String.format("%-36s $%-8.2f\n", "Final Total Amount:", order.getFinalAmount()));
        sb.append("========================================================\n\n");
        sb.append("Thank you for shopping at BookVerse!\n");

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public CouponDto validateCoupon(String code, BigDecimal cartTotal) {
        Coupon coupon = couponRepository.findByCode(code.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Coupon code not found with name: " + code));

        if (!coupon.isValid(cartTotal)) {
            throw new BadRequestException("Coupon is expired, inactive, or checkout subtotal is below minimum threshold $" + coupon.getMinPurchase());
        }

        return CouponMapper.toDto(coupon);
    }
}
