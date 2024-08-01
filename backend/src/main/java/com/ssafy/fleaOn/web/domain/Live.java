package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "live")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Live {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "live_id", updatable = false)
    private int id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "live_date", nullable = false)
    private LocalDateTime live_date;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "trade_place", nullable = false)
    private String trade_place;

    @Column(name = "is_live", nullable = false)
    private Boolean is_live;

    @Column(name = "seller_id", nullable = false)
    private int sellerId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Builder
    public Live(String title, LocalDateTime live_date, String thumbnail, String trade_place, User user) {
        this.title = title;
        this.live_date = live_date;
        this.thumbnail = thumbnail;
        this.trade_place = trade_place;
        this.user = user;
        this.is_live = false;
    }

    public void update(String title, LocalDateTime live_date, String thumbnail, String trade_place) {
        this.title = title;
        this.live_date = live_date;
        this.thumbnail = thumbnail;
        this.trade_place = trade_place;
    }
}
