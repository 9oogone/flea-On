package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.producer.PurchaseRequestProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchase")
public class PurchaseController {

    private final PurchaseRequestProducer purchaseRequestProducer;

    @Autowired
    public PurchaseController(PurchaseRequestProducer purchaseRequestProducer) {
        this.purchaseRequestProducer = purchaseRequestProducer;
    }

    @PostMapping("/buy")
    public void buy(@RequestBody PurchaseRequest request) {
        purchaseRequestProducer.sendPurchaseRequest(request);
    }

    @PostMapping("/cancel")
    public void cancel(@RequestBody PurchaseRequest request) {
        // 구매 취소 요청 처리 로직 추가
    }

    @PostMapping("/reserve")
    public void reserve(@RequestBody PurchaseRequest request) {
        // 예약 요청 처리 로직 추가
    }

    @PostMapping("/cancel-reservation")
    public void cancelReservation(@RequestBody PurchaseRequest request) {
        // 예약 취소 요청 처리 로직 추가
    }

    @PostMapping("/confirm")
    public void confirm(@RequestBody PurchaseRequest request) {
        // 구매 확정 요청 처리 로직 추가
    }
}
