package com.ssafy.fleaOn.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class MainShortsResponse {

    private int shortsId;

    private LocalDateTime uploadDate;

    private String productName;

    private int productPrice;

    private String tradePlace;

    private String thumbnail;

    public static MainShortsResponse fromEntity(Shorts shorts, Product product, Live live) {
        return MainShortsResponse.builder()
                .shortsId(shorts.getShortsId())
                .uploadDate(shorts.getUploadDate())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .tradePlace(live.getTradePlace())
                .thumbnail(shorts.getShortsThumbnail())
                .build();
    }
}
