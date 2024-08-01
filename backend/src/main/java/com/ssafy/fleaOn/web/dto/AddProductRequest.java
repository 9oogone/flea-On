package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddProductRequest {
    private String name;
    private int price;
    private int first_category;
    private int second_category;

    public Product toEntity(Live live, int sellerId) {
        return Product.builder()
                .live_id(live.getLiveId())
                .seller_id(sellerId)
                .name(name)
                .price(price)
                .first_category(first_category)
                .second_category(second_category)
                .build();
    }
}
