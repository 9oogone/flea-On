package com.ssafy.fleaOn.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.RegionInfo;
import com.ssafy.fleaOn.web.domain.Shorts;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
@AllArgsConstructor
public class MainShortsResponse {

    @JsonProperty("shortsId")
    private int shortsId;

    @JsonProperty("uploadDate")
    private LocalDateTime uploadDate;

    @JsonProperty("productName")
    private String productName;

    @JsonProperty("productPrice")
    private int productPrice;

    @JsonProperty("tradePlace")
    private String tradePlace;

    @JsonProperty("shortsThumbnail")
    private String thumbnail;

    @JsonProperty("length")
    private LocalTime length;

    @JsonProperty("isScrap")
    private boolean isScrap;

    @JsonProperty("dongName")
    private String dongName;

    public static MainShortsResponse fromEntity(Shorts shorts, Product product, Live live, boolean isScrap) {
        return MainShortsResponse.builder()
                .shortsId(shorts.getShortsId())
                .uploadDate(shorts.getUploadDate())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .tradePlace(live.getTradePlace())
                .thumbnail(shorts.getShortsThumbnail())
                .length(shorts.getLength())
                .isScrap(isScrap)
                .dongName(live.getRegionInfo().getEupmyeon())
                .build();
    }
}
