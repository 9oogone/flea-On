package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.producer.RedisQueueProducer;
import com.ssafy.fleaOn.web.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fleaon/purchase")
public class PurchaseController {

    private final RedisQueueProducer redisQueueProducer;
    private final PurchaseService purchaseService;

    @Autowired
    public PurchaseController(RedisQueueProducer redisQueueProducer, PurchaseService purchaseService) {
        this.redisQueueProducer = redisQueueProducer;
        this.purchaseService = purchaseService;
    }

    @PostMapping("/buy")
    public ResponseEntity<Integer> buy(@RequestBody PurchaseRequest request) {
        int order = purchaseService.processPurchaseRequest(request);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/cancel")
    public ResponseEntity<Integer> cancel(@RequestBody PurchaseRequest request) {
        int buyerId = purchaseService.processCancelPurchaseRequest(request);
        return ResponseEntity.ok(buyerId);
    }

    @PostMapping("/reserve")
    public ResponseEntity<Void> reserve(@RequestBody PurchaseRequest request) {
        purchaseService.processReservationRequest(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cancel-reservation")
    public ResponseEntity<Void> cancelReservation(@RequestBody PurchaseRequest request) {
        purchaseService.processCancelReservationRequest(request);
        return ResponseEntity.ok().build();
    }

//    @PostMapping("/confirm")
//    public ResponseEntity<Void> confirm(@RequestBody PurchaseRequest request) {
//        purchaseService.processConfirmPurchaseRequest(request);
//        return ResponseEntity.ok().build();
//    }
}
