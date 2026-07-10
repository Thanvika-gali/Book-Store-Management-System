package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.PublisherDto;
import com.bookverse.backend.entity.Publisher;

public class PublisherMapper {

    public static PublisherDto toDto(Publisher publisher) {
        if (publisher == null) {
            return null;
        }

        return PublisherDto.builder()
                .id(publisher.getId())
                .name(publisher.getName())
                .address(publisher.getAddress())
                .build();
    }

    public static Publisher toEntity(PublisherDto dto) {
        if (dto == null) {
            return null;
        }

        return Publisher.builder()
                .id(dto.getId())
                .name(dto.getName())
                .address(dto.getAddress())
                .build();
    }
}
