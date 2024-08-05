package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
    private LocalTime tradeStart;

    @Column(name = "trade_end")
    private LocalTime tradeEnd;

    @Column(name = "date")
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_id", nullable = false)
    private Live live;

    @Builder
    public LiveTradeTime(Live live, LocalTime tradeStart, LocalTime tradeEnd, LocalDate date) {
        this.live = live;
        this.tradeStart = tradeStart;
        this.tradeEnd = tradeEnd;
        this.date = date;
    }
}
