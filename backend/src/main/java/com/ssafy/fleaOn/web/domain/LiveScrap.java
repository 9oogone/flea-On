package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "live_scrap")
public class LiveScrap {

    @Id
    @Column(name = "scrap_id")
    private int scrapId;

    @Column(name = "live_id")
    private int liveId;

    @Column(name = "user_id")
    private int userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Builder
    public LiveScrap(int scrapId, int liveId, int userId) {
        this.scrapId = scrapId;
        this.liveId = liveId;
        this.userId = userId;
    }
}
