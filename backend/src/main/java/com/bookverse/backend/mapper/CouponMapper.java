package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.CouponDto;
import com.bookverse.backend.entity.Coupon;

public class CouponMapper {

    public static CouponDto toDto(Coupon coupon) {
        if (coupon == null) {
            return null;
        }

        return CouponDto.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .discountAmount(coupon.getDiscountAmount())
                .discountType(coupon.getDiscountType().name())
                .minPurchase(coupon.getMinPurchase())
                .startDate(coupon.getStartDate())
                .expiryDate(coupon.getExpiryDate())
                .isActive(coupon.getIsActive())
                .build();
    }
}
