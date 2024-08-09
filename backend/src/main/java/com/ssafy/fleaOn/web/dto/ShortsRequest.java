package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.domain.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShortsRequest {

    private String thumbnail;
    private String length;
    private String videoAddress;
    private int productId;

    public Shorts toEntity(Product product, User seller){
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalTime parsedShortsLength = LocalTime.parse(length, timeFormatter);

        return Shorts.builder()
                .shortsThumbnail(thumbnail)
                .length(parsedShortsLength)
                .videoAddress(videoAddress)
                .product(product)
                .seller(seller)
                .build();
    }
}
