package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity // 엔티티로 지정
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "product")
public class Product {
    @Id // id 필드를 기본키로 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키를 자동으로 1씩 증가
    @Column(name = "product_id", updatable = false)
    private int productId;

    @ManyToOne
    @JoinColumn(name = "live_id")
    private Live live;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="price", nullable = false)
    private int price;

    @Column(name="first_category", nullable = false)
    private int firstCategory;

    @Column(name="second_category", nullable = false)
    private int secondCategory;

    @Column(name="cur_buyer_front", nullable = false)
    private int curBuyerFront;

    @Column(name="cur_buyer_rear", nullable = false)
    private int curBuyerRear;


    @Builder
    public Product(Live live, User user, String name, int price, int first_category, int second_category) {
        this.live = live;
        this.seller = user;
        this.name = name;
        this.price = price;
        this.firstCategory = firstCategory;
        this.secondCategory = secondCategory;
        this.curBuyerFront = 0;
        this.curBuyerRear = 0;
    }

    public void update(String name, int price, int firstCategory, int secondCategory) {
        this.name = name;
        this.price = price;
        this.first_category = firstCategory;
        this.second_category = secondCategory;
    }
}