package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UpdateLiveRequest {
    private String title;
    private String live_date; // LocalDateTime 대신 String 사용
    private String thumbnail;
    private String trade_place;
    private List<UpdateProductRequest> product;
}
