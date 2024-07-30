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

    @EmbeddedId
    private UserId id;


    // regionCode를 가져오는 메서드 추가
    public String getRegionCode() {
        return id.getRegionCode();
    }

    // userId를 가져오는 메서드 추가
    public int getUserId() {
        return id.getUserId();
    }
}
