package com.ssafy.fleaOn.web.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/fleaon/video")
@Tag(name = "vidoe 관련 API", description = "video 관련 API입니다. ")
public class VideoApiController {

    @GetMapping("/")
    public ResponseEntity<Resource> getVideo(@RequestParam String filename, HttpRange range) {
        try {
            Path videoPath = Paths.get("videos/" + filename);
            if (!Files.exists(videoPath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Resource videoResource = new UrlResource(videoPath.toUri());

            long contentLength = videoResource.contentLength();
            long start = 0;
            long end = contentLength - 1;
            if (range != null) {
                start = range.getRangeStart(contentLength);
                end = range.getRangeEnd(contentLength);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Range", "bytes " + start + "-" + end + "/" + contentLength);
            headers.add("Accept-Ranges", "bytes");
            headers.setContentLength(end - start + 1);

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .headers(headers)
                    .body(videoResource);

        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
