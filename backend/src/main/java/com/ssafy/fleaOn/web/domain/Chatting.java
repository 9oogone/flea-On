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

    @Column(name = "live_id")
    private int liveId;

    @Column(name = "seller_id")
    private int sellerId;

    @Column(name = "buyer_id")
    private int buyerId;

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
    public Chatting(int chattingId, int liveId, int sellerId, int buyerId) {
        this.chattingId = chattingId;
        this.liveId = liveId;
        this.sellerId = sellerId;
        this.buyerId = buyerId;
    }
}
