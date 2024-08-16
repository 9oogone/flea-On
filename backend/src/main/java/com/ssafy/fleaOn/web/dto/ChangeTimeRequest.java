package com.ssafy.fleaOn.web.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class ChangeTimeRequest {

    private int chatId;
    private LocalDate tradeDate;
    private String tradeTime;

}
