package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.Chatting;
import com.ssafy.fleaOn.web.domain.ChattingList;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.*;
import com.ssafy.fleaOn.web.service.ChattingService;
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

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fleaon/chat")
@RequiredArgsConstructor
@Tag(name = "Chatting API", description = "채팅 관련 API")
@Slf4j
public class ChattingApiController {

    private final ChattingService chattingService;
    private final UserService userService;

    @GetMapping("")
    @Operation(summary = "채팅방 목록", description = "사용자가 참여중인 채팅방들을 모두 불러옵니다.")
    public ResponseEntity<?> getChattingList(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) {
            return new ResponseEntity<>("인증된 사용자가 없습니다.", HttpStatus.UNAUTHORIZED);
        }
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);
            }

            List<ChattingResponse> chattingResponses = chattingService.getChattingByUserId(user.getUserId());
            if (!chattingResponses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(chattingResponses);
            } else {
                return new ResponseEntity<>("채팅방이 없습니다.", HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            log.error("채팅목록을 불러오는 중 오류가 발생하였습니다: ", ex);
            return new ResponseEntity<>("채팅목록을 불러오는 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/messages")
    @Operation(summary = "채팅 메시지 목록", description = "특정 채팅방의 메시지들을 모두 불러옵니다.")
    public ResponseEntity<?> getMessagesByChattingId(@AuthenticationPrincipal CustomOAuth2User principal, @RequestParam int chattingId) {
        if (principal == null) {
            return new ResponseEntity<>("인증된 사용자가 없습니다.", HttpStatus.UNAUTHORIZED);
        }
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);
            }

            ChattingMessageResponse chattingMessageResponse = chattingService.getChatMessage(chattingId, user);
            return ResponseEntity.ok(chattingMessageResponse);
        } catch (Exception ex) {
            log.error("채팅 메시지를 불러오는 중 오류가 발생하였습니다: ", ex);
            return new ResponseEntity<>("채팅 메시지를 불러오는 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/messages")
    @Operation(summary = "메시지 생성", description = "특정 채팅방에 메시지를 생성합니다.")
    public ResponseEntity<?> createMessage(@AuthenticationPrincipal CustomOAuth2User principal, @RequestBody ChattingMessageRequest chattingMessageRequest) {
        if (principal == null) {
            return new ResponseEntity<>("인증된 사용자가 없습니다.", HttpStatus.UNAUTHORIZED);
        }
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            Chatting chatting = chattingService.getChatByChattingId(chattingMessageRequest.getChattingId());
            ChattingList message = chattingService.createMessage(chatting, user.getUserId(), chattingMessageRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (Exception ex) {
            log.error("메시지 생성 중 오류가 발생하였습니다: ", ex);
            return new ResponseEntity<>("메시지 생성 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
