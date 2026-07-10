package com.bookverse.backend.dto;

import java.math.BigDecimal;

public class MonthlyRevenueDto {
    private String month;
    private BigDecimal revenue;

    public MonthlyRevenueDto() {
    }

    public MonthlyRevenueDto(String month, BigDecimal revenue) {
        this.month = month;
        this.revenue = revenue;
    }

    public String getMonth() {
        return this.month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public BigDecimal getRevenue() {
        return this.revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String month;
        private BigDecimal revenue;

        public Builder() {
        }

        public Builder month(String month) {
            this.month = month;
            return this;
        }

        public Builder revenue(BigDecimal revenue) {
            this.revenue = revenue;
            return this;
        }

        public MonthlyRevenueDto build() {
            return new MonthlyRevenueDto(this.month, this.revenue);
        }
    }
}
