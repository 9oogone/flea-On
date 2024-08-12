package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
@Getter
@Builder
@NoArgsConstructor
public class ScheduleResponse {
    private List<DayTradeResponse> dayTradeResponses;
    private List<TradeDoneSchedule> tradeDoneSchedules;

    public ScheduleResponse(List<DayTradeResponse> dayTradeResponses, List<TradeDoneSchedule> tradeDoneSchedules) {
        this.dayTradeResponses = dayTradeResponses;
        this.tradeDoneSchedules = tradeDoneSchedules;
    }
}
