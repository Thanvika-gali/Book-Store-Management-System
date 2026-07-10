package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.CartItemDto;
import com.bookverse.backend.entity.CartItem;

public class CartMapper {

    public static CartItemDto toDto(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }

        return CartItemDto.builder()
                .id(cartItem.getId())
                .bookId(cartItem.getBook().getId())
                .bookTitle(cartItem.getBook().getTitle())
                .bookPrice(cartItem.getBook().getPrice())
                .bookDiscountPrice(cartItem.getBook().getDiscountPrice())
                .bookDiscountPercentage(cartItem.getBook().getDiscountPercentage())
                .bookCoverImage(cartItem.getBook().getCoverImage())
                .quantity(cartItem.getQuantity())
                .build();
    }
}
