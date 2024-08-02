package com.ssafy.fleaOn.web.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id", nullable = false)
    private int categoryId;

    @Column(name = "first_category_id")
    private int firstCategoryId;

    @Column(name = "first_category_name")
    private String firstCategoryName;

    @Column(name = "second_category_id")
    private int secondCategoryId;

    @Column(name = "second_category_name")
    private String secondCategoryName;

}
