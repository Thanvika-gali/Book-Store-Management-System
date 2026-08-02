package com.bookverse.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RentalRequest {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotBlank(message = "Rental type is required")
    private String rentalType; // RENT or BORROW

    @Min(value = 1, message = "Duration must be at least 1 day")
    private int durationDays;

    public RentalRequest() {
    }

    public RentalRequest(Long bookId, String rentalType, int durationDays) {
        this.bookId = bookId;
        this.rentalType = rentalType;
        this.durationDays = durationDays;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getRentalType() {
        return rentalType;
    }

    public void setRentalType(String rentalType) {
        this.rentalType = rentalType;
    }

    public int getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long bookId;
        private String rentalType;
        private int durationDays;

        public Builder bookId(Long bookId) {
            this.bookId = bookId;
            return this;
        }

        public Builder rentalType(String rentalType) {
            this.rentalType = rentalType;
            return this;
        }

        public Builder durationDays(int durationDays) {
            this.durationDays = durationDays;
            return this;
        }

        public RentalRequest build() {
            return new RentalRequest(bookId, rentalType, durationDays);
        }
    }
}
