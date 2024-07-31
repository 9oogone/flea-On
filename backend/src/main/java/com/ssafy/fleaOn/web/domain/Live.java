package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Entity // 엔티티로 지정
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "live")
public class Live {
    @Id // id 필드를 기본키로 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키를 자동으로 1씩 증가
    @Column(name = "live_id", updatable = false)
    private int id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name="seller_id", nullable = false)
    private int seller_id;

    @Column(name = "live_date", nullable = false)
    private LocalDateTime live_date;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "trade_place", nullable = false)
    private String trade_place;

    @Column(name = "is_live", nullable = false)
    private Boolean is_live;

    // 객체를 유연하고 직관적으로 생성 가능 <- 디자인 패턴 중 하나
    // 빌더 패턴을 사용하면 어느 필드에 어떤 값이 들어가는지 명시적으로 파악 가능
    @Builder // 빌더 패턴으로 객체 생성
    public Live(String title, int seller_id, LocalDateTime live_date,String thumbnail, String trade_place) {
        this.title = title;
        this.seller_id = seller_id;
        this.live_date = live_date;
        this.thumbnail = thumbnail;
        this.trade_place = trade_place;
        this.is_live = false;
    }

}