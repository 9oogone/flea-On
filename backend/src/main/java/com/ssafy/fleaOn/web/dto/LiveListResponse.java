package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LiveListResponse {
    private String title;
    private String dongName;
    private LocalDateTime liveDate;
    private int isLive;
    private int liveId;
    private int viewCount;
}
