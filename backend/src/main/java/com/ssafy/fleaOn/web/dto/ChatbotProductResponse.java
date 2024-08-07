package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import lombok.Getter;

// ChatbotProductResponse.java
@Getter
public class ChatbotProductResponse {
    private int productId;
    private String name;
    private int price;
    private int currentBuyerId;
    private int reservationCount;
    private ShortsDto shorts;

    public ChatbotProductResponse(Product product) {
        this.productId = product.getProductId();
        this.name = product.getName();
        this.price = product.getPrice();
        this.currentBuyerId = product.getCurrentBuyerId();
        this.reservationCount = product.getReservationCount();
        this.shorts = new ShortsDto(product.getShorts());
    }

    public ChatbotProductResponse(int productId, String name, int price, int currentBuyerId, int reservationCount, Shorts shorts) {
    }
}
