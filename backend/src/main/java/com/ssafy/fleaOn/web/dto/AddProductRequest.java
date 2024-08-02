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
    private int firstCategory;
    private int secondCategory;

    public Product toEntity(Live live, int sellerId) {
        return Product.builder()
                .liveId(live.getLiveId())
                .sellerId(sellerId)
                .name(name)
                .price(price)
                .firstCategory(firstCategory)
                .secondCategory(secondCategory)
                .build();
    }
}
