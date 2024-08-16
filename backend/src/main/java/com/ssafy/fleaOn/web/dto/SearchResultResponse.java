package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchResultResponse {
    private List<ResultUpcomingResponse> upcomingResponseList;
    private List<ResultLiveResponse> liveResponseList;
    private List<ResultShortsResponse> shortsResponseList;
}
