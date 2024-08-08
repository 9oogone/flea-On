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

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaon/video")
@Slf4j
@Tag(name = "video API", description = "video 관련 API")
public class VideoApiController {

    private static final Map<String, String> mimeTypeMap = new HashMap<>();

    static {
        mimeTypeMap.put("mp4", "video/mp4");
        mimeTypeMap.put("mkv", "video/x-matroska");
        mimeTypeMap.put("webm", "video/webm");
        mimeTypeMap.put("avi", "video/x-msvideo");
        mimeTypeMap.put("mov", "video/quicktime");
        // 필요한 다른 확장자와 MIME 타입을 추가할 수 있습니다.
    }

    @Operation(summary = "쇼츠 보기", description = "쇼츠를 볼 때 사용합니다.")
    @GetMapping("/streamVideo")
    public ResponseEntity<Resource> streamVideo(@RequestParam("filePath") String filePath) {
        String fullPath = "/opt/openvidu/recordings/" + filePath + "/" + filePath + ".mp4";
        System.out.println(fullPath);
        File file = new File(fullPath);
        log.debug("Received request to stream video with path: {}", fullPath);

        if (!file.exists()) {
            log.warn("File not found: {}", fullPath);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        UrlResource resource;
        try {
            resource = new UrlResource(file.toURI());
        } catch (MalformedURLException e) {
            log.error("The given file path is not valid: {}", fullPath, e);
            throw new RuntimeException("The given URL path is not valid", e);
        }

        String contentType = getMimeType(file);
        
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    private String getMimeType(File file) {
        String extension = getFileExtension(file);
        return mimeTypeMap.getOrDefault(extension, "application/octet-stream");
    }

    private String getFileExtension(File file) {
        String name = file.getName();
        int lastIndexOf = name.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return ""; // empty extension
        }
        return name.substring(lastIndexOf + 1);
    }
}
