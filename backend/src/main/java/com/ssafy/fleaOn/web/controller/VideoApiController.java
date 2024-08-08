package com.ssafy.fleaOn.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaon/video")
@Slf4j
@Tag(name = "video API", description = "video 관련 API")
public class VideoApiController {

    @Operation(summary = "쇼츠 보기", description = "쇼츠를 볼 때 사용합니다.")
    @GetMapping("/streamVideo")
    public ResponseEntity<Resource> streamVideo(@RequestParam("filePath") String filePath) {
        System.out.println("/opt/openvidu/recordings/"+filePath+"/"+filePath+".mp4");
        UrlResource resource;
        log.debug("Received request to stream video with path: {}", filePath);
        try {
            Path videoPath = Paths.get("/opt/openvidu/recordings/"+filePath+"/"+filePath+".mp4");
            if (!Files.exists(videoPath)) {
                log.warn("File not found: {}", filePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            resource = new UrlResource(videoPath.toUri());
        } catch (MalformedURLException e) {
            log.error("The given file path is not valid: {}", filePath, e);
            throw new RuntimeException("The given URL path is not valid", e);
        }

        String contentType;
        try {
            contentType = Files.probeContentType(Paths.get(filePath));
        } catch (IOException e) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
