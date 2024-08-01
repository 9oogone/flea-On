package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shorts_scrap")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
public class ShortsScrap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scrap_id")
    private int scrapId;


    @ManyToOne
    @JoinColumn(name = "shorts_id", insertable = false, updatable = false)
    private Shorts shorts;

    @ManyToOne
    @JoinColumn(name = "user_id",  insertable = false, updatable = false)
    private User user;

}
