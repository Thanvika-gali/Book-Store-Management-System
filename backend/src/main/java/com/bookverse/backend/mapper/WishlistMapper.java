package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.WishlistDto;
import com.bookverse.backend.entity.Wishlist;

public class WishlistMapper {

    public static WishlistDto toDto(Wishlist wishlist) {
        if (wishlist == null) {
            return null;
        }

        return WishlistDto.builder()
                .id(wishlist.getId())
                .bookId(wishlist.getBook().getId())
                .bookTitle(wishlist.getBook().getTitle())
                .bookPrice(wishlist.getBook().getPrice())
                .bookDiscountPrice(wishlist.getBook().getDiscountPrice())
                .bookCoverImage(wishlist.getBook().getCoverImage())
                .build();
    }
}
