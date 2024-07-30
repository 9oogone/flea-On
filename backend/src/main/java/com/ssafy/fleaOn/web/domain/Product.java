package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Table(name = "product")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private int productId;

    @Column(name = "live_id")
    private int liveId;

    @Column(name = "seller_id")
    private int sellerId;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private int price;

    @Column(name = "first_category")
    private int firstCategory;

    @Column(name = "second_category")
    private int secondCategory;

    @Column(name = "cur_buyer_front")
    private int curBuyerFront;

    @Column(name = "cur_buyer_rear")
    private int curBuyerRear;

    @ManyToOne
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;


}
