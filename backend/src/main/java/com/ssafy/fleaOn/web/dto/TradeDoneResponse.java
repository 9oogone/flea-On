package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TradeDoneResponse {
    private int productId;
    private String productName;
    private int productPrice;
    private String tradePlace;
    private LocalDate tradeDate;
    private LocalTime tradeTime;
}
