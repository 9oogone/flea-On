package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "shorts_content")
public class ShortsContent {

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shorts_id", insertable = false, updatable = false)
    private Shorts shorts;

    @Column(name = "period")
    private String period;

    @Column(name = "status")
    private String status;

    @Column(name = "commend")
    private String commend;

    @Column(name = "description")
    private String description;
}
