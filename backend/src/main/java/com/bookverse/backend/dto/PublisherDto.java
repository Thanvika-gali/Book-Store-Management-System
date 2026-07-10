package com.bookverse.backend.dto;

import jakarta.validation.constraints.NotBlank;
public class PublisherDto {
    private Long id;

    @NotBlank(message = "Publisher name is required")
    private String name;
    
    private String address;

    public PublisherDto() {
    }

    public PublisherDto(Long id, String name, String address) {
        this.id = id;
        this.name = name;
        this.address = address;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String address;

        public Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public PublisherDto build() {
            return new PublisherDto(this.id, this.name, this.address);
        }
    }
}
