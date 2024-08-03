package com.ssafy.fleaOn.web.consumer;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RedisQueueConsumer {

    private static final String QUEUE_NAME = "purchaseQueue";

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private PurchaseService purchaseService;

    // 주기적으로 큐에서 메시지를 가져와서 처리하는 메서드
    @Scheduled(fixedDelay = 1000)
    public void handlePurchaseRequest() {
        PurchaseRequest request = (PurchaseRequest) redisTemplate.opsForList().leftPop(QUEUE_NAME);
        if (request != null) {
            purchaseService.processPurchaseRequest(request);
        }
    }
}
