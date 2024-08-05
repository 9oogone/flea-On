package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import javax.swing.plaf.synth.Region;

@AllArgsConstructor
@Table(name = "user_region")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class UserRegion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "region_id", nullable = false)
    private int regionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_code")
    private RegionInfo region;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

}
