package com.bookverse.backend.controller;

import com.bookverse.backend.dto.CartItemDto;
import com.bookverse.backend.dto.CartRequest;
import com.bookverse.backend.dto.MessageResponse;
import com.bookverse.backend.exception.BadRequestException;
import com.bookverse.backend.security.SecurityUtils;
import com.bookverse.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping
    public ResponseEntity<CartItemDto> addToCart(@Valid @RequestBody CartRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        CartItemDto cartItemDto = cartService.addToCart(userId, request);
        return ResponseEntity.ok(cartItemDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemDto> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        CartItemDto cartItemDto = cartService.updateCartItemQuantity(userId, id, quantity);
        return ResponseEntity.ok(cartItemDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> removeFromCart(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        cartService.removeCartItem(userId, id);
        return ResponseEntity.ok(new MessageResponse("Item removed from cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<MessageResponse> clearCart() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        cartService.clearCart(userId);
        return ResponseEntity.ok(new MessageResponse("Shopping cart cleared"));
    }
}
