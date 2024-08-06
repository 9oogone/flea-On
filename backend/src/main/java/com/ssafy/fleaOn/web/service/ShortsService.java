package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.ShortsRequest;
import com.ssafy.fleaOn.web.repository.*;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.ShortsRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ShortsService {

    private final ShortsRepository shortsRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ShortsScrapRepository shortsScrapRepository;

    @Autowired
    public ShortsService(ShortsRepository shortsRepository, ProductRepository productRepository, UserRepository userRepository, ShortsScrapRepository shortsScrapRepository) {
        this.shortsRepository = shortsRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.shortsScrapRepository = shortsScrapRepository;
    }

    @Transactional
    public Shorts saveShorts(ShortsRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        User seller = userRepository.findById(product.getSeller().getUserId()).orElseThrow(() -> new IllegalArgumentException("Invalid seller"));
        Shorts shorts = request.toEntity(product, seller);
        return shortsRepository.save(shorts);
    }

    public Optional<Shorts> getShorts(int shortsId) {
        return shortsRepository.findById(shortsId);
    }

    public void addUserShortsScrap(int userId, int shortsId) {
        try {
            Optional<User> findUser = userRepository.findById(userId);
            if (findUser.isPresent()) {
                Optional<Shorts> findShorts = shortsRepository.findById(shortsId);
                if (findShorts.isPresent()) {
                    ShortsScrap shortsScrap = ShortsScrap.builder()
                            .shorts(findShorts.get())
                            .user(findUser.get())
                            .build();
                    shortsScrapRepository.save(shortsScrap);
                } else {
                    throw new IllegalArgumentException("Cannot find shorts");
                }
            } else {
                throw new IllegalArgumentException("Cannot find user");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
    public void deleteUserShortsScrap(int userId, int shortsId) {
        try {
            Optional<ShortsScrap> findShortsScrap = shortsScrapRepository.findByUser_userIdAndShorts_shortsId(userId, shortsId);
            if (findShortsScrap.isPresent()) {
                shortsScrapRepository.delete(findShortsScrap.get());
            } else {
                throw new IllegalArgumentException("Cannot find shorts scrap");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
    public Map<String, Object> getShortsDetails(int shortsId){
        Optional<Shorts> shorts = shortsRepository.findById(shortsId);
        Map<String, Object> shortsDetails = new HashMap<>();
        if (shorts.isPresent()) {
            shortsDetails.put("product_id", shorts.get().getProduct().getProductId());
            shortsDetails.put("shorts_id", shorts.get().getShortsId());
            shortsDetails.put("upload_date", shorts.get().getUploadDate());
            shortsDetails.put("thumbnail", shorts.get().getShortsThumbnail());
            shortsDetails.put("video_address", shorts.get().getVideoAddress());
            shortsDetails.put("user_id", shorts.get().getUser().getUserId());
        }
        return shortsDetails;
    }
}
