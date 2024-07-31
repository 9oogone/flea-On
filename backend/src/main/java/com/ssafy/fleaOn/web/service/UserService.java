package com.ssafy.fleaOn.web.service;


import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.TradeRepository;
import com.ssafy.fleaOn.web.repository.UserRegionRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private UserRepository userRepository;

    private UserRegionRepository userRegionRepository;

    private TradeRepository tradeRepository;

    private ProductRepository productRepository;


    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
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
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return null;
        }

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("nickname", user.getNickname());
        userInfo.put("level", user.getLevel());
        userInfo.put("profile_picture", user.getProfilePicture());

        List<UserRegion> userRegionList = userRegionRepository.findByUserId(user.getUserId());
        if (!userRegionList.isEmpty()) {
            List<String> regionList = userRegionList.stream()
                    .map(UserRegion::getRegionCode)
                    .collect(Collectors.toList());

            userInfo.put("user_region", regionList);
        }

        List<Trade> tradeList = tradeRepository.findByUser_UserId(user.getUserId());
        if (!tradeList.isEmpty()) {
            List<LocalDate> tradeDates = tradeList.stream()
                    .map(Trade::getTradeDate)
                    .collect(Collectors.toList());
            userInfo.put("trade", tradeDates);
        }
        return userInfo;

    }
    public Optional<List<Map<String, Object>>> getUserScheduleByIdAndDate(int userId, LocalDate tradeDate) {
        LocalDate endDate = tradeDate.plusDays(6);
        List<Trade> trades = tradeRepository.findByTradeDateBetweenAndBuyerIdOrSellerId(tradeDate, endDate, userId, userId);

        if (trades.isEmpty()) {
            return Optional.empty();
        }

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
        List<Trade> trades = tradeRepository.findByBuyerId(userId);
        if (trades.isEmpty()) {
            return Optional.empty();
        }

        List<Map<String, Object>> purchaseList = new ArrayList<>();

        for (Trade trade : trades) {
            Map<String, Object> purchaseResult = new HashMap<>();
            Optional<Product> productOptional = productRepository.findById(trade.getProductId());

            if(productOptional.isPresent()) {
                Product product = productOptional.get();
                purchaseResult.put("name", product.getName());
                purchaseResult.put("price", product.getPrice());
                purchaseResult.put("live_id", trade.getLiveId());
            }
            purchaseResult.put("product_id", trade.getProductId());
            purchaseResult.put("trade_place", trade.getTradePlace());
            purchaseResult.put("trade_time", trade.getTradeTime());
            purchaseList.add(purchaseResult);
        }

        return Optional.of(purchaseList);
    }

}
