package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UpdateLiveRequest {
    private String title;
    private String live_date;
    private String thumbnail;
    private String trade_place;
    private String userEmail;
}
