package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.dto.TradeRequest;
import com.ssafy.fleaOn.web.producer.RedisQueueProducer;
import com.ssafy.fleaOn.web.service.PurchaseService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "구매(줄서기) 버튼 클릭", description = "구매의사를 가지고 버튼을 클릭합니다.")
    public ResponseEntity<Integer> buy(@RequestBody PurchaseRequest request) {
        int order = purchaseService.processPurchaseRequest(request);
        return ResponseEntity.ok(order); // 구매 순번 반환
    }

    @DeleteMapping("/cancel")
    @Operation(summary = "구매 취소 기능", description = "구매 취소를 합니다.")
    public ResponseEntity<Integer> cancel(@RequestBody PurchaseRequest request) {
        int buyerId = purchaseService.processCancelPurchaseRequest(request);
        return ResponseEntity.ok(buyerId); // 취소 후 현재 구매자 반환
    }

    @PutMapping("/reserve")
    @Operation(summary = "예약하기", description = "예약버튼이 활성화되어있을 시 예약합니다.")
    public ResponseEntity<Integer> reserve(@RequestBody PurchaseRequest request) {
        int order = purchaseService.processReservationRequest(request);
        return ResponseEntity.ok(order); // 구매 순번 반환
    }

    @DeleteMapping("/reserve/")
    @Operation(summary = "예약 취소하기", description = "예약을 취소합니다.")
    public ResponseEntity<Integer> cancelReservation(@RequestBody PurchaseRequest request) {
        int count = purchaseService.processCancelReservationRequest(request);
        return ResponseEntity.ok(count); // 현재 예약자 수 응답
    }

    @PostMapping("/confirm")
    @Operation(summary = "구매 확정하기", description = "구매 예정자가 구매 시간 설정 후 구매를 확정합니다.")
    public ResponseEntity<Void> confirm(@RequestBody TradeRequest request) {
        purchaseService.processConfirmPurchaseRequest(request);
        return ResponseEntity.ok().build(); // 구매 확정 완료 응답
    }
}
