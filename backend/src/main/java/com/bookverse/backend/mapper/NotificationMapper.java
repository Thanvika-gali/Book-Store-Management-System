package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.NotificationDto;
import com.bookverse.backend.entity.Notification;

public class NotificationMapper {

    public static NotificationDto toDto(Notification notification) {
        if (notification == null) {
            return null;
        }

        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
