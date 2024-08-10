package com.ssafy.fleaOn.web.consumer;

import com.ssafy.fleaOn.web.dto.PurchaseCancleResponse;
import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.dto.TradeRequest;
import com.ssafy.fleaOn.web.service.PurchaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

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
            int result = purchaseService.processPurchaseRequest(request);
            redisTemplate.opsForValue().set("purchaseResult:" + request.getUserId() + ":" + request.getProductId(), result);
        }
    }

    @Scheduled(fixedDelay = 1000)
    public void handleCancelPurchaseRequest() {
        PurchaseRequest request = (PurchaseRequest) redisTemplate.opsForList().leftPop("cancelPurchaseQueue");
        if (request != null) {
            PurchaseCancleResponse result = purchaseService.cancelPurchaseProduct(request);
            redisTemplate.opsForValue().set("cancelPurchaseResult:" + request.getUserId() + ":" + request.getProductId(), result);
        }
    }

    @Scheduled(fixedDelay = 1000)
    public void handleReservationRequest() {
        PurchaseRequest request = (PurchaseRequest) redisTemplate.opsForList().leftPop("reservationQueue");
        if (request != null) {
            int result = purchaseService.processReservationRequest(request);
            redisTemplate.opsForValue().set("reservationResult:" + request.getUserId() + ":" + request.getProductId(), result);
        }
    }

    @Scheduled(fixedDelay = 1000)
    public void handleCancelReservationRequest() {
        PurchaseRequest request = (PurchaseRequest) redisTemplate.opsForList().leftPop("cancelReservationQueue");
        if (request != null) {
            int result = purchaseService.processCancelReservationRequest(request);
            redisTemplate.opsForValue().set("cancelReservationResult:" + request.getUserId() + ":" + request.getProductId(), result);
        }
    }

    @Scheduled(fixedDelay = 1000)
    public void handleConfirmPurchaseRequest() {
        TradeRequest request = (TradeRequest) redisTemplate.opsForList().leftPop("confirmPurchaseQueue");
        if (request != null) {
            purchaseService.processConfirmPurchaseRequest(request);
            redisTemplate.opsForValue().set("confirmResult:" + request.getBuyerId() + ":" + request.getProductId(), "confirmed");
        }
    }

    @Scheduled(fixedDelay = 1000)
    public void handleConfirmTradeRequest() {  // 메서드명 수정
        TradeRequest request = (TradeRequest) redisTemplate.opsForList().leftPop("confirmTradeQueue");
        if (request != null) {
            purchaseService.processConfirmTradeRequest(request);
            redisTemplate.opsForValue().set("confirmResult:" + request.getBuyerId() + ":" + request.getProductId(), "confirmed");
        }
    }

    @Scheduled(fixedDelay = 1000)
    public void handleBreakTradeRequest() {
        int[] chatAndUserId = (int[]) redisTemplate.opsForList().leftPop("breakTradeQueue");
        if (chatAndUserId != null && chatAndUserId.length == 2) {
            int chatId = chatAndUserId[0];
            int userId = chatAndUserId[1];
            logger.info("Received BreakTradeRequest for chatId: {} and userId: {}", chatId, userId);

            List<PurchaseCancleResponse> result = purchaseService.breakTrade(chatId, userId);
            logger.info("Processed BreakTradeRequest with result: {}", result);

            redisTemplate.opsForValue().set("breakTradeResult:" + chatId + ":" + userId, result);  // key 수정
        } else {
            logger.info("No BreakTradeRequest found in queue");
        }
    }
}