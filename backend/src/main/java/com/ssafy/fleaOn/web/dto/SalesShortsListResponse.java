package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.TradeDone;
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
public class SalesShortsListResponse {

    private int shortsId;
    private String productName;
    private int productPrice;
    private String tradePlace;
    private LocalTime length;
    private LocalTime tradeTime;
    private LocalDate tradeDate;
    private String videoAddress;
    private int userId;
    private boolean isTradeDone;

}
