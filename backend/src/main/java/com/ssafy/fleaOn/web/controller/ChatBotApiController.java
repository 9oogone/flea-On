package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.*;
import com.ssafy.fleaOn.web.service.ChatBotService;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fleaon/chatbot")
@RequiredArgsConstructor
@Tag(name = "ChatBot API", description = "챗봇 관련 API")
@Slf4j
public class ChatBotApiController {

    private static final Logger logger = LoggerFactory.getLogger(PurchaseApiController.class);

    private final ChatBotService chatBotService;
    private final UserService userService;

    @Operation(summary = "챗봇 거래 상세", description = "챗봇 거래 상세 내용을 조회할 때 사용합니다.")
    @GetMapping("/{chatId}/detail")
    public ResponseEntity<?> getChattingDetail(@AuthenticationPrincipal CustomOAuth2User principal, @PathVariable("chatId") int chatId) {
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.OK);
            }

            ChatbotDetailResponse chatbotDetailResponse = chatBotService.getChattingDetailsByChatId(chatId, user.getUserId());
            if (chatbotDetailResponse == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            } else return ResponseEntity.status(HttpStatus.OK).body(chatbotDetailResponse);

        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Operation(summary = "챗봇 판매자와 대화", description = "챗봇 판매자와의 대화를 선택할 때 사용합니다.")
    @PutMapping("/{chatId}/convo")
    public ResponseEntity<?> startWithSeller(@AuthenticationPrincipal CustomOAuth2User principal, @PathVariable("chatId") int chatId) {
        logger.info("판매자와 대화 메서드 들어옴");
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                logger.info("판매자와 대화에서 사용자 찾을 수 없음");
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            logger.info("판매자 대화 시작한다");
            int sellerId = chatBotService.startWithSellerChat(chatId);
            logger.info("시작하라고 명령 했는데 적용 됐니?");
            return ResponseEntity.status(HttpStatus.OK).body(sellerId);
        }
        catch (Exception e){
            e.printStackTrace();
            logger.info(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Operation(summary = "챗봇 시간 변경 수락", description = "판매자가 시간 변경을 수락할 시 거래 정보가 바뀝니다.")
    @PutMapping("/changeTime")
    public ResponseEntity<?> changeTradeTime(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody ChangeTimeRequest changeTimeRequest) {
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            chatBotService.updateTradeTime(changeTimeRequest);
            return ResponseEntity.ok().build();
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
