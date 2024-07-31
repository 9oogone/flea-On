package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Data;

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

    public Live toEntity(int id) {
        return Live.builder()
                .title(title)
                .seller_id(id)
                .live_date(live_date)
                .thumbnail(thumbnail)
                .trade_place(trade_place)
                .build();
    }
}
