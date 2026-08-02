package com.bookverse.backend.controller;

import com.bookverse.backend.dto.MessageResponse;
import com.bookverse.backend.dto.ReadingProgressRequest;
import com.bookverse.backend.dto.ReadingSessionRequest;
import com.bookverse.backend.dto.ReadingTrackerDashboardDto;
import com.bookverse.backend.security.SecurityUtils;
import com.bookverse.backend.service.ReadingTrackerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/reading-tracker")
public class ReadingTrackerController {

    private final ReadingTrackerService readingTrackerService;

    public ReadingTrackerController(ReadingTrackerService readingTrackerService) {
        this.readingTrackerService = readingTrackerService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ReadingTrackerDashboardDto> getDashboard() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(readingTrackerService.getDashboardStats(userId));
    }

    @GetMapping("/status/{bookId}")
    public ResponseEntity<ReadingTrackerDashboardDto.ReadingProgressDto> getBookStatus(@PathVariable Long bookId) {
        Long userId = SecurityUtils.getCurrentUserId();
        try {
            return ResponseEntity.ok(readingTrackerService.getProgressForBook(userId, bookId));
        } catch (Exception e) {
            // Return empty response or 204 if progress not tracked yet
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/progress")
    public ResponseEntity<ReadingTrackerDashboardDto.ReadingProgressDto> updateProgress(@Valid @RequestBody ReadingProgressRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(readingTrackerService.updateReadingProgress(userId, request));
    }

    @PostMapping("/session")
    public ResponseEntity<MessageResponse> logSession(@Valid @RequestBody ReadingSessionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        readingTrackerService.logReadingSession(userId, request);
        return ResponseEntity.ok(new MessageResponse("Reading session logged successfully"));
    }

    @PostMapping("/goal")
    public ResponseEntity<MessageResponse> updateGoal(@RequestParam int targetBooks, @RequestParam int year) {
        Long userId = SecurityUtils.getCurrentUserId();
        readingTrackerService.updateYearlyGoal(userId, targetBooks, year);
        return ResponseEntity.ok(new MessageResponse("Yearly reading goal updated successfully"));
    }
}
