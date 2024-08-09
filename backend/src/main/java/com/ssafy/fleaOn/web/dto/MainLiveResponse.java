package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MainLiveResponse {
    private int liveId;
    private String liveTitle;
    private List<String> productNames;
    private List<Integer> productPrices;
    private String tradePlace;
    private int isLive;

    public static MainLiveResponse fromEntity(Live live, List<Product> products) {
        return MainLiveResponse.builder()
                .liveId(live.getLiveId())
                .liveTitle(live.getTitle())
                .productNames(products.stream().map(Product::getName).collect(Collectors.toList()))
                .productPrices(products.stream().map(Product::getPrice).collect(Collectors.toList()))
                .tradePlace(live.getTradePlace())
                .isLive(live.getIsLive())
                .build();
    }
}
