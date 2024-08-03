package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity // 엔티티로 지정
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "product")
public class Product {
    @Id // id 필드를 기본키로 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키를 자동으로 1씩 증가
    @Column(name = "product_id", updatable = false)
    private int productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="price", nullable = false)
    private int price;

    @Column(name="first_category", nullable = false)
    private int firstCategoryId;

    @Column(name="second_category", nullable = false)
    private int secondCategoryId;

    @Column(name = "current_buyer_id", nullable = false)
    private int currentBuyerId;

    @Column(name = "reservation_count", nullable = false)
    private int reservationCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_id", nullable = false)
    private Live live;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Shorts shorts;

    @Builder
    public Product(Live live, User user, String name, int price, int firstCategoryId, int secondCategoryId) {
        this.live = live;
        this.seller = user;
        this.name = name;
        this.price = price;
        this.firstCategoryId = firstCategoryId;
        this.secondCategoryId = secondCategoryId;
        this.currentBuyerId = 0;
        this.reservationCount = 0;
    }

    public void update(String name, int price, int firstCategoryId, int secondCategoryId) {
        this.name = name;
        this.price = price;
        this.firstCategoryId = firstCategoryId;
        this.secondCategoryId = secondCategoryId;
    }
}
