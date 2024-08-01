package com.ssafy.fleaOn.web.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime live_date;

    private String thumbnail;
    private String trade_place;
    private List<AddProductRequest> product;

    public Live toEntity(User user) {
        System.out.println("here@!! "+ live_date);
        return Live.builder()
                .title(title)
                .live_date(live_date)
                .thumbnail(thumbnail)
                .trade_place(trade_place)
                .seller(user)
                .build();
    }
}