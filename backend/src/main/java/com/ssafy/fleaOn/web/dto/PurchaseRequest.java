package com.ssafy.fleaOn.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRequest implements Serializable {
    private int productId;
    private int userId;
}
