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

    @ManyToOne
    @JoinColumn(name = "region_code",insertable = false, updatable = false)
    private RegionInfo region;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

}
