package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "trade_done")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TradeDone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trade_done_id")
    private Integer tradeDoneId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_price", nullable = false)
    private Integer productPrice;

    @Column(name = "trade_date", nullable = false)
    private LocalDate tradeDate;

    @Column(name = "trade_time", nullable = false)
    private LocalTime tradeTime;

    @Column(name = "trade_place", nullable = false)
    private String tradePlace;

    @Column(name = "live_title")
    private String liveTitle;

    @Column(name = "product_id", nullable = false)
    private int productId;

}
