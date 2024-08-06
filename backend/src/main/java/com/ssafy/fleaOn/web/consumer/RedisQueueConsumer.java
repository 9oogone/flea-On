package com.ssafy.fleaOn.web.consumer;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.dto.TradeRequest;
import com.ssafy.fleaOn.web.service.PurchaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RedisQueueConsumer {

    private static final Logger logger = LoggerFactory.getLogger(RedisQueueConsumer.class);

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private PurchaseService purchaseService;

    @Scheduled(fixedDelay = 1000)
    public void handlePurchaseRequest() {
        PurchaseRequest request = (PurchaseRequest) redisTemplate.opsForList().leftPop("purchaseQueue");
        if (request != null) {
            logger.info("Received PurchaseRequest: {}", request); // 디버깅 로그
            int result = purchaseService.processPurchaseRequest(request);
            logger.info("Processed PurchaseRequest with result: {}", result); // 디버깅 로그
            redisTemplate.opsForValue().set("purchaseResult:" + request.getUserId() + ":" + request.getProductId(), result);
        } else {
            logger.info("No PurchaseRequest found in queue"); // 큐가 비어있는 경우
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
            logger.info("sned it!!");
            redisTemplate.opsForValue().set("confirmResult:" + request.getBuyerId() + ":" + request.getProductId(), "confirmed");
        }
    }
}
