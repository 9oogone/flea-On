package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
public class TradeCountResponse {
    private final int totalTrade;
    private final int saleCount;
    private final int purchaseCount;
    private final int completedTrades;

    public TradeCountResponse(int totalTrade, int saleCount, int purchaseCount, int completedTrades) {
        this.totalTrade = totalTrade;
        this.saleCount = saleCount;
        this.purchaseCount = purchaseCount;
        this.completedTrades = completedTrades;
    }
}
