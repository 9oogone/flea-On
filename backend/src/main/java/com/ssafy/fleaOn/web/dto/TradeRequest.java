package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Chatting;
import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TradeRequest {

    private int sellerId;
    private LocalDate tradeDate;
    private Time tradeTime;
    private String tradePlace;
    private int chattingId;
    private int buyerId;
    private Live live;
    private Shorts shorts;
    private Product product;

//    private Chatting chatting;


}
