package com.ssafy.fleaOn.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UpdateProductRequest {
    private int productId;
    private String name;
    private int price;

    @JsonProperty("first_category")
    private int firstCategory;

    @JsonProperty("second_category")
    private int secondCategory;

    public Product toEntity(Live live, User user) {
        return Product.builder()
                .name(name)
                .price(price)
                .firstCategory(firstCategory)
                .secondCategory(secondCategory)
                .live(live)
                .user(user)
                .build();
    }
}
