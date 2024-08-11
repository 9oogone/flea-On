package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.domain.User;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
public class ShortsResponse {
    private final int shortsId;
    private final String shortsThumbnail;
    private final LocalTime length;
    private final String videoAddress;
    private final LocalDateTime uploadDate;
    private final ProductResponse product;
    private final UserResponse user;
    private final List<ShortsChatResponse> shortsChatResponseList;

    public ShortsResponse(Shorts shorts, List<ShortsChatResponse> shortsChatResponseList) {
        this.shortsId = shorts.getShortsId();
        this.shortsThumbnail = shorts.getShortsThumbnail();
        this.length = shorts.getLength();
        this.videoAddress = shorts.getVideoAddress();
        this.uploadDate = shorts.getUploadDate();
        this.product = new ProductResponse(shorts.getProduct());
        this.user = new UserResponse(shorts.getProduct().getSeller());
        this.shortsChatResponseList = shortsChatResponseList;
    }

    @Getter
    public static class ProductResponse {
        private final int productId;
        private final String name;
        private final int price;
        private final int firstCategoryId;
        private final int secondCategoryId;

        public ProductResponse(Product product) {
            this.productId = product.getProductId();
            this.name = product.getName();
            this.price = product.getPrice();
            this.firstCategoryId = product.getFirstCategoryId();
            this.secondCategoryId = product.getSecondCategoryId();
        }
    }

    @Getter
    public static class UserResponse {
        private final int userId;
        private final String email;
        private final String userIdentifier;
        private final String profilePicture;
        private final String name;
        private final String nickname;
        private final String role;
        private final String phone;
        private final int level;

        public UserResponse(User user) {
            this.userId = user.getUserId();
            this.email = user.getEmail();
            this.userIdentifier = user.getUserIdentifier();
            this.profilePicture = user.getProfilePicture();
            this.name = user.getName();
            this.nickname = user.getNickname();
            this.role = user.getRole();
            this.phone = user.getPhone();
            this.level = user.getLevel();
        }
    }
}
