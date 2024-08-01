package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddLiveRequest {
    private String title;
    private String live_date; // LocalDateTime 대신 String 사용
    private String thumbnail;
    private String trade_place;
    private List<AddProductRequest> product;

    public Live toEntity(User user) {
        System.out.println(LocalDateTime.parse(live_date) +" "+user.getUserId());
        return Live.builder()
                .title(title)
                .live_date(LocalDateTime.parse(live_date))
                .thumbnail(thumbnail)
                .trade_place(trade_place)
                .seller(user)
                .build();
    }
}
