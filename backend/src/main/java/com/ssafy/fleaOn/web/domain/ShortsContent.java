package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "shorts_content")
public class ShortsContent {

    @Id
    @Column(name = "shorts_id")
    private int shortsId;

    @Column(name = "period")
    private String period;

    @Column(name = "status")
    private String status;

    @Column(name = "commend")
    private String commend;

    @Column(name = "description")
    private String description;
}
