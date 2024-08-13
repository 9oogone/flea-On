package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "live_scrap")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class LiveScrap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scrap_id")
    private int scrapId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_id")
    private Live live;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
