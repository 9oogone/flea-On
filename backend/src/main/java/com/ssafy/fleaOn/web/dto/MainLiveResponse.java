package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MainLiveResponse {
    private int liveId;
    private String liveTitle;
    private int currentView;
    private String productName;
    private int productPrice;
    private String tradePlace;
    private int isLive;
}
