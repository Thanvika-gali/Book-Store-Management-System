package com.bookverse.backend.service;

import com.bookverse.backend.dto.CheckoutRequest;
import com.bookverse.backend.dto.CouponDto;
import com.bookverse.backend.dto.OrderDto;

import java.math.BigDecimal;
import java.util.List;

public interface OrderService {
    OrderDto placeOrder(Long userId, CheckoutRequest request);
    List<OrderDto> getUserOrders(Long userId);
    OrderDto getOrderDetails(Long userId, Long orderId);
    byte[] downloadInvoice(Long userId, Long orderId);
    CouponDto validateCoupon(String code, BigDecimal cartTotal);
}
