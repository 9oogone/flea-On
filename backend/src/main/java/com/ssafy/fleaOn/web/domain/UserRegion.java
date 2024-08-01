package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "region_code", nullable = false)
    private String regionCode;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;



}
