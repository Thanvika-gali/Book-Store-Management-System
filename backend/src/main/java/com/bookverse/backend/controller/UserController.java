package com.bookverse.backend.controller;

import com.bookverse.backend.dto.*;
import com.bookverse.backend.exception.BadRequestException;
import com.bookverse.backend.security.SecurityUtils;
import com.bookverse.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        UserDto profile = userService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        UserDto profile = userService.updateProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized access");
        }
        MessageResponse response = userService.changePassword(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDto>> getAddresses() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized");
        }
        return ResponseEntity.ok(userService.getAddresses(userId));
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressDto> addAddress(@Valid @RequestBody AddressRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized");
        }
        AddressDto address = userService.addAddress(userId, request);
        return ResponseEntity.ok(address);
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<AddressDto> updateAddress(@PathVariable Long id, @Valid @RequestBody AddressRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized");
        }
        AddressDto address = userService.updateAddress(userId, id, request);
        return ResponseEntity.ok(address);
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<MessageResponse> deleteAddress(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized");
        }
        userService.deleteAddress(userId, id);
        return ResponseEntity.ok(new MessageResponse("Address deleted successfully"));
    }

    @GetMapping("/wishlist")
    public ResponseEntity<List<WishlistDto>> getWishlist() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized");
        }
        return ResponseEntity.ok(userService.getWishlist(userId));
    }

    @PostMapping("/wishlist/{bookId}")
    public ResponseEntity<MessageResponse> toggleWishlist(@PathVariable Long bookId) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized");
        }
        WishlistDto status = userService.toggleWishlist(userId, bookId);
        String msg = status == null ? "Book removed from wishlist" : "Book added to wishlist";
        return ResponseEntity.ok(new MessageResponse(msg));
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewDto> addReview(@Valid @RequestBody ReviewRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized");
        }
        ReviewDto review = userService.addReview(userId, request);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDto>> getNotifications() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized");
        }
        return ResponseEntity.ok(userService.getNotifications(userId));
    }

    @PutMapping("/notifications/read")
    public ResponseEntity<MessageResponse> markNotificationsRead() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("Unauthorized");
        }
        userService.markNotificationsRead(userId);
        return ResponseEntity.ok(new MessageResponse("Notifications marked as read"));
    }
}
