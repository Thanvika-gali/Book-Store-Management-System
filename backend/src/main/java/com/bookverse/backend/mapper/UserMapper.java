package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.UserDto;
import com.bookverse.backend.entity.User;

public class UserMapper {

    public static UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .profilePicture(user.getProfilePicture())
                .build();
    }
}
