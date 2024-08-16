package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.SummaryResponse;
import com.ssafy.fleaOn.web.service.ShortsService;
import com.ssafy.fleaOn.web.service.SummarizeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fleaon/summation")
public class SummationApiController {

    private final ShortsService shortsService;
    private final SummarizeService summarizeService;

    public SummationApiController(ShortsService shortsService, SummarizeService summarizeService) {
        this.shortsService = shortsService;
        this.summarizeService = summarizeService;
    }

    @GetMapping("/ai")
    public ResponseEntity<?> summation(@RequestParam("shortId") int shortId) {
        SummaryResponse response = summarizeService.getSummary(shortId);
        return ResponseEntity.ok(response);
    }
}
