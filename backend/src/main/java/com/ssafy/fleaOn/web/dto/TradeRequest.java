package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TradeRequest {

    private int productId;
    private int liveId;
    private int buyerId;
    private int sellerId;
    private LocalDate tradeDate;
    private String tradeTime; // String으로 변경
    private String tradePlace;

    public Trade toEntity(Live live, Product product){
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalTime parsedTradeTime = LocalTime.parse(tradeTime, timeFormatter);

        return Trade.builder()
                .buyerId(buyerId)
                .sellerId(sellerId)
                .live(live)
                .product(product)
                .tradeDate(tradeDate)
                .tradeTime(parsedTradeTime)
                .tradePlace(tradePlace)
                .build();
    }
}
