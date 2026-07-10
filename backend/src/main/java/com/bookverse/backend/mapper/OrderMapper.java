package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.OrderDto;
import com.bookverse.backend.dto.OrderItemDto;
import com.bookverse.backend.entity.Order;
import com.bookverse.backend.entity.OrderItem;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDto toDto(Order order) {
        if (order == null) {
            return null;
        }

        List<OrderItemDto> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            items = order.getOrderItems().stream()
                    .map(OrderMapper::toDto)
                    .collect(Collectors.toList());
        }

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .address(AddressMapper.toDto(order.getAddress()))
                .couponCode(order.getCoupon() != null ? order.getCoupon().getCode() : null)
                .originalAmount(order.getOriginalAmount())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .paymentMethod(order.getPaymentMethod())
                .trackingNumber(order.getTrackingNumber())
                .orderItems(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    public static OrderItemDto toDto(OrderItem item) {
        if (item == null) {
            return null;
        }

        return OrderItemDto.builder()
                .id(item.getId())
                .bookId(item.getBook().getId())
                .bookTitle(item.getBook().getTitle())
                .bookCoverImage(item.getBook().getCoverImage())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build();
    }
}
