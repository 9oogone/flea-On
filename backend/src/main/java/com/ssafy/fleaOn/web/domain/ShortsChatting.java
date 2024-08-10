package com.ssafy.fleaOn.web.domain;


import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.ssafy.fleaOn.web.util.LocalDateTimeDeserializer;
import com.ssafy.fleaOn.web.util.LocalDateTimeSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Table(name = "shorts_chatting")
public class ShortsChatting {

    @Id
    @Column(name = "live_chat_id")
    private int liveChatId;

    @Column(name = "content")
    private String content;

    @Column(name = "time")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalTime time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shorts_id", insertable = false, updatable = false)
    private Shorts shorts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Builder
    public ShortsChatting(String content, LocalTime time, Shorts shorts, User user) {
        this.content = content;
        this.time = time;
        this.shorts = shorts;
        this.user = user;
    }
}
