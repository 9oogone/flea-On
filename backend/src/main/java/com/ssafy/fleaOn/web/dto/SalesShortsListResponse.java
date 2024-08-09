package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.TradeDone;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    private String videoAddress;
    private int userId;
    private TradeDone tradeDone;

}
