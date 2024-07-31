package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자 추가
@Getter
public class UpdateLiveRequest {
    private String title;
    private LocalDateTime live_date;
    private String thumbnail;
    private String trade_place;
    private boolean is_live;
    private String userEmail;

}
