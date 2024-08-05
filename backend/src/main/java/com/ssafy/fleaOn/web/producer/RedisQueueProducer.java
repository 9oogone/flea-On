package com.ssafy.fleaOn.web.producer;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.dto.TradeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisQueueProducer {

    // Redis 큐 이름 상수 정의
    private static final String PURCHASE_QUEUE = "purchaseQueue";
    private static final String CANCEL_PURCHASE_QUEUE = "cancelPurchaseQueue";
    private static final String RESERVATION_QUEUE = "reservationQueue";
    private static final String CANCEL_RESERVATION_QUEUE = "cancelReservationQueue";
    private static final String CONFIRM_QUEUE = "confirmQueue";

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // 구매 요청을 큐에 추가하는 메서드
    public void sendPurchaseRequest(PurchaseRequest request) {
        redisTemplate.opsForList().rightPush(PURCHASE_QUEUE, request);
    }

    // 구매 취소 요청을 큐에 추가하는 메서드
    public void sendCancelPurchaseRequest(PurchaseRequest request) {
        redisTemplate.opsForList().rightPush(CANCEL_PURCHASE_QUEUE, request);
    }

    // 예약 요청을 큐에 추가하는 메서드
    public void sendReservationRequest(PurchaseRequest request) {
        redisTemplate.opsForList().rightPush(RESERVATION_QUEUE, request);
    }

    // 예약 취소 요청을 큐에 추가하는 메서드
    public void sendCancelReservationRequest(PurchaseRequest request) {
        redisTemplate.opsForList().rightPush(CANCEL_RESERVATION_QUEUE, request);
    }

    // 구매 확정 요청을 큐에 추가하는 메서드
    public void sendConfirmRequest(TradeRequest request) {
        redisTemplate.opsForList().rightPush(CONFIRM_QUEUE, request);
    }
}
