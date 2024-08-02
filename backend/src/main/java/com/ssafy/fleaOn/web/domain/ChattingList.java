package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "chatting_list")
public class ChattingList {

    @Column(name = "writer_id")
    private int writerId;

    @Column(name = "chat_content")
    private String chatContent;

    @Column(name = "chat_time")
    private java.sql.Timestamp chatTime;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatting_id", insertable = false, updatable = false)
    private Chatting chatting;

    @Builder
    public ChattingList(Chatting chatting, int writerId, String chatContent, java.sql.Timestamp chatTime) {
        this.chatting = chatting;
        this.writerId = writerId;
        this.chatContent = chatContent;
        this.chatTime = chatTime;
    }
}
