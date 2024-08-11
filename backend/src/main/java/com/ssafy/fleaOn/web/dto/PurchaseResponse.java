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
public class PurchaseResponse {

    private int productId;
    private String productName;
    private int productPrice;
    private int liveId;
    private String tradePlace;
    private LocalTime tradeTime;
    private LocalDate tradeDate;
    private boolean isTradeDone;
}
