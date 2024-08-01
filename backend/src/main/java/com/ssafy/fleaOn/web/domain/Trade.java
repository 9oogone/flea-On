package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.time.LocalDate;

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
    private LocalDate tradeDate;

    @Column(name = "trade_time")
    private Time tradeTime;

    @Column(name = "trade_place")
    private String tradePlace;

    @Column(name = "chatting_id")
    private int chattingId;

    @Column(name = "buyer_id")
    private int buyerId;

    @Column(name = "shorts_id")
    private int shortsId;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "shorts_id", insertable = false, updatable = false)
    private Shorts shorts;

    @OneToOne
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

}
