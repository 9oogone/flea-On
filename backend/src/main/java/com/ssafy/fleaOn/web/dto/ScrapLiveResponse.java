package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScrapLiveResponse {
    private String title;
    private int sellerId;
    private LocalDateTime liveDate;
    private int isLive;
    private String thumbnail;
    private String dongName;
    private int liveId;
    private int viewCount;
}
