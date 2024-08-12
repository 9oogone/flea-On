package com.ssafy.fleaOn.web.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class WeeklyTrade {
    private final LocalDate tradeDate;
    private final int totalTrades;
    private final int completedTrades;

    public WeeklyTrade(LocalDate tradeDate, int totalTrades, int completedTrades) {
        this.tradeDate = tradeDate;
        this.totalTrades = totalTrades;
        this.completedTrades = completedTrades;
    }
}
