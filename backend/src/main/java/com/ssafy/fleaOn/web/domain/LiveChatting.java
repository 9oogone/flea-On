package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "live_chatting")
public class LiveChatting {

    @Id
    @Column(name = "live_chat_id")
    private int liveChatId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "content")
    private String content;

    @Column(name = "time")
    private java.sql.Timestamp time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Builder
    public LiveChatting(int liveChatId, int userId, String content, java.sql.Timestamp time) {
        this.liveChatId = liveChatId;
        this.userId = userId;
        this.content = content;
        this.time = time;
    }
}
