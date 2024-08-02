package com.ssafy.fleaOn.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class MainShortsResponse {

    @JsonProperty("shorts_id")
    private int shortsId;

    @JsonProperty("upload_date")
    private LocalDateTime uploadDate;

    @JsonProperty("name")
    private String productName;

    @JsonProperty("price")
    private int productPrice;

    @JsonProperty("trade_place")
    private String tradePlace;

    @JsonProperty("thumbnail")
    private String thumbnail;
}
