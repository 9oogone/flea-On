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
@Setter
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
    private LocalTime tradeTime;

    @Column(name = "trade_place")
    private String tradePlace;

    @Column(name = "buyer_id")
    private int buyerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_id")
    private Live live;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatting_id")
    private Chatting chatting;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shorts_id")
    private Shorts shorts;

    @Builder
    public Trade(int sellerId, int buyerId, LocalDate tradeDate, LocalTime tradeTime, String tradePlace, Live live, Product product, Chatting chatting, Shorts shorts) {
        this.sellerId = sellerId;
        this.buyerId = buyerId;
        this.tradeDate = tradeDate;
        this.tradeTime = tradeTime;
        this.tradePlace = tradePlace;
        this.live = live;
        this.product = product;
        this.chatting = chatting;
        this.shorts = shorts;
    }
}
