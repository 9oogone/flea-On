package com.ssafy.fleaOn.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChattingMessageRequest {
    private int chattingId;
    private String contents;
    @JsonProperty("bot")
    private boolean isBot;
}
