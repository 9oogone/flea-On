package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.dto.ShortsRequest;
import com.ssafy.fleaOn.web.service.ShortsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fleaon/shorts")
@Tag(name = "Shorts API", description = "Shorts 관련 API")
public class ShortsController {

    private final ShortsService shortsService;

    @Autowired
    public ShortsController(ShortsService shortsService) {
        this.shortsService = shortsService;
    }

    @PostMapping("/save")
    @Operation(summary = "숏츠 정보 저장", description = "숏츠 정보를 받아 저장합니다.")
    public ResponseEntity<?> saveShorts(@RequestBody ShortsRequest request) {
        try {
            Shorts savedShorts = shortsService.saveShorts(request);
            return new ResponseEntity<>(savedShorts, HttpStatus.CREATED);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("숏츠 생성 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/play/{shortsId}")
    @Operation(summary = "숏츠 정보 반환", description = "저장된 숏츠 정보를 반환합니다.")
    public ResponseEntity<Shorts> playShorts(@PathVariable int shortsId) {
        return shortsService.getShorts(shortsId)
                .map(shorts -> new ResponseEntity<>(shorts, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
