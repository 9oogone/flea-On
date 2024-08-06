package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Chatting;
import com.ssafy.fleaOn.web.domain.ChattingList;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MessageResponse {
    private final int chattingListId;
    private final int writerId;
    private final String chatContent;
    private final LocalDateTime chatTime;

    public MessageResponse(ChattingList chattingList) {
        this.chattingListId = chattingList.getChattingListId();
        this.writerId = chattingList.getWriterId();
        this.chatContent = chattingList.getChatContent();
        this.chatTime = chattingList.getChatTime();
    }
}
