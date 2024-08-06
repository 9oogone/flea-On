package com.ssafy.fleaOn.web.dto;

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

    public ChattingResponse(int chattingId, String nickname, String profilePicture, ChattingList chattingList, boolean view) {
        this.chattingId = chattingId;
        this.userNickName = nickname;
        this.profile = profilePicture;
        if (chattingList != null) {
            this.recentMessage = chattingList.getChatContent();
            this.recentMessageTime = chattingList.getChatTime();
        } else {
            this.recentMessage = "";
            this.recentMessageTime = null;
        }
        this.view = view;
    }
}
