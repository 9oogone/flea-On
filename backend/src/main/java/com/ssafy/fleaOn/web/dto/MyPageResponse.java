package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyPageResponse {
    private String nickName;
    private int level;
    private String profilePicture;
    private List<String> regionCode;
    private TradeCountResponse tradeInfo;
    private List<WeeklyTrade> tradeList;

}
