
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
    private int product_id;

    @Column(name="live_id", nullable = false)
    private int live_id;

    @Column(name="seller_id", nullable = false)
    private int seller_id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="price", nullable = false)
    private int price;

    @Column(name="first_category", nullable = false)
    private int first_category;

    @Column(name="second_category", nullable = false)
    private int second_category;

    @Column(name="cur_buyer_front", nullable = false)
    private int cur_buyer_front;

    @Column(name="cur_buyer_rear", nullable = false)
    private int cur_buyer_rear;

    @Builder
    public Product(int live_id, int seller_id, String name, int price, int first_category, int second_category) {
        this.live_id = live_id;
        this.seller_id = seller_id;
        this.name = name;
        this.price = price;
        this.first_category = first_category;
        this.second_category = second_category;
        this.cur_buyer_front = 0;
        this.cur_buyer_rear = 0;
    }
}