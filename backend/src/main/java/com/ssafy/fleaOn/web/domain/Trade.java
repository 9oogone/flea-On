package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

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

    @Column(name = "live_id")
    private int liveId;

    @Column(name = "seller_id")
    private int sellerId;

    @Column(name = "product_id")
    private int productId;

    @Column(name = "trade_date")
    private Date tradeDate;

    @Column(name = "trade_time")
    private Date tradeTime;

    @Column(name = "trade_place")
    private String tradePlace;

    @Id
    @Column(name = "chatting_id")
    private int chattingId ;

    @Column(name = "buyer_id")
    private int buyerId;
}
