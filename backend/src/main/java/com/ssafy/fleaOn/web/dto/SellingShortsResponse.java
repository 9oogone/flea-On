package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SellingShortsResponse {
    private int productId;
    private int shortsId;
    private String productName;
    private int productPrice;
    private String dongName;
    private LocalDateTime liveDate;
    private boolean tradeNow;
}
