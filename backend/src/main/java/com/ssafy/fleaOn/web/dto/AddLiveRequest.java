package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자 추가
@Getter
public class AddLiveRequest {
    private String title;
    private LocalDateTime live_date;
    private String thumbnail;
    private String trade_place;
    private List<AddProductRequest> product;

    public Live toEntity(User user) {
        return Live.builder()
                .title(title)
                .live_date(live_date)
                .thumbnail(thumbnail)
                .trade_place(trade_place)
                .user(user)  // User 객체를 Live 객체에 설정합니다.
                .build();
    }
}
