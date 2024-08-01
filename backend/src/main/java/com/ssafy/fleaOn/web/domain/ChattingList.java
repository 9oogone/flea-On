package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "chatting_list")
public class ChattingList {

    @Id
    @Column(name = "chatting_id")
    private int chattingId;

    @Column(name = "writer_id")
    private int writerId;

    @Column(name = "chat_content")
    private String chatContent;

    @Column(name = "chat_time")
    private java.sql.Timestamp chatTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatting_id", insertable = false, updatable = false)
    private Chatting chatting;

    @Builder
    public ChattingList(int chattingId, int writerId, String chatContent, java.sql.Timestamp chatTime) {
        this.chattingId = chattingId;
        this.writerId = writerId;
        this.chatContent = chatContent;
        this.chatTime = chatTime;
    }
}
