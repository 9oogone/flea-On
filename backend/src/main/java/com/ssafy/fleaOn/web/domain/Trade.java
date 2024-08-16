package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "trade")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Trade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trade_id")
    private int tradeId;

    @Column(name = "buyer_id")
    private Integer buyerId;

    @Column(name = "seller_id")
    private Integer sellerId;

    @Column(name = "trade_date")
    private LocalDate tradeDate;

    @Column(name = "trade_time")
    private LocalTime tradeTime;

    @Column(name = "trade_place")
    private String tradePlace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_id", foreignKey = @ForeignKey(name = "live_id_foreign"))
    private Live live;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatting_id", foreignKey = @ForeignKey(name = "FKdfuysadep6uq9pv49vf4yqf60"))
    private Chatting chatting;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", foreignKey = @ForeignKey(name = "FKk7rb0h3k3agu32548w3lk4b8n"))
    private Product product;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shorts_id", foreignKey = @ForeignKey(name = "FK4vwxjamrx8yjltmxlvt36p695"))
    private Shorts shorts;

    @Builder
    public Trade(Integer sellerId, Integer buyerId, LocalDate tradeDate, LocalTime tradeTime, String tradePlace, Live live, Product product, Chatting chatting, Shorts shorts) {
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

    public void uploadShorts(Shorts shorts){
        this.shorts = shorts;
    }
}
