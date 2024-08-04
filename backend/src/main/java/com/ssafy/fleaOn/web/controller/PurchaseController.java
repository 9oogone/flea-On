package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.dto.TradeRequest;
import com.ssafy.fleaOn.web.producer.RedisQueueProducer;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/fleaon/purchase")
public class PurchaseController {

    private static final Logger logger = LoggerFactory.getLogger(PurchaseController.class);

    private final RedisQueueProducer redisQueueProducer;
    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public PurchaseController(RedisQueueProducer redisQueueProducer, RedisTemplate<String, Object> redisTemplate) {
        this.redisQueueProducer = redisQueueProducer;
        this.redisTemplate = redisTemplate;
    }

    @PostMapping("/buy")
    @Operation(summary = "구매(줄서기) 버튼 클릭", description = "구매의사를 가지고 버튼을 클릭합니다.")
    public ResponseEntity<Integer> buy(@RequestBody PurchaseRequest request) {
        try {
            // 구매 요청을 큐에 추가
            redisQueueProducer.sendPurchaseRequest(request);

            // 결과를 일정 시간 동안 폴링하여 조회
            int maxRetries = 10;  // 최대 10번 시도
            int retryInterval = 1000; // 1초 간격으로 시도

            Integer result = null;
            for (int i = 0; i < maxRetries; i++) {
                result = (Integer) redisTemplate.opsForValue().get("purchaseResult:" + request.getUserId() + ":" + request.getProductId());
                if (result != null) {
                    break; // 결과를 성공적으로 가져온 경우
                }
                Thread.sleep(retryInterval); // 대기
            }

            if (result == null) {
                return ResponseEntity.ok(-1); // 아직 결과가 없는 경우
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error processing purchase request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(-1);
        }
    }

    @DeleteMapping("/cancel")
    @Operation(summary = "구매 취소 기능", description = "구매 취소를 합니다.")
    public ResponseEntity<Integer> cancel(@RequestBody PurchaseRequest request) {
        try {
            // 구매 취소 요청을 큐에 추가
            redisQueueProducer.sendCancelPurchaseRequest(request);

            // 결과를 일정 시간 동안 폴링하여 조회
            int maxRetries = 10;  // 최대 10번 시도
            int retryInterval = 1000; // 1초 간격으로 시도

            Integer result = null;
            for (int i = 0; i < maxRetries; i++) {
                result = (Integer) redisTemplate.opsForValue().get("cancelPurchaseResult:" + request.getUserId() + ":" + request.getProductId());
                if (result != null) {
                    break; // 결과를 성공적으로 가져온 경우
                }
                Thread.sleep(retryInterval); // 대기
            }

            if (result == null) {
                return ResponseEntity.ok(-1); // 아직 결과가 없는 경우
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error processing cancel purchase request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(-1);
        }
    }

    @PutMapping("/reserve")
    @Operation(summary = "예약하기", description = "예약버튼이 활성화되어있을 시 예약합니다.")
    public ResponseEntity<Integer> reserve(@RequestBody PurchaseRequest request) {
        try {
            // 예약 요청을 큐에 추가
            redisQueueProducer.sendReservationRequest(request);

            // 결과를 일정 시간 동안 폴링하여 조회
            int maxRetries = 10;  // 최대 10번 시도
            int retryInterval = 1000; // 1초 간격으로 시도

            Integer result = null;
            for (int i = 0; i < maxRetries; i++) {
                result = (Integer) redisTemplate.opsForValue().get("reservationResult:" + request.getUserId() + ":" + request.getProductId());
                if (result != null) {
                    break; // 결과를 성공적으로 가져온 경우
                }
                Thread.sleep(retryInterval); // 대기
            }

            if (result == null) {
                return ResponseEntity.ok(-1); // 아직 결과가 없는 경우
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error processing reservation request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(-1);
        }
    }

    @DeleteMapping("/reserve")
    @Operation(summary = "예약 취소하기", description = "예약을 취소합니다.")
    public ResponseEntity<Integer> cancelReservation(@RequestBody PurchaseRequest request) {
        try {
            // 예약 취소 요청을 큐에 추가
            redisQueueProducer.sendCancelReservationRequest(request);

            // 결과를 일정 시간 동안 폴링하여 조회
            int maxRetries = 10;  // 최대 10번 시도
            int retryInterval = 1000; // 1초 간격으로 시도

            Integer result = null;
            for (int i = 0; i < maxRetries; i++) {
                result = (Integer) redisTemplate.opsForValue().get("cancelReservationResult:" + request.getUserId() + ":" + request.getProductId());
                if (result != null) {
                    break; // 결과를 성공적으로 가져온 경우
                }
                Thread.sleep(retryInterval); // 대기
            }

            if (result == null) {
                return ResponseEntity.ok(-1); // 아직 결과가 없는 경우
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error processing cancel reservation request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(-1);
        }
    }

    @PostMapping("/confirm")
    @Operation(summary = "구매 확정하기", description = "구매 예정자가 구매 시간 설정 후 구매를 확정합니다.")
    public ResponseEntity<?> confirm(@RequestBody TradeRequest request) {
        try {
            // 구매 확정 요청을 큐에 추가
            redisQueueProducer.sendConfirmRequest(request);

            // 결과를 일정 시간 동안 폴링하여 조회
            int maxRetries = 10;  // 최대 10번 시도
            int retryInterval = 1000; // 1초 간격으로 시도

            String result = null;
            for (int i = 0; i < maxRetries; i++) {
                result = (String) redisTemplate.opsForValue().get("confirmResult:" + request.getBuyerId() + ":" + request.getProductId());
                if (result != null) {
                    break; // 결과를 성공적으로 가져온 경우
                }
                Thread.sleep(retryInterval); // 대기
            }

            // TODO:not confirm뜸 -> chatting id 문제
            if (result == null) {
                return ResponseEntity.ok("not confirmed"); // 아직 결과가 없는 경우
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error processing confirm request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing confirm request");
        }
    }

    private ResponseEntity<String> handleException(Exception ex) {
        return new ResponseEntity<>("서버 오류: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
