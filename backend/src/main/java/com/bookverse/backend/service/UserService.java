package com.bookverse.backend.service;

import com.bookverse.backend.dto.*;

import java.util.List;

public interface UserService {
    UserDto getProfile(Long userId);
    UserDto updateProfile(Long userId, UpdateProfileRequest request);
    MessageResponse changePassword(Long userId, ChangePasswordRequest request);
    UserDto uploadProfilePicture(Long userId, String url);
    
    // Address CRUD
    List<AddressDto> getAddresses(Long userId);
    AddressDto addAddress(Long userId, AddressRequest request);
    AddressDto updateAddress(Long userId, Long addressId, AddressRequest request);
    void deleteAddress(Long userId, Long addressId);

    // Wishlist
    List<WishlistDto> getWishlist(Long userId);
    WishlistDto toggleWishlist(Long userId, Long bookId);

    // Review
    ReviewDto addReview(Long userId, ReviewRequest request);

    // Notifications
    List<NotificationDto> getNotifications(Long userId);
    void markNotificationsRead(Long userId);
}
