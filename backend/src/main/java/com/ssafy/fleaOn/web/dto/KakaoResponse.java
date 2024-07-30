package com.ssafy.fleaOn.web.dto;

import java.util.Map;

public class KakaoResponse implements OAuth2Response {

    private final Map<String, Object> attribute;
    private final Map<String, Object> kakaoAccount;
    private final Map<String, Object> kakaoProfile;

    public KakaoResponse(Map<String, Object> attribute) {
        this.kakaoAccount = (Map<String, Object>) attribute.get("kakao_account");
        this.kakaoProfile = (Map<String, Object>) kakaoAccount.get("profile");

        this.attribute = attribute;

    }


    // attributes 맵의 kakao_account 키의 값에 실제 attributes 맵이 할당되어 있음

    @Override
    public String getProvider() {

        return "kakao";
    }

    @Override
    public String getProviderId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getEmail() {

        return kakaoAccount.get("email").toString();
    }

    @Override
    public String getName() {
        return kakaoProfile.get("nickname").toString();
    }

    public String getProfile_picture() {
        return kakaoProfile.get("profile_image_url").toString();
    }
}
