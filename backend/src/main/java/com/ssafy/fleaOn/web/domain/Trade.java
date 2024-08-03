package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@Table(name = "trade")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Builder
public class Trade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trade_id")
    private int tradeId;

    @Column(name = "seller_id")
    private int sellerId;

    @Column(name = "trade_date")
    private LocalDate tradeDate;

    @Column(name = "trade_time")
    private LocalTime tradeTime; // LocalTime으로 변경

    @Column(name = "trade_place")
    private String tradePlace;

    @Column(name = "chatting_id")
    private int chattingId;

    @Column(name = "buyer_id")
    private int buyerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_id", insertable = false, updatable = false)
    private Live live;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shorts_id", insertable = false, updatable = false)
    private Shorts shorts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatting_id", insertable = false, updatable = false)
    private Chatting chatting;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @Builder
    public Trade(int sellerId, int buyerId, LocalDate tradeDate, LocalTime tradeTime, String tradePlace, Live live, Product product) {
        this.sellerId = sellerId;
        this.buyerId = buyerId;
        this.tradeDate = tradeDate;
        this.tradeTime = tradeTime;
        this.tradePlace = tradePlace;
        this.live = live;
        this.product = product;
    }

    // getProductId 메서드 추가
    public int getProductId() {
        return product != null ? product.getProductId() : 0;
    }
}
