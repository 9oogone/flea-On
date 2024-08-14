package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import lombok.Getter;

// ChatbotProductResponse.java
@Getter
public class ChatbotProductResponse {
    private final int productId;
    private final String name;
    private final int price;
    private final int currentBuyerId;
    private final int reservationCount;
    private final ShortsDto shorts;
    private final int current;

    public ChatbotProductResponse(Product product, int current) {
        this.productId = product.getProductId();
        this.name = product.getName();
        this.price = product.getPrice();
        this.currentBuyerId = product.getCurrentBuyerId();
        this.reservationCount = product.getReservationCount();
        this.shorts = new ShortsDto(product.getShorts());
        this.current = current;
    }
}
