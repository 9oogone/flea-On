package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    private String liveThumbnail;
    private String dongName;


    public static ResultLiveResponse fromEntity(Live live, Product product) {
        return ResultLiveResponse.builder()
                .liveId(live.getLiveId())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .title(live.getTitle())
                .tradePlace(live.getTradePlace())
                .liveThumbnail(live.getLiveThumbnail())
                .dongName(live.getRegionInfo().getEupmyeon())
                .build();
    }
}

