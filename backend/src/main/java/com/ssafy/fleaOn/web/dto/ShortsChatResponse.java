package com.ssafy.fleaOn.web.dto;

import lombok.Getter;
import java.time.LocalTime;

@Getter
    public class ShortsChatResponse {
        private final String profilePic;
        private final String nickName;
        private final String content;
        private final String time;

        public ShortsChatResponse(String profilePic, String nickName, String content, String time) {
            this.profilePic = profilePic;
            this.nickName = nickName;
            this.content = content;
            this.time = time;
        }
    }