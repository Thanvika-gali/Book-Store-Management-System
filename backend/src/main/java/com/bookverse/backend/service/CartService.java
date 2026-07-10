package com.bookverse.backend.service;

import com.bookverse.backend.dto.CartItemDto;
import com.bookverse.backend.dto.CartRequest;

import java.util.List;

public interface CartService {
    List<CartItemDto> getCart(Long userId);
    CartItemDto addToCart(Long userId, CartRequest request);
    CartItemDto updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity);
    void removeCartItem(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
