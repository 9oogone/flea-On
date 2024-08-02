package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "chatting")
public class Chatting {

    @Id
    @Column(name = "chatting_id")
    private int chattingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_id", insertable = false, updatable = false)
    private Live live;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", insertable = false, updatable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", insertable = false, updatable = false)
    private User buyer;

    @Builder
    public Chatting(int chattingId, Live live, User seller, User buyer) {
        this.chattingId = chattingId;
        this.live = live;
        this.seller = seller;
        this.buyer = buyer;
    }
}
