package com.bookverse.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
public class CheckoutRequest {

    @NotNull(message = "Address is required for delivery")
    private Long addressId;

    private String couponCode;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @NotBlank(message = "Payment transaction identifier is required")
    private String transactionId;

    public CheckoutRequest() {
    }

    public CheckoutRequest(Long addressId, String couponCode, String paymentMethod, String transactionId) {
        this.addressId = addressId;
        this.couponCode = couponCode;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
    }

    public Long getAddressId() {
        return this.addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public String getCouponCode() {
        return this.couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public String getPaymentMethod() {
        return this.paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return this.transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long addressId;
        private String couponCode;
        private String paymentMethod;
        private String transactionId;

        public Builder() {
        }

        public Builder addressId(Long addressId) {
            this.addressId = addressId;
            return this;
        }

        public Builder couponCode(String couponCode) {
            this.couponCode = couponCode;
            return this;
        }

        public Builder paymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public Builder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public CheckoutRequest build() {
            return new CheckoutRequest(this.addressId, this.couponCode, this.paymentMethod, this.transactionId);
        }
    }
}
