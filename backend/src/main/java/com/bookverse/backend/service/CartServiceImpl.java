package com.bookverse.backend.service;

import com.bookverse.backend.dto.CartItemDto;
import com.bookverse.backend.dto.CartRequest;
import com.bookverse.backend.entity.Book;
import com.bookverse.backend.entity.CartItem;
import com.bookverse.backend.entity.User;
import com.bookverse.backend.exception.BadRequestException;
import com.bookverse.backend.exception.InsufficientStockException;
import com.bookverse.backend.exception.ResourceNotFoundException;
import com.bookverse.backend.mapper.CartMapper;
import com.bookverse.backend.repository.BookRepository;
import com.bookverse.backend.repository.CartItemRepository;
import com.bookverse.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public CartServiceImpl(CartItemRepository cartItemRepository,
                           UserRepository userRepository,
                           BookRepository bookRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public List<CartItemDto> getCart(Long userId) {
        return cartItemRepository.findByUserId(userId).stream()
                .map(CartMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CartItemDto addToCart(Long userId, CartRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + request.getBookId()));

        if (book.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock available! Only " + book.getStock() + " copies left.");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserIdAndBookId(userId, request.getBookId());
        CartItem cartItem;

        if (existingItemOpt.isPresent()) {
            cartItem = existingItemOpt.get();
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            if (book.getStock() < newQuantity) {
                throw new InsufficientStockException("Cannot add more. Insufficient stock! Total cart quantity exceeds available stock (" + book.getStock() + ").");
            }
            cartItem.setQuantity(newQuantity);
        } else {
            cartItem = CartItem.builder()
                    .user(user)
                    .book(book)
                    .quantity(request.getQuantity())
                    .build();
        }

        CartItem savedItem = cartItemRepository.save(cartItem);
        return CartMapper.toDto(savedItem);
    }

    @Override
    @Transactional
    public CartItemDto updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not own this cart item.");
        }

        Book book = cartItem.getBook();
        if (book.getStock() < quantity) {
            throw new InsufficientStockException("Insufficient stock! Only " + book.getStock() + " copies available.");
        }

        cartItem.setQuantity(quantity);
        CartItem savedItem = cartItemRepository.save(cartItem);
        return CartMapper.toDto(savedItem);
    }

    @Override
    @Transactional
    public void removeCartItem(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not own this cart item.");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
