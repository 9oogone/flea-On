package com.ssafy.fleaOn.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.RegionInfo;
import com.ssafy.fleaOn.web.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddLiveRequest {
    private String title;
    private String liveDate;
    private String liveThumbnail;
    private String tradePlace;
    private String regionCode;
    private List<AddProductRequest> product;
    private List<AddLiveTradeRequest> liveTradeTime;

    public Live toEntity(User user, RegionInfo regionInfo) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime parsedDate = LocalDateTime.parse(liveDate, formatter);
        return Live.builder()
                .title(title)
                .liveDate(parsedDate)
                .liveThumbnail(liveThumbnail)
                .tradePlace(tradePlace)
                .seller(user)
                .regionInfo(regionInfo)
                .build();
    }
}
