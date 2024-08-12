package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TradeDoneSchedule {
    private int productId;
    private String productName;
    private int productPrice;
    private int buyerId;
    private int sellerId;
    private String tradePlace;
    private LocalDate tradeDate;
    private LocalTime tradeTime;
}