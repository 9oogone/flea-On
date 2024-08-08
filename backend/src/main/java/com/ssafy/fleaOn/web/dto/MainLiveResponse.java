package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MainLiveResponse {
    private int liveId;
    private String liveTitle;
    private String productName;
    private int productPrice;
    private String tradePlace;
    private int isLive;
    private List<Product> product;
}
