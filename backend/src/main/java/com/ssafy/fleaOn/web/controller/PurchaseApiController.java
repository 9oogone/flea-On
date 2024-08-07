package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.dto.PurchaseCancleResponse;
import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.dto.TradeRequest;
import com.ssafy.fleaOn.web.producer.RedisQueueProducer;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/fleaon/purchase")
@Tag(name = "Purchase API", description = "구매,예약 관련 API")
public class PurchaseApiController {

//    private static final Logger logger = LoggerFactory.getLogger(PurchaseApiController.class);

    private final RedisQueueProducer redisQueueProducer;
    private final RedisTemplate<String, Object> redisTemplate;
    private final UserService userService;

    @Autowired
    public PurchaseApiController(RedisQueueProducer redisQueueProducer, RedisTemplate<String, Object> redisTemplate, UserService userService) {
        this.redisQueueProducer = redisQueueProducer;
        this.redisTemplate = redisTemplate;
        this.userService = userService;
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
//            logger.error("Error processing purchase request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(-1);
        }
    }

    @DeleteMapping("/cancel")
    @Operation(summary = "구매 취소 기능", description = "구매 취소를 합니다.")
    public ResponseEntity<?> cancel(@RequestBody PurchaseRequest request) {
        try {
            // 구매 취소 요청을 큐에 추가
            redisQueueProducer.sendCancelPurchaseRequest(request);

            // 결과를 일정 시간 동안 폴링하여 조회
            int maxRetries = 10;  // 최대 10번 시도
            int retryInterval = 1000; // 1초 간격으로 시도

            PurchaseCancleResponse result = null;
            for (int i = 0; i < maxRetries; i++) {
                Object response = redisTemplate.opsForValue().get("cancelPurchaseResult:" + request.getUserId() + ":" + request.getProductId());
                if (response != null && response instanceof PurchaseCancleResponse) {
                    result = (PurchaseCancleResponse) response;
                    break; // 결과를 성공적으로 가져온 경우
                }
                Thread.sleep(retryInterval); // 대기
            }

            if (result == null) {
//                logger.warn("No cancel purchase result found for userId: {} and productId: {}", request.getUserId(), request.getProductId());
                return ResponseEntity.ok(-1); // 아직 결과가 없는 경우
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
//            logger.error("Error processing cancel purchase request", e);
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
//            logger.error("Error processing reservation request", e);
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
//            logger.error("Error processing cancel reservation request", e);
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

            if (result == null) {
//                logger.info("null here!!");
                return ResponseEntity.ok("not confirmed"); // 아직 결과가 없는 경우
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
//            logger.error("Error processing confirm request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing confirm request");
        }
    }

    // 거래 파기 요청 엔드포인트
    @DeleteMapping("/break-trade/{chatId}")
    @Operation(summary = "거래 파기", description = "특정 라이브의 모든 거래를 파기합니다.")
    public ResponseEntity<?> breakTrade(@AuthenticationPrincipal CustomOAuth2User principal, @PathVariable int chatId) {
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            // 거래 파기 요청을 큐에 추가
            redisQueueProducer.sendBreakTradeRequest(chatId, user.getUserId());

            // 결과를 일정 시간 동안 폴링하여 조회
            int maxRetries = 10;  // 최대 10번 시도
            int retryInterval = 1000; // 1초 간격으로 시도

            List<PurchaseCancleResponse> result = null;
            for (int i = 0; i < maxRetries; i++) {
                Object response = redisTemplate.opsForValue().get("breakTradeResult:" + chatId);
                if (response != null && response instanceof List) {
                    result = (List<PurchaseCancleResponse>) response;
                    break; // 결과를 성공적으로 가져온 경우
                }
                Thread.sleep(retryInterval); // 대기
            }

            if (result == null) {
                return ResponseEntity.ok("아직 결과가 없습니다."); // 아직 결과가 없는 경우
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
//            logger.error("Error processing break trade request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("거래 파기 중 오류 발생");
        }
    }

    private ResponseEntity<String> handleException(Exception ex) {
        return new ResponseEntity<>("서버 오류: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
