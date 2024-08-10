package com.ssafy.fleaOn.web.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScrapShortsResponse {

    private LocalTime length;
    private int productId;
    private int shortsId;
    private LocalDateTime uploadDate;
    private String shortsThumbnail;
    private String videoAddress;
    private int productPrice;
    private String productName;
    private String tradePlace;


}
