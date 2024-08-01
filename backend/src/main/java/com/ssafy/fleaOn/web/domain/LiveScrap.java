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

    @ManyToOne
    @JoinColumn(name = "live_id", insertable = false, updatable = false)
    private Live live;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
}
