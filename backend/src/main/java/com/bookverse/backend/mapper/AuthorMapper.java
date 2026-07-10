package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.AuthorDto;
import com.bookverse.backend.entity.Author;

public class AuthorMapper {

    public static AuthorDto toDto(Author author) {
        if (author == null) {
            return null;
        }

        return AuthorDto.builder()
                .id(author.getId())
                .name(author.getName())
                .bio(author.getBio())
                .build();
    }

    public static Author toEntity(AuthorDto dto) {
        if (dto == null) {
            return null;
        }

        return Author.builder()
                .id(dto.getId())
                .name(dto.getName())
                .bio(dto.getBio())
                .build();
    }
}
