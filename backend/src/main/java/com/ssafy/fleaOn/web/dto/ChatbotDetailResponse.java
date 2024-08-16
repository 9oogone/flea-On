package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Trade;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

// ChatbotDetailResponse.java
@Getter
public class ChatbotDetailResponse {
    private final LocalTime tradeTime;
    private final LocalDate tradeDate;
    private final String tradePlace;
    private final List<ChatbotProductResponse> buyProduct;
    private final List<ChatbotProductResponse> otherProduct;

    public ChatbotDetailResponse(Trade trade, List<ChatbotProductResponse> buyProducts, List<ChatbotProductResponse> otherProducts) {
        this.tradeTime = trade.getTradeTime();
        this.tradeDate = trade.getTradeDate();
        this.tradePlace = trade.getTradePlace();
        this.buyProduct = buyProducts;
        this.otherProduct = otherProducts;
    }
}

