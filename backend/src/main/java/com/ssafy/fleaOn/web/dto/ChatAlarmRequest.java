package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatAlarmRequest {
    int recipient;
    int chatId;
    String content;
    int type;
    int productId;
    int liveId;
}
