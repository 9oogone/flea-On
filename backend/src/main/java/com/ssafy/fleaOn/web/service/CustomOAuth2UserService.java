package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.dto.*;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println("ff" + oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {

            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {

            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("kakao")) {

            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
        } else {

            return null;
        }
        String username = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
        User existData = userRepository.findByUsername(username);

        if (existData == null) {
            User user = User.builder()
                    .username(username)
                    .email(oAuth2Response.getEmail())
                    .name(oAuth2Response.getName())
                    .profilePicture(oAuth2Response.getProfilePicture())
                    .role("ROLE_USER")
                    .build();

            userRepository.save(user);

            User user2 = User.builder()
                    .username(username)
                    .email(oAuth2Response.getEmail())
                    .name(oAuth2Response.getName())
                    .profilePicture(oAuth2Response.getProfilePicture())
                    .role("ROLE_USER")
                    .build();

            return new CustomOAuth2User(user2);
        } else {

            existData.builder()
                    .email(oAuth2Response.getEmail())
                    .name(oAuth2Response.getName())
                    .profilePicture(oAuth2Response.getProfilePicture())
                    .build();
            userRepository.save(existData);

            User user = User.builder()
                    .username(existData.getUsername())
                    .name(oAuth2Response.getName())
                    .profilePicture(oAuth2Response.getProfilePicture())
                    .role(existData.getRole()).build();
            return new CustomOAuth2User(user);
        }
    }
}