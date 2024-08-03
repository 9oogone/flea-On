package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private int reservationId;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "reservation_time")
    private LocalDateTime reservationTime;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @Builder
    public Reservation(User user, Product product) {
        this.user = user;
        this.product = product;
    }
}
