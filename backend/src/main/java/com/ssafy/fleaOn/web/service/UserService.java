package com.ssafy.fleaOn.web.service;


import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import com.ssafy.fleaOn.web.domain.User;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    private final UserRegionRepository userRegionRepository;

    private final TradeRepository tradeRepository;

    private final ProductRepository productRepository;

//    private final ShortsRepository shortsRepository;

    public User findByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        System.out.println("user: " + user);
        return user.orElse(null);
    }

    public int getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email))
                .getUserId();
    }

    public void deleteUserByEmail(String email) {
        userRepository.deleteByEmail(email);
    }

    public void updateUserByEmail(String email, User user) {
        User newUser = User.builder()
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .profilePicture(user.getProfilePicture())
                .build();
        userRepository.save(newUser);
    }

    public Map<String, Object> getUserInfoByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return null;
        }

        User user = userOptional.get();
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("nickname", user.getNickname());
        userInfo.put("level", user.getLevel());
        userInfo.put("profile_picture", user.getProfilePicture());

        // UserRegion 리스트 처리
        Optional<List<UserRegion>> userRegionListOptional = userRegionRepository.findByUserId(user.getUserId());
        userRegionListOptional.ifPresent(userRegionList -> {
            List<String> regionList = userRegionList.stream()
                    .map(UserRegion::getRegionCode)
                    .collect(Collectors.toList());
            userInfo.put("user_region", regionList);
        });

        // Trade 리스트 처리
        Optional<List<Trade>> tradeListOptional = tradeRepository.findByUser_UserId(user.getUserId());
        tradeListOptional.ifPresent(tradeList -> {
            List<LocalDate> tradeDates = tradeList.stream()
                    .map(Trade::getTradeDate)
                    .collect(Collectors.toList());
            userInfo.put("trade", tradeDates);
        });

        return userInfo;
    }
    public Optional<List<Map<String, Object>>> getUserScheduleListByIdAndDate(int userId, LocalDate tradeDate) {
        LocalDate endDate = tradeDate.plusDays(6);
        Optional<List<Trade>> tradesOptional = tradeRepository.findByTradeDateBetweenAndBuyerIdOrSellerId(tradeDate, endDate, userId, userId);

        if (tradesOptional.isEmpty()) {
            return Optional.empty();
        }

        List<Trade> trades = tradesOptional.get();
        List<Map<String, Object>> tradeList = new ArrayList<>();

        for (Trade trade : trades) {
            Map<String, Object> tradeResult = new HashMap<>();
            Optional<Product> productOptional = productRepository.findById(trade.getProductId());

            productOptional.ifPresent(product -> {
                tradeResult.put("product_name", product.getName());
                tradeResult.put("product_price", product.getPrice());
            });

            tradeResult.put("buyer_id", trade.getBuyerId());
            tradeResult.put("seller_id", trade.getSellerId());
            tradeResult.put("trade_place", trade.getTradePlace());
            tradeResult.put("trade_time", trade.getTradeTime());
            tradeList.add(tradeResult);
        }

        return Optional.of(tradeList);
    }


    public Optional<List<Map<String, Object>>> getUserPurchaseListByUserId(int userId) {
        Optional<List<Trade>> tradesOptional = tradeRepository.findByBuyerId(userId);

        // tradesOptional이 비어 있으면 Optional.empty() 반환
        if (tradesOptional.isEmpty()) {
            return Optional.empty();
        }

        List<Trade> trades = tradesOptional.get();
        List<Map<String, Object>> purchaseList = new ArrayList<>();

        for (Trade trade : trades) {
            Map<String, Object> purchaseResult = new HashMap<>();
            Optional<Product> productOptional = productRepository.findById(trade.getProductId());

            // productOptional이 비어 있지 않으면 값을 가져와서 처리
            productOptional.ifPresent(product -> {
                purchaseResult.put("name", product.getName());
                purchaseResult.put("price", product.getPrice());
                purchaseResult.put("live_id", trade.getLiveId());
            });

            purchaseResult.put("product_id", trade.getProductId());
            purchaseResult.put("trade_place", trade.getTradePlace());
            purchaseResult.put("trade_time", trade.getTradeTime());
            purchaseList.add(purchaseResult);
        }

        return Optional.of(purchaseList);
    }


    public Optional<List<Map<String, Object>>> getUserReservationListByUserId(int userId) {
        Optional<List<Trade>> tradesOptional = tradeRepository.findByBuyerId(userId);

        System.out.println("tradesOptional : " + tradesOptional.get());

        // tradesOptional이 비어 있으면 Optional.empty() 반환
        if (tradesOptional.isEmpty()) {
            return Optional.empty();
        }

        List<Trade> trades = tradesOptional.get();
        List<Map<String, Object>> reservationList = new ArrayList<>();

        for (Trade trade : trades) {
            Map<String, Object> reservationResult = new HashMap<>();
            Optional<Product> productOptional = productRepository.findById(trade.getProductId());

            // productOptional이 비어 있지 않으면 값을 가져와서 처리
            productOptional.ifPresent(product -> {
                reservationResult.put("name", product.getName());
                reservationResult.put("price", product.getPrice());
            });

            reservationResult.put("trade_place", trade.getTradePlace());
            reservationResult.put("trade_time", trade.getTradeTime());
            reservationList.add(reservationResult);
        }

        return Optional.of(reservationList);
    }
//
//    public Optional<List<Map<String, Object>>> getUserCommerceLiveListById(int userId) {
//        Optional<List<Map<String, Object>>> userCo
//    }
//
//    public Optional<List<Map<String, Object>>> getUserCommerceItemListById(int userId) {
//        Optional<List<Shorts>> shortsList = shortsRepository.findByBuyerId(userId);
//    }

}
