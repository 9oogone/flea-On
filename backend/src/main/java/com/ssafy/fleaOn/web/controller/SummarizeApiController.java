package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.InputTextDto;
import com.ssafy.fleaOn.web.dto.SummaryResponse;
import com.ssafy.fleaOn.web.service.SummarizeService;
import lombok.RequiredArgsConstructor;
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
    public SummaryResponse postSummarize(@RequestBody InputTextDto inputText) {
        SummaryResponse summary = summarizeService.summarize(inputText.getText());
        return summary;
    }
}
