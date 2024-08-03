package com.ssafy.fleaOn.web.producer;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisQueueProducer {

    private static final String QUEUE_NAME = "purchaseQueue";

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // 구매 요청을 큐에 전송하는 메서드
    public void sendPurchaseRequest(PurchaseRequest request) {
        redisTemplate.opsForList().rightPush(QUEUE_NAME, request);
    }
}
