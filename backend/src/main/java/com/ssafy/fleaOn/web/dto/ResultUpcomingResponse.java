package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultUpcomingResponse {

    private int liveId;
    private String productName;
    private int productPrice;
    private LocalDateTime liveDate;
    private String title;


    public static ResultUpcomingResponse fromEntity(Live live, Product product) {
        return ResultUpcomingResponse.builder()
                .liveId(live.getLiveId())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .liveDate(live.getLiveDate())
                .title(live.getTitle())
                .build();
    }
}
