package com.bookverse.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CouponDto {
    private Long id;
    private String code;
    private BigDecimal discountAmount;
    private String discountType;
    private BigDecimal minPurchase;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private Boolean isActive;

    public CouponDto() {
    }

    public CouponDto(Long id, String code, BigDecimal discountAmount, String discountType, BigDecimal minPurchase, LocalDate startDate, LocalDate expiryDate, Boolean isActive) {
        this.id = id;
        this.code = code;
        this.discountAmount = discountAmount;
        this.discountType = discountType;
        this.minPurchase = minPurchase;
        this.startDate = startDate;
        this.expiryDate = expiryDate;
        this.isActive = isActive;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getDiscountAmount() {
        return this.discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public String getDiscountType() {
        return this.discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getMinPurchase() {
        return this.minPurchase;
    }

    public void setMinPurchase(BigDecimal minPurchase) {
        this.minPurchase = minPurchase;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getExpiryDate() {
        return this.expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String code;
        private BigDecimal discountAmount;
        private String discountType;
        private BigDecimal minPurchase;
        private LocalDate startDate;
        private LocalDate expiryDate;
        private Boolean isActive;

        public Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder code(String code) {
            this.code = code;
            return this;
        }

        public Builder discountAmount(BigDecimal discountAmount) {
            this.discountAmount = discountAmount;
            return this;
        }

        public Builder discountType(String discountType) {
            this.discountType = discountType;
            return this;
        }

        public Builder minPurchase(BigDecimal minPurchase) {
            this.minPurchase = minPurchase;
            return this;
        }

        public Builder startDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }

        public Builder expiryDate(LocalDate expiryDate) {
            this.expiryDate = expiryDate;
            return this;
        }

        public Builder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public CouponDto build() {
            return new CouponDto(this.id, this.code, this.discountAmount, this.discountType, this.minPurchase, this.startDate, this.expiryDate, this.isActive);
        }
    }
}
