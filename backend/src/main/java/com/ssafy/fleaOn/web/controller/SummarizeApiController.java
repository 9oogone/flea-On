package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.domain.ShortsContent;
import com.ssafy.fleaOn.web.dto.InputTextDto;
import com.ssafy.fleaOn.web.dto.SummaryResponse;
import com.ssafy.fleaOn.web.service.SummarizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fleaon/summarize")
@RequiredArgsConstructor
public class SummarizeApiController {

    private final SummarizeService summarizeService;

    @PostMapping("/")
    public ResponseEntity<?> postSummarize(@RequestBody InputTextDto inputText) {
        try {
            ShortsContent summaryResponse = summarizeService.summarize(inputText.getText(), inputText.getShortsId());
            return ResponseEntity.status(HttpStatus.OK).body(summaryResponse);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }
}
