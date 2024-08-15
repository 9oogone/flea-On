package com.ssafy.fleaOn.web.service;

import com.google.firebase.messaging.*;
import com.ssafy.fleaOn.web.dto.UserFcmResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class FcmService {
    public void sendMessageToMultipleTokens(List<UserFcmResponse> tokens, String title) throws FirebaseMessagingException {
        // 유효한 토큰 필터링
        List<String> validTokens = tokens.stream()
                .map(UserFcmResponse::getFcmToken)
                .filter(token -> token != null && !token.trim().isEmpty())
                .collect(Collectors.toList());

        if (validTokens.isEmpty()) {
            System.out.println("No valid tokens to send messages.");
            return;
        }

        MulticastMessage message = MulticastMessage.builder()
                .putData("body","방송 참여하기")
                .putData("title",title+" 방송이 시작되었습니다!")
                .putData("redirect_url", "https://fleaon.shop/mypage/scrap-list")
                .addAllTokens(validTokens)
                .build();

        FirebaseMessaging.getInstance().sendMulticast(message)
                .getResponses().forEach(response -> {
                    if (response.isSuccessful()) {
                        System.out.println("Sent message: " + response.getMessageId());
                    } else {
                        System.out.println("Failed to send message: " + response.getException().getMessage());
                    }
                });
    }
}
