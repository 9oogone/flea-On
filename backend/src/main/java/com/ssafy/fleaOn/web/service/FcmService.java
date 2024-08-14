package com.ssafy.fleaOn.web.service;

import com.google.firebase.messaging.*;
import com.ssafy.fleaOn.web.domain.Alarm;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.dto.UserFcmResponse;
import com.ssafy.fleaOn.web.repository.AlarmRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class FcmService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AlarmRepository alarmRepository;

    public FcmService(UserService userService, UserRepository userRepository, AlarmRepository alarmRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.alarmRepository = alarmRepository;
    }

    public void sendMessageToMultipleTokens(List<UserFcmResponse> tokens, String title) throws FirebaseMessagingException {
        // 유효한 토큰 필터링
        List<String> validTokens = tokens.stream()
                .map(UserFcmResponse::getFcmToken)
                .filter(token -> token != null && !token.trim().isEmpty())
                .collect(Collectors.toList());

        for (UserFcmResponse token : tokens) {
            User user = userRepository.findById(token.getUserId()).orElseThrow(()->new IllegalArgumentException("찾을 수 없는 사용자입니다."));
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
            User sender = userRepository.findByEmail(oAuth2User.getEmail()).orElseThrow(()-> new IllegalArgumentException("찾을 수 없는 발신자입니다."));
            Alarm alarm = new Alarm(title+" 방송이 시작되었습니다!", sender.getProfilePicture(), user);
            alarmRepository.save(alarm);
        }

        if (validTokens.isEmpty()) {
            System.out.println("No valid tokens to send messages.");
            return;
        }

        MulticastMessage message = MulticastMessage.builder()
                .setNotification(Notification.builder()
                        .setTitle(title+" 방송이 시작되었습니다!")
                        .setBody("방송 참여하기")
                        .build())
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
