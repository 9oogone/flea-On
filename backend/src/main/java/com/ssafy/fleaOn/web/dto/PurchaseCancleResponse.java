package com.ssafy.fleaOn.web.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true) // 알 수 없는 필드를 무시
public class PurchaseCancleResponse {
    private int productId;
    private boolean chatExit;
    private int next;
    private boolean isBuyer;
}
