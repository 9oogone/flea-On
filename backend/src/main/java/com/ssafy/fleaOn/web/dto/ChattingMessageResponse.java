package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Chatting;
import com.ssafy.fleaOn.web.domain.ChattingList;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;

import java.sql.Timestamp;
import java.util.List;
@Getter
public class ChattingMessageResponse {
    private final User user;
    private final List<MessageResponse> messageResponses;

    public ChattingMessageResponse(User user, List<MessageResponse> messageResponses) {
        this.user = user;
        this.messageResponses = messageResponses;
    }
}
