package com.bookverse.backend.controller;

import com.bookverse.backend.dto.ReviewDto;
import com.bookverse.backend.mapper.ReviewMapper;
import com.bookverse.backend.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ReviewDto>> getReviewsByBookId(@PathVariable Long bookId) {
        List<ReviewDto> reviews = reviewRepository.findByBookId(bookId).stream()
                .map(ReviewMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }
}
