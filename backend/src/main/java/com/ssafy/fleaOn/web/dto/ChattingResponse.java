package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Chatting;
import com.ssafy.fleaOn.web.domain.ChattingList;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ChattingResponse {
    private final int chattingId;
    private final String userNickName;
    private final String profile;
    private final String recentMessage;
    private final LocalDateTime recentMessageTime;
    private final boolean view;
    private final int liveId;
    private final int isLive;
    private final boolean isBuyer;

    public ChattingResponse(Chatting chatting, String nickname, String profilePicture, ChattingList chattingList, boolean view, int liveId, int isLive, boolean isBuyer) {
        this.chattingId = chatting.getChattingId();
        this.userNickName = nickname;
        this.profile = profilePicture;
        this.liveId = liveId;
        this.isLive = isLive;
        this.isBuyer = isBuyer;
        if (chattingList != null) {
            this.recentMessage = chattingList.getChatContent();
            this.recentMessageTime = chattingList.getChatTime();
        } else {
            this.recentMessage = "";
            this.recentMessageTime = chatting.getCreateTime();
        }
        this.view = view;
    }
}
