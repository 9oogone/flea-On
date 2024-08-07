package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.ChatbotDetailResponse;
import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.dto.PurchaseCancleResponse;
import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.service.ChatBotService;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final ChatBotService chatBotService;
    private final UserService userService;

    @Operation(summary = "챗봇 거래 상세", description = "챗봇 거래 상세 내용을 조회할 때 사용합니다.")
    @GetMapping("/{chatId}/detail")
    public ResponseEntity<?> getChattingDetail(@AuthenticationPrincipal CustomOAuth2User principal, @PathVariable("chatId") int chatId) {
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
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

//    @DeleteMapping("/{chatId}/cancelAll")
//    @Operation(summary = "챗봇 거래 파기", description = "챗봇 거래 취소 시 모든 거래를 파기하고 채팅방을 나갑니다.")
//    public ResponseEntity<?> cancelAll(@AuthenticationPrincipal CustomOAuth2User principal) {
//
//    }
}
