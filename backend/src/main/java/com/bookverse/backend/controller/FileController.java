package com.bookverse.backend.controller;

import com.bookverse.backend.dto.MessageResponse;
import com.bookverse.backend.exception.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final String UPLOAD_DIR = "uploads";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Please select a file to upload.");
        }

        try {
            // Create uploads directory if it does not exist
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate unique file name
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path path = Paths.get(UPLOAD_DIR + File.separator + uniqueFileName);
            
            // Save file bytes
            Files.write(path, file.getBytes());

            // Build full URL paths
            String fileUrl = "http://localhost:8080/uploads/" + uniqueFileName;
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", uniqueFileName);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            throw new BadRequestException("Could not upload file: " + e.getMessage());
        }
    }
}
