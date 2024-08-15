package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.ChatAlarmRequest;
import com.ssafy.fleaOn.web.dto.NextAlarmRequest;
import com.ssafy.fleaOn.web.dto.UserFcmResponse;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.service.FcmService;
import com.ssafy.fleaOn.web.service.PurchaseService;
import com.ssafy.fleaOn.web.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/push")
public class PushController {
    private final UserService userService;
    private final FcmService fcmService;

//    @GetMapping("/testNoti")
//    public String sendNotification(@RequestParam("token") String token,
//                                   @RequestParam("title") String title,
//                                   @RequestParam("body") String body) throws FirebaseMessagingException {
//        fcmService.sendMessage(token, title, body);
//        return "Notification sent!";
//    }

    @GetMapping("/scrap/{liveId}")
    public ResponseEntity<?> scrapNotification(
            @PathVariable("liveId") int liveId,
            @RequestParam("title") String title) {
        try {
            // liveId를 기반으로 FCM 정보를 가져옴
            List<UserFcmResponse> liveScrapUserInfo = userService.getUserFcmByLiveId(liveId);

            if (!liveScrapUserInfo.isEmpty()) {
                // FCM 메시지 전송
                fcmService.sendMessageToMultipleTokens(liveScrapUserInfo, title);

                // 성공적으로 전송되었을 때, 사용자 정보를 반환
                return ResponseEntity.status(HttpStatus.OK).body(liveScrapUserInfo);
            } else {
                // FCM 정보를 찾지 못한 경우
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/cancelAlarm")
    public ResponseEntity<?> cancelAlarm(@RequestParam("productId") int productId) {
            fcmService.sendMessageToNextPerson(productId);
            return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/cancelAlarmBatch")
    public ResponseEntity<?> cancelAlarmBatch(@RequestParam("productId") Map<String,List<Integer>> productIds) {
        for( int productId : productIds.get("productIds") ) {
            fcmService.sendMessageToNextPerson(productId);
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/chatAlarm")
    public ResponseEntity<?> chatAlarm(@RequestBody ChatAlarmRequest chatAlarmRequest) {
        fcmService.sendMessageToRecipient(chatAlarmRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}


