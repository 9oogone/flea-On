package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "region_info")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
public class RegionInfo {

    @Id
    @Column(name = "region_code")
    private String regionCode;

    @Column(name = "sido")
    private String sido;

    @Column(name = "gugun")
    private String gugun;

    @Column(name = "eupmyeon")
    private String eupmyeon;

    @Column(name = "li")
    private String li;
}
