package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DayTradeResponse {
    private String productName;
    private int price;
    private int buyerId;
    private int sellerId;
    private int productId;
    private String dongName;
    private String tradePlace;
    private LocalTime tradeTime;
    private int chattingId;
    private int liveId;
}
