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
    @Column(name = "user_id")
    private int user_id;

    @Column(name = "region_code")
    private String region_code;
}
