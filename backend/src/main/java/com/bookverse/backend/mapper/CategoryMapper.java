package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.CategoryDto;
import com.bookverse.backend.entity.Category;

public class CategoryMapper {

    public static CategoryDto toDto(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    public static Category toEntity(CategoryDto dto) {
        if (dto == null) {
            return null;
        }

        return Category.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }
}
