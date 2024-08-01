package com.ssafy.fleaOn.web.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.ssafy.fleaOn.web.util.LocalDateTimeDeserializer;
import com.ssafy.fleaOn.web.util.LocalDateTimeSerializer;
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
    private int liveId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "live_date", nullable = false)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime live_date;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "trade_place", nullable = false)
    private String trade_place;

    @Column(name = "is_live", nullable = false)
    private Boolean is_live;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Builder
    public Live(String title, LocalDateTime live_date, String thumbnail, String trade_place, User seller) {
        this.title = title;
        this.live_date = live_date;
        this.thumbnail = thumbnail;
        this.trade_place = trade_place;
        this.seller = seller;
        this.is_live = false;
    }

    public void update(String title, LocalDateTime live_date, String thumbnail, String trade_place) {
        this.title = title;
        this.live_date = live_date;
        this.thumbnail = thumbnail;
        this.trade_place = trade_place;
    }
}