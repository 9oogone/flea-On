package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.*;
import com.ssafy.fleaOn.web.repository.*;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.ShortsRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ShortsService {

    private final ShortsRepository shortsRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ShortsScrapRepository shortsScrapRepository;
    private final ShortsChattingRepository shortsChattingRepository;
    private final TradeRepository tradeRepository;

    @Autowired
    public ShortsService(ShortsRepository shortsRepository, ProductRepository productRepository, UserRepository userRepository, ShortsScrapRepository shortsScrapRepository, ShortsChattingRepository shortsChattingRepository, TradeRepository tradeRepository) {
        this.shortsRepository = shortsRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.shortsScrapRepository = shortsScrapRepository;
        this.shortsChattingRepository = shortsChattingRepository;
        this.tradeRepository = tradeRepository;
    }

    @Transactional
    public void saveShorts(ShortsRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        User seller = userRepository.findById(product.getSeller().getUserId()).orElseThrow(() -> new IllegalArgumentException("Invalid seller"));
        Shorts shorts = request.toEntity(product, seller);
        shortsRepository.save(shorts);

        product.sellEnd();
        productRepository.save(product);

        Optional<Trade> trade = tradeRepository.findByProduct_productId(shorts.getProduct().getProductId());
        trade.ifPresent(value -> value.uploadShorts(shorts));
        saveShortsChatting(request.getShortsChatRequests(),shorts.getShortsId());
    }

    public ShortsResponse getShorts(int shortsId) {
        Shorts shorts = shortsRepository.findById(shortsId).orElseThrow(()->new IllegalArgumentException("Cannot found shorts"));
        Optional<List<ShortsChatting>> shortsChattings = shortsChattingRepository.findByShorts_ShortsId(shortsId);
        List<ShortsChatResponse> shortsChatResponseList = new ArrayList<>();
        String liveTitle;
        if (shortsChattings.isPresent()){
            Product product = shorts.getProduct();
            liveTitle = product.getLive().getTitle();
            for (ShortsChatting shortsChatting : shortsChattings.get()) {
                User writer = shortsChatting.getUser();
                ShortsChatResponse shortsChatResponse = new ShortsChatResponse(
                        writer.getProfilePicture(),
                        writer.getNickname(),
                        shortsChatting.getContent(),
                        shortsChatting.getTime()
                );
                shortsChatResponseList.add(shortsChatResponse);
            }
        } else {
            liveTitle = "";
        }

        return new ShortsResponse(shorts, liveTitle, shortsChatResponseList);
    }

    public void addUserShortsScrap(int userId, int shortsId) {
        User findUser = userRepository.findById(userId).orElseThrow(()->new IllegalArgumentException("Cannot found user"));
        Shorts findShorts = shortsRepository.findById(shortsId).orElseThrow(()-> new IllegalArgumentException("Cannot found shorts"));
        if (userId==findShorts.getUser().getUserId())
            new IllegalArgumentException("Cannot add shorts to user");
        ShortsScrap shortsScrap = ShortsScrap.builder()
                .shorts(findShorts)
                .user(findUser)
                .build();
        shortsScrapRepository.save(shortsScrap);
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

    public void saveShortsChatting(List<ShortsChatRequest> request, int shortsId) {
        for (ShortsChatRequest shortsChatRequest : request) {
            Shorts shorts = shortsRepository.findById(shortsId).orElseThrow(() -> new IllegalArgumentException("Invalid shorts ID"));
            User user = userRepository.findById(shortsChatRequest.getUserId()).orElseThrow(() -> new IllegalArgumentException("Invalid user"));
            ShortsChatting shortsChatting = shortsChatRequest.toEntity(shorts, user);
            shortsChattingRepository.save(shortsChatting);
        }
    }

    @Transactional
    public void startSell(int productId) {
        Product product = productRepository.findByProductId(productId).orElseThrow(() -> new IllegalArgumentException("no product found for product id: " + productId));
        Live live = product.getLive();
        authorizeArticleAuthor(live);
        product.sellStart();
        productRepository.save(product);
    }

    private static void authorizeArticleAuthor(Live live) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String userEmail = oAuth2User.getEmail();
        if (!live.getSeller().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("not authorized");
        }
    }
}
