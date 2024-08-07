package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "chatting")
public class Chatting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatting_id")
    private int chattingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_id")
    private Live live;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private User buyer;

    @Column(name = "view")
    private Boolean view;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Builder
    public Chatting(Live live, User seller, User buyer, Boolean view, LocalDateTime createTime) {
        this.live = live;
        this.seller = seller;
        this.buyer = buyer;
        this.view = view;
        this.createTime = createTime;
    }

    public void show(){
        this.view = true;
    }
}
