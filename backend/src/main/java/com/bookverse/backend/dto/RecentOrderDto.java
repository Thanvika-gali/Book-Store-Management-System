package com.bookverse.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RecentOrderDto {
    private Long id;
    private String customerName;
    private BigDecimal finalAmount;
    private String status;
    private LocalDateTime createdAt;

    public RecentOrderDto() {
    }

    public RecentOrderDto(Long id, String customerName, BigDecimal finalAmount, String status, LocalDateTime createdAt) {
        this.id = id;
        this.customerName = customerName;
        this.finalAmount = finalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return this.customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public BigDecimal getFinalAmount() {
        return this.finalAmount;
    }

    public void setFinalAmount(BigDecimal finalAmount) {
        this.finalAmount = finalAmount;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String customerName;
        private BigDecimal finalAmount;
        private String status;
        private LocalDateTime createdAt;

        public Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder customerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public Builder finalAmount(BigDecimal finalAmount) {
            this.finalAmount = finalAmount;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public RecentOrderDto build() {
            return new RecentOrderDto(this.id, this.customerName, this.finalAmount, this.status, this.createdAt);
        }
    }
}
