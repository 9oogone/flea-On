package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "chatting_list")
public class ChattingList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatting_list_id")
    private int chattingListId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatting_id")
    private Chatting chatting;

    @Column(name = "writer_id")
    private int writerId;

    @Column(name = "chat_content", columnDefinition = "LONGTEXT")
    private String chatContent;

    @Column(name = "chat_time")
    private LocalDateTime chatTime;

    @Column(name = "is_bot")
    private boolean isBot;

    @Builder
    public ChattingList(Chatting chatting, int writerId, String chatContent, LocalDateTime chatTime, boolean isBot) {
        this.chatting = chatting;
        this.writerId = writerId;
        this.chatContent = chatContent;
        this.chatTime = chatTime;
        this.isBot = isBot;
    }
}
