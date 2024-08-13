package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Optional;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TradeRequest {
    private int buyerId;
    private int sellerId;
    private int productId;
    private int liveId;

    private String tradePlace;
    private String tradeTime;
    private LocalDate tradeDate;

    public Trade toEntity(Live live, Product product, Chatting chatting, Optional<Shorts> shorts) {
        LocalTime parsedTime;
        try {
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
            parsedTime = LocalTime.parse(this.tradeTime, timeFormatter);
        } catch (DateTimeParseException e) {
            DateTimeFormatter fallbackFormatter = DateTimeFormatter.ofPattern("HH:mm");
            parsedTime = LocalTime.parse(this.tradeTime, fallbackFormatter);
        }
        return Trade.builder()
                .sellerId(this.sellerId)
                .buyerId(this.buyerId)
                .tradePlace(this.tradePlace)
                .tradeTime(parsedTime)
                .tradeDate(this.tradeDate)
                .live(live)
                .product(product)
                .chatting(chatting)
                .shorts(shorts.orElse(null))
                .build();
    }
}
