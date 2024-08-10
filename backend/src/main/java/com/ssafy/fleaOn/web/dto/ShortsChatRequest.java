package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.domain.ShortsChatting;
import com.ssafy.fleaOn.web.domain.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShortsChatRequest {

    private String content;
    private String time;
    private int shortsId;
    private int userId;

    public ShortsChatting toEntity(Shorts shorts, User writer){
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalTime parsedShortsLength = LocalTime.parse(time, timeFormatter);

        return ShortsChatting.builder()
                .content(this.content)
                .time(parsedShortsLength)
                .shorts(shorts)
                .user(writer)
                .build();
    }
}
