package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "alarm")
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_id")
    private int alarmId;

    @Column(name = "content")
    private String content;

    @Column(name = "date")
    private Timestamp date;

    @Column(name = "profile_pic")
    private String profilePic;

    @Column(name = "is_read")
    private boolean isRead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Builder
    public Alarm(String content, String profilePic, User user) {
        this.content = content;
        this.date = Timestamp.valueOf(LocalDateTime.now());
        this.profilePic = profilePic;
        this.isRead = false;
        this.user = user;
    }
}
