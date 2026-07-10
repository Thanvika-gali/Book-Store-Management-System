package com.bookverse.backend.service;

import com.bookverse.backend.dto.*;
import com.bookverse.backend.entity.*;
import com.bookverse.backend.exception.BadRequestException;
import com.bookverse.backend.exception.ResourceNotFoundException;
import com.bookverse.backend.mapper.AddressMapper;
import com.bookverse.backend.mapper.NotificationMapper;
import com.bookverse.backend.mapper.ReviewMapper;
import com.bookverse.backend.mapper.UserMapper;
import com.bookverse.backend.mapper.WishlistMapper;
import com.bookverse.backend.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final WishlistRepository wishlistRepository;
    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           AddressRepository addressRepository,
                           WishlistRepository wishlistRepository,
                           ReviewRepository reviewRepository,
                           BookRepository bookRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.wishlistRepository = wishlistRepository;
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return UserMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setName(request.getName());
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }
        User updated = userRepository.save(user);
        return UserMapper.toDto(updated);
    }

    @Override
    @Transactional
    public MessageResponse changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password input is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return new MessageResponse("Password successfully updated.");
    }

    @Override
    @Transactional
    public UserDto uploadProfilePicture(Long userId, String url) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setProfilePicture(url);
        User updated = userRepository.save(user);
        return UserMapper.toDto(updated);
    }

    @Override
    public List<AddressDto> getAddresses(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(AddressMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressDto addAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        List<Address> existingAddresses = addressRepository.findByUserId(userId);
        boolean isFirstAddress = existingAddresses.isEmpty();

        // If request sets default, reset others
        if (request.getIsDefault() != null && request.getIsDefault()) {
            resetDefaultAddresses(existingAddresses);
        }

        Address address = AddressMapper.toEntity(request, user);
        if (isFirstAddress) {
            address.setIsDefault(true);
        }

        Address saved = addressRepository.save(address);
        return AddressMapper.toDto(saved);
    }

    @Override
    @Transactional
    public AddressDto updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found."));

        if (request.getIsDefault() != null && request.getIsDefault() && !address.getIsDefault()) {
            List<Address> existing = addressRepository.findByUserId(userId);
            resetDefaultAddresses(existing);
        }

        AddressMapper.updateEntityFromRequest(request, address);
        Address saved = addressRepository.save(address);
        return AddressMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found."));

        addressRepository.delete(address);

        // If we deleted the default address, set another address as default if list is not empty
        if (address.getIsDefault()) {
            List<Address> remaining = addressRepository.findByUserId(userId);
            if (!remaining.isEmpty()) {
                Address nextDefault = remaining.get(0);
                nextDefault.setIsDefault(true);
                addressRepository.save(nextDefault);
            }
        }
    }

    private void resetDefaultAddresses(List<Address> addresses) {
        for (Address addr : addresses) {
            if (addr.getIsDefault()) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    @Override
    public List<WishlistDto> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(WishlistMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WishlistDto toggleWishlist(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));

        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndBookId(userId, bookId);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return null;
        } else {
            Wishlist wish = Wishlist.builder()
                    .user(user)
                    .book(book)
                    .build();
            Wishlist saved = wishlistRepository.save(wish);
            return WishlistMapper.toDto(saved);
        }
    }

    @Override
    @Transactional
    public ReviewDto addReview(Long userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + request.getBookId()));

        Optional<Review> existingOpt = reviewRepository.findByUserIdAndBookId(userId, request.getBookId());
        Review review;

        if (existingOpt.isPresent()) {
            review = existingOpt.get();
            review.setRating(request.getRating());
            review.setComment(request.getComment());
        } else {
            review = Review.builder()
                    .user(user)
                    .book(book)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .build();
        }

        Review savedReview = reviewRepository.save(review);

        // Recalculate book average rating and review count
        List<Review> bookReviews = reviewRepository.findByBookId(request.getBookId());
        int count = bookReviews.size();
        double sum = bookReviews.stream().mapToDouble(Review::getRating).sum();
        
        BigDecimal avgRating = BigDecimal.valueOf(sum / count).setScale(2, RoundingMode.HALF_UP);
        
        book.setRating(avgRating);
        book.setReviewCount(count);
        bookRepository.save(book);

        return ReviewMapper.toDto(savedReview);
    }

    @Override
    public List<NotificationDto> getNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markNotificationsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}
