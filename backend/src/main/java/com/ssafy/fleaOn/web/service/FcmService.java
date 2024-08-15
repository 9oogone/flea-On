package com.ssafy.fleaOn.web.service;

import com.google.firebase.messaging.*;
import com.ssafy.fleaOn.web.domain.Alarm;
import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.ChatAlarmRequest;
import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.dto.NextAlarmRequest;
import com.ssafy.fleaOn.web.dto.UserFcmResponse;
import com.ssafy.fleaOn.web.repository.AlarmRepository;
import com.ssafy.fleaOn.web.repository.LiveRepository;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class FcmService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AlarmRepository alarmRepository;
    private final ProductRepository productRepository;
    private final LiveRepository liveRepository;

    public FcmService(UserService userService, UserRepository userRepository, AlarmRepository alarmRepository, ProductRepository productRepository, LiveRepository liveRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.alarmRepository = alarmRepository;
        this.productRepository = productRepository;
        this.liveRepository = liveRepository;
    }

    public void sendMessageToNextPerson(NextAlarmRequest nextAlarmRequest) {

        User user = userRepository.findById(nextAlarmRequest.getNextId()).orElseThrow(()->new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        String token = user.getFcm();
        System.out.println(token);
        String profilePic = userService.getProfile(nextAlarmRequest.getProductId());
        Product product = productRepository.findByProductId(nextAlarmRequest.getProductId()).orElseThrow(()->new IllegalArgumentException("찾을 수 없는 상품입니다."));

        Alarm alarm = Alarm.builder()
                .user(user)
                .date(Timestamp.valueOf(LocalDateTime.now()))
                .isRead(false)
                .content(product.getName()+" 구매하시겠습니까?")
                .profilePic(profilePic)
                .type(nextAlarmRequest.getType())
                .liveId(nextAlarmRequest.getLiveId())
                .productId(nextAlarmRequest.getProductId())
                .build();
        alarmRepository.save(alarm);
        Message message = Message.builder()
                .setToken(token)
                .putData("body","구매하러가기")
                .putData("title",product.getName()+"이 구매 가능합니다!")
                .putData("redirect_url", "https://fleaon.shop/notifications")
                .putData("userId", String.valueOf(nextAlarmRequest.getNextId()))
                .putData("liveId", String.valueOf(nextAlarmRequest.getLiveId()))
                .putData("productId", String.valueOf(nextAlarmRequest.getProductId()))
                .putData("type", String.valueOf(nextAlarmRequest.getType()))
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Successfully sent message: " + response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void sendMessageToMultipleTokens(List<UserFcmResponse> tokens, String title, int type, int liveId) throws FirebaseMessagingException {
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
            Live live = liveRepository.findById(liveId).orElseThrow(()->new IllegalArgumentException("not found live"));
            Alarm alarm = Alarm.builder()
                    .user(user)
                    .date(Timestamp.valueOf(LocalDateTime.now()))
                    .isRead(false)
                    .content(title+" 방송이 시작되었습니다!")
                    .profilePic(sender.getProfilePicture())
                    .type(type)
                    .liveId(liveId)
                    .productId(0)
                    .build();
            alarmRepository.save(alarm);
        }

        if (validTokens.isEmpty()) {
            System.out.println("No valid tokens to send messages.");
            return;
        }

        MulticastMessage message = MulticastMessage.builder()
                .putData("body","방송 참여하기")
                .putData("title",title+" 방송이 시작되었습니다!")
                .putData("redirect_url", "https://fleaon.shop/mypage/scrap-list")
                .putData("liveId", String.valueOf(liveId))
                .putData("productId", "0")
                .putData("type", String.valueOf(type))
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

    public void sendMessageToRecipient(ChatAlarmRequest chatAlarmRequest) {
        User user = userRepository.findById(chatAlarmRequest.getRecipient()).orElseThrow(()->new IllegalArgumentException("찾을 수 없는 사용자입니다."));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        User sender = userRepository.findByEmail(oAuth2User.getEmail()).orElseThrow(()-> new IllegalArgumentException("찾을 수 없는 발신자입니다."));
        System.out.println(user.getFcm());
        Alarm alarm = Alarm.builder()
                .user(user)
                .date(Timestamp.valueOf(LocalDateTime.now()))
                .isRead(false)
                .content(chatAlarmRequest.getContent())
                .profilePic(sender.getProfilePicture())
                .type(chatAlarmRequest.getType())
                .productId(chatAlarmRequest.getProductId())
                .liveId(chatAlarmRequest.getLiveId())
                .build();
        alarmRepository.save(alarm);

        Message message = Message.builder()
                .setToken(user.getFcm())
                .putData("body",chatAlarmRequest.getContent())
                .putData("title",sender.getName())
                .putData("redirect_url", "https://fleaon.shop/chat/"+chatAlarmRequest.getChatId())
                .putData("icon", sender.getProfilePicture())
                .putData("liveId", String.valueOf(chatAlarmRequest.getLiveId()))
                .putData("productId", String.valueOf(chatAlarmRequest.getProductId()))
                .putData("type", String.valueOf(chatAlarmRequest.getType()))
                .build();
        try {
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Successfully sent message: " + response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
