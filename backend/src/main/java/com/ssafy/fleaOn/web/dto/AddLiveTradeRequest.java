package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.LiveTradeTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddLiveTradeRequest {
    private String tradeStart;
    private String tradeEnd;
    private String date;

    public LiveTradeTime toEntity(Live live){
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalTime parsedStart = LocalTime.parse(tradeStart, timeFormatter);
        LocalTime parsedEnd = LocalTime.parse(tradeEnd, timeFormatter);
        LocalDate parsedDate = LocalDate.parse(date);

        return LiveTradeTime.builder()
                .live(live)
                .tradeStart(parsedStart)
                .tradeEnd(parsedEnd)
                .date(parsedDate)
                .build();
    }
}
