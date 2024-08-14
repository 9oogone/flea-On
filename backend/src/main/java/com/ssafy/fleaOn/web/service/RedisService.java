package com.ssafy.fleaOn.web.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.fleaOn.web.dto.PurchaseCancleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    //직접 만든 redisTemplate 사용
    public void setRedisValue(PurchaseCancleResponse chatMessage) throws JsonProcessingException {
        String key = "cancelPurchaseResult:" + chatMessage.getProductId();
        String value = objectMapper.writeValueAsString(chatMessage);
        redisTemplate.opsForValue().set(key, value);
    }

    public <T> T getRedisValue(String key, Class<T> classType) throws JsonProcessingException {
        String redisValue = (String) redisTemplate.opsForValue().get(key);

        if (redisValue == null) {
            return null;
        }

        return objectMapper.readValue(redisValue, classType);
    }

}