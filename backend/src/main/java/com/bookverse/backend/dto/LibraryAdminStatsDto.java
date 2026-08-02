package com.bookverse.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class LibraryAdminStatsDto {
    private long totalActiveLoans;
    private long totalOverdueLoans;
    private BigDecimal totalRevenue;
    private List<LanguageLoanStat> loansByLanguage;

    public LibraryAdminStatsDto() {
    }

    public LibraryAdminStatsDto(long totalActiveLoans, long totalOverdueLoans, BigDecimal totalRevenue, List<LanguageLoanStat> loansByLanguage) {
        this.totalActiveLoans = totalActiveLoans;
        this.totalOverdueLoans = totalOverdueLoans;
        this.totalRevenue = totalRevenue;
        this.loansByLanguage = loansByLanguage;
    }

    public long getTotalActiveLoans() {
        return totalActiveLoans;
    }

    public void setTotalActiveLoans(long totalActiveLoans) {
        this.totalActiveLoans = totalActiveLoans;
    }

    public long getTotalOverdueLoans() {
        return totalOverdueLoans;
    }

    public void setTotalOverdueLoans(long totalOverdueLoans) {
        this.totalOverdueLoans = totalOverdueLoans;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<LanguageLoanStat> getLoansByLanguage() {
        return loansByLanguage;
    }

    public void setLoansByLanguage(List<LanguageLoanStat> loansByLanguage) {
        this.loansByLanguage = loansByLanguage;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalActiveLoans;
        private long totalOverdueLoans;
        private BigDecimal totalRevenue;
        private List<LanguageLoanStat> loansByLanguage;

        public Builder totalActiveLoans(long totalActiveLoans) {
            this.totalActiveLoans = totalActiveLoans;
            return this;
        }

        public Builder totalOverdueLoans(long totalOverdueLoans) {
            this.totalOverdueLoans = totalOverdueLoans;
            return this;
        }

        public Builder totalRevenue(BigDecimal totalRevenue) {
            this.totalRevenue = totalRevenue;
            return this;
        }

        public Builder loansByLanguage(List<LanguageLoanStat> loansByLanguage) {
            this.loansByLanguage = loansByLanguage;
            return this;
        }

        public LibraryAdminStatsDto build() {
            return new LibraryAdminStatsDto(totalActiveLoans, totalOverdueLoans, totalRevenue, loansByLanguage);
        }
    }

    public static class LanguageLoanStat {
        private String language;
        private long count;

        public LanguageLoanStat() {
        }

        public LanguageLoanStat(String language, long count) {
            this.language = language;
            this.count = count;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }
}
