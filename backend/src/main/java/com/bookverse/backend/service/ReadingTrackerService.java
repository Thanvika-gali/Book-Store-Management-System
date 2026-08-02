package com.bookverse.backend.service;

import com.bookverse.backend.dto.ReadingProgressRequest;
import com.bookverse.backend.dto.ReadingSessionRequest;
import com.bookverse.backend.dto.ReadingTrackerDashboardDto;

public interface ReadingTrackerService {
    ReadingTrackerDashboardDto getDashboardStats(Long userId);
    ReadingTrackerDashboardDto.ReadingProgressDto getProgressForBook(Long userId, Long bookId);
    ReadingTrackerDashboardDto.ReadingProgressDto updateReadingProgress(Long userId, ReadingProgressRequest request);
    void logReadingSession(Long userId, ReadingSessionRequest request);
    void updateYearlyGoal(Long userId, int targetBooks, int year);
}
