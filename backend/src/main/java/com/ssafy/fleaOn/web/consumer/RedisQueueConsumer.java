package com.ssafy.fleaOn.web.consumer;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.dto.TradeRequest;
import com.ssafy.fleaOn.web.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RedisQueueConsumer {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private PurchaseService purchaseService;

    // 주기적으로 구매 요청을 처리하는 메서드
    @Scheduled(fixedDelay = 1000)
    public void handlePurchaseRequest() {
        // 큐에서 메시지를 꺼내 처리
        PurchaseRequest request = (PurchaseRequest) redisTemplate.opsForList().leftPop("purchaseQueue");
        if (request != null) {
            int result = purchaseService.processPurchaseRequest(request);
            redisTemplate.opsForValue().set("purchaseResult:" + request.getUserId() + ":" + request.getProductId(), result);
        }
    }

    // 주기적으로 구매 취소 요청을 처리하는 메서드
    @Scheduled(fixedDelay = 1000)
    public void handleCancelPurchaseRequest() {
        PurchaseRequest request = (PurchaseRequest) redisTemplate.opsForList().leftPop("cancelPurchaseQueue");
        if (request != null) {
            int result = purchaseService.processCancelPurchaseRequest(request);
            redisTemplate.opsForValue().set("cancelPurchaseResult:" + request.getUserId() + ":" + request.getProductId(), result);
        }
    }

    // 주기적으로 예약 요청을 처리하는 메서드
    @Scheduled(fixedDelay = 1000)
    public void handleReservationRequest() {
        PurchaseRequest request = (PurchaseRequest) redisTemplate.opsForList().leftPop("reservationQueue");
        if (request != null) {
            int result = purchaseService.processReservationRequest(request);
            redisTemplate.opsForValue().set("reservationResult:" + request.getUserId() + ":" + request.getProductId(), result);
        }
    }

    // 주기적으로 예약 취소 요청을 처리하는 메서드
    @Scheduled(fixedDelay = 1000)
    public void handleCancelReservationRequest() {
        PurchaseRequest request = (PurchaseRequest) redisTemplate.opsForList().leftPop("cancelReservationQueue");
        if (request != null) {
            int result = purchaseService.processCancelReservationRequest(request);
            redisTemplate.opsForValue().set("cancelReservationResult:" + request.getUserId() + ":" + request.getProductId(), result);
        }
    }

    // 주기적으로 구매 확정 요청을 처리하는 메서드
    @Scheduled(fixedDelay = 1000)
    public void handleConfirmRequest() {
        TradeRequest request = (TradeRequest) redisTemplate.opsForList().leftPop("confirmQueue");
        if (request != null) {
            purchaseService.processConfirmPurchaseRequest(request);
            redisTemplate.opsForValue().set("confirmResult:" + request.getBuyerId() + ":" + request.getProductId(), "confirmed");
        }
    }
}
