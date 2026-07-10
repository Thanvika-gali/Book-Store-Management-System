package com.bookverse.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardDto {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalCustomers;
    private Long totalBooksSold;
    private Long lowStockBooksCount;
    private List<RecentOrderDto> recentOrders;
    private List<LowStockBookDto> lowStockBooks;

    public AdminDashboardDto() {
    }

    public AdminDashboardDto(BigDecimal totalRevenue, Long totalOrders, Long totalCustomers, Long totalBooksSold, Long lowStockBooksCount, List<RecentOrderDto> recentOrders, List<LowStockBookDto> lowStockBooks) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.totalCustomers = totalCustomers;
        this.totalBooksSold = totalBooksSold;
        this.lowStockBooksCount = lowStockBooksCount;
        this.recentOrders = recentOrders;
        this.lowStockBooks = lowStockBooks;
    }

    public BigDecimal getTotalRevenue() {
        return this.totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalOrders() {
        return this.totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalCustomers() {
        return this.totalCustomers;
    }

    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Long getTotalBooksSold() {
        return this.totalBooksSold;
    }

    public void setTotalBooksSold(Long totalBooksSold) {
        this.totalBooksSold = totalBooksSold;
    }

    public Long getLowStockBooksCount() {
        return this.lowStockBooksCount;
    }

    public void setLowStockBooksCount(Long lowStockBooksCount) {
        this.lowStockBooksCount = lowStockBooksCount;
    }

    public List<RecentOrderDto> getRecentOrders() {
        return this.recentOrders;
    }

    public void setRecentOrders(List<RecentOrderDto> recentOrders) {
        this.recentOrders = recentOrders;
    }

    public List<LowStockBookDto> getLowStockBooks() {
        return this.lowStockBooks;
    }

    public void setLowStockBooks(List<LowStockBookDto> lowStockBooks) {
        this.lowStockBooks = lowStockBooks;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private BigDecimal totalRevenue;
        private Long totalOrders;
        private Long totalCustomers;
        private Long totalBooksSold;
        private Long lowStockBooksCount;
        private List<RecentOrderDto> recentOrders;
        private List<LowStockBookDto> lowStockBooks;

        public Builder() {
        }

        public Builder totalRevenue(BigDecimal totalRevenue) {
            this.totalRevenue = totalRevenue;
            return this;
        }

        public Builder totalOrders(Long totalOrders) {
            this.totalOrders = totalOrders;
            return this;
        }

        public Builder totalCustomers(Long totalCustomers) {
            this.totalCustomers = totalCustomers;
            return this;
        }

        public Builder totalBooksSold(Long totalBooksSold) {
            this.totalBooksSold = totalBooksSold;
            return this;
        }

        public Builder lowStockBooksCount(Long lowStockBooksCount) {
            this.lowStockBooksCount = lowStockBooksCount;
            return this;
        }

        public Builder recentOrders(List<RecentOrderDto> recentOrders) {
            this.recentOrders = recentOrders;
            return this;
        }

        public Builder lowStockBooks(List<LowStockBookDto> lowStockBooks) {
            this.lowStockBooks = lowStockBooks;
            return this;
        }

        public AdminDashboardDto build() {
            return new AdminDashboardDto(this.totalRevenue, this.totalOrders, this.totalCustomers, this.totalBooksSold, this.lowStockBooksCount, this.recentOrders, this.lowStockBooks);
        }
    }
}
