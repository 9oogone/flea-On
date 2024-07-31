package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "reservation")
public class Reservation {

    @Id
    @Column(name = "product_id")
    private int productId;

    @Column(name = "1")
    private Integer slot1;

    @Column(name = "2")
    private Integer slot2;

    @Column(name = "3")
    private Integer slot3;

    @Column(name = "4")
    private Integer slot4;

    @Column(name = "5")
    private Integer slot5;

    @Column(name = "6")
    private Integer slot6;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @Builder
    public Reservation(int productId, Integer slot1, Integer slot2, Integer slot3, Integer slot4, Integer slot5, Integer slot6) {
        this.productId = productId;
        this.slot1 = slot1;
        this.slot2 = slot2;
        this.slot3 = slot3;
        this.slot4 = slot4;
        this.slot5 = slot5;
        this.slot6 = slot6;
    }
}
