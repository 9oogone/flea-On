package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class TradeRequest {
    private int tradeId;
    private int buyerId;
    private int sellerId;
    private int productId;
    private int liveId;

    private String tradePlace;
    private String tradeTime;
    private String tradeDate;

    public Trade toEntity(Live live, Product product, Chatting chatting, Shorts shorts) {
        return Trade.builder()
                .sellerId(this.sellerId)
                .buyerId(this.buyerId)
                .tradePlace(this.tradePlace)
                .tradeTime(LocalTime.parse(this.tradeTime))
                .tradeDate(LocalDate.parse(this.tradeDate))
                .live(live)
                .product(product)
                .chatting(chatting)
                .shorts(shorts)
                .build();
    }

//    public TradeDone toTradeDone(Trade trade) {
//        return TradeDone.builder()
//                .buyer(trade.getBuyer())
//                .seller(trade.getSeller())
//                .productName(trade.getProduct().getName())
//                .productPrice(trade.getProduct().getPrice())
//                .tradeDate(trade.getTradeDate())
//                .tradeTime(trade.getTradeTime())
//                .tradePlace(trade.getTradePlace())
//                .liveTitle(trade.getLive().getTitle())
//                .build();
//    }
}
