package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "live_scrap")
public class LiveScrap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scrap_id")
    private int scrapId;

    @ManyToOne
    @JoinColumn(name = "live_id", nullable = false)
    private Live live;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Builder
    public LiveScrap(int liveId, User user) {
        this.live = live;
        this.user = user;
    }
}
