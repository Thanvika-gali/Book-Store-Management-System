package com.bookverse.backend.dto;

public class JwtResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String role;
    private String status;
    private String profilePicture;

    public JwtResponse() {
    }

    public JwtResponse(String token, Long id, String name, String email, String role, String status, String profilePicture) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.profilePicture = profilePicture;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProfilePicture() {
        return this.profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private Long id;
        private String name;
        private String email;
        private String role;
        private String status;
        private String profilePicture;

        public Builder() {
        }

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder profilePicture(String profilePicture) {
            this.profilePicture = profilePicture;
            return this;
        }

        public JwtResponse build() {
            return new JwtResponse(this.token, this.id, this.name, this.email, this.role, this.status, this.profilePicture);
        }
    }
}
