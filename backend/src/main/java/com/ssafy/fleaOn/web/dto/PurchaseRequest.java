package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class PurchaseRequest implements Serializable {
    private int productId;
    private int userId;
}
