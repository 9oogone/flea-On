package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultLiveResponse {

    private int liveId;
    private String productName;
    private int productPrice;
    private String title;
    private String tradePlace;
    private String thumbnail;
    private String dongName;
    private int viewCount;
    private LocalDateTime liveDate;


    public static ResultLiveResponse fromEntity(Live live, Product product) {
        return ResultLiveResponse.builder()
                .liveId(live.getLiveId())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .title(live.getTitle())
                .tradePlace(live.getTradePlace())
                .thumbnail(live.getLiveThumbnail())
                .dongName(live.getRegionInfo().getEupmyeon())
                .viewCount(live.getViewCount())
                .liveDate(live.getLiveDate())
                .build();
    }
}

