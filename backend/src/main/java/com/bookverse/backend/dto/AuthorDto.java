package com.bookverse.backend.dto;

import jakarta.validation.constraints.NotBlank;
public class AuthorDto {
    private Long id;

    @NotBlank(message = "Author name is required")
    private String name;
    
    private String bio;

    public AuthorDto() {
    }

    public AuthorDto(Long id, String name, String bio) {
        this.id = id;
        this.name = name;
        this.bio = bio;
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

    public String getBio() {
        return this.bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String bio;

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

        public Builder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public AuthorDto build() {
            return new AuthorDto(this.id, this.name, this.bio);
        }
    }
}
