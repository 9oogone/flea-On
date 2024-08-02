package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "live_trade_time")
public class LiveTradeTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "time_id")
    private int timeId;

    @Column(name = "trade_start")
    private java.sql.Time tradeStart;

    @Column(name = "trade_end")
    private java.sql.Time tradeEnd;

    @Column(name = "date")
    private java.sql.Date date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_id", insertable = false, updatable = false)
    private Live live;

    @Builder
    public LiveTradeTime(Live live, java.sql.Time tradeStart, java.sql.Time tradeEnd, java.sql.Date date) {
        this.live = live;
        this.tradeStart = tradeStart;
        this.tradeEnd = tradeEnd;
        this.date = date;
    }
}
