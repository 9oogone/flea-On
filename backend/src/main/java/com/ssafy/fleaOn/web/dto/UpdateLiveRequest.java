package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UpdateLiveRequest {
    private String title;
    private String liveDate; // LocalDateTime 대신 String 사용
    private String liveThumbnail;
    private String tradePlace;
    private String regionCode;
    private List<UpdateProductRequest> product;
    private List<UpdateLiveTradeRequest> liveTradeTime;
}
