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
    private LocalDateTime liveDate;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "trade_place", nullable = false)
    private String tradePlace;

    @Column(name = "is_live", nullable = false)
    private Boolean isLive;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Builder
    public Live(String title, LocalDateTime liveDate, String thumbnail, String tradePlace, User seller) {
        this.title = title;
        this.liveDate = liveDate;
        this.thumbnail = thumbnail;
        this.tradePlace = tradePlace;
        this.seller = seller;
        this.isLive = false;
    }

    public void update(String title, LocalDateTime liveDate, String thumbnail, String tradePlace) {
        this.title = title;
        this.liveDate = liveDate;
        this.thumbnail = thumbnail;
        this.tradePlace = tradePlace;
    }

    public void onOff(){
        this.is_live = !is_live;
    }
}