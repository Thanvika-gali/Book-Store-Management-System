package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.ReviewDto;
import com.bookverse.backend.entity.Review;

public class ReviewMapper {

    public static ReviewDto toDto(Review review) {
        if (review == null) {
            return null;
        }

        return ReviewDto.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .userProfilePicture(review.getUser().getProfilePicture())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
