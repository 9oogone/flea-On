package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.RegionInfo;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.domain.UserRegion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserFullInfoResponse {

    private int userId;
    private String email;
    private String profilePicture;
    private String name;
    private String nickname;
    private String phone;
    private int level;
    private List<String> dongName;
    private List<String> regionCode;

    public static UserFullInfoResponse fromEntity(User user, List<UserRegion> userRegionList, List<RegionInfo> regionInfoList) {
        return UserFullInfoResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .name(user.getName())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .level(user.getLevel())
                .dongName(regionInfoList.stream().map(RegionInfo::getEupmyeon).collect(Collectors.toList()))
                .regionCode(userRegionList.stream()
                        .map(userRegion -> userRegion.getRegion().getRegionCode()) // regionCode 추출
                        .collect(Collectors.toList()))
                .build();
    }
}
