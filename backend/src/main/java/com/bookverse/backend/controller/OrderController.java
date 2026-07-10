package com.bookverse.backend.controller;

import com.bookverse.backend.dto.CheckoutRequest;
import com.bookverse.backend.dto.CouponDto;
import com.bookverse.backend.dto.OrderDto;
import com.bookverse.backend.exception.BadRequestException;
import com.bookverse.backend.security.SecurityUtils;
import com.bookverse.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(@Valid @RequestBody CheckoutRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        OrderDto orderDto = orderService.placeOrder(userId, request);
        return ResponseEntity.ok(orderDto);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrderHistory() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderDetails(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        return ResponseEntity.ok(orderService.getOrderDetails(userId, id));
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        
        byte[] invoiceData = orderService.downloadInvoice(userId, id);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "invoice-" + id + ".txt");
        headers.setContentLength(invoiceData.length);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(invoiceData);
    }

    @GetMapping("/validate-coupon")
    public ResponseEntity<CouponDto> validateCoupon(@RequestParam String code, @RequestParam BigDecimal total) {
        CouponDto coupon = orderService.validateCoupon(code, total);
        return ResponseEntity.ok(coupon);
    }
}
