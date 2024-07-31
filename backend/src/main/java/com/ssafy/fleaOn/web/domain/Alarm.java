package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "alarm")
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_id")
    private int alarmId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "content")
    private String content;

    @Column(name = "date")
    private java.sql.Timestamp date;

    @Column(name = "profile_pic")
    private String profilePic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Builder
    public Alarm(int userId, String content, java.sql.Timestamp date, String profilePic) {
        this.userId = userId;
        this.content = content;
        this.date = date;
        this.profilePic = profilePic;
    }
}
