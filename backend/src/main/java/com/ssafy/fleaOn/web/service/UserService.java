package com.ssafy.fleaOn.web.service;


import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.repository.*;
import com.ssafy.fleaOn.web.util.DateUtil;
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

    private final LiveRepository liveRepository;

    private final LiveScrapRepository liveScrapRepository;

    private final ShortsScrapRepository shortsScrapRepository;

    private final ShortsRepository shortsRepository;

    private final RegionInfoRepository regionInfoRepository;

    private final ReservationRepository reservationRepository;

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
        Optional<List<UserRegion>> userRegionListOptional = userRegionRepository.findByUser_userId(user.getUserId());
        if (userRegionListOptional.isPresent()) {
            List<UserRegion> userRegionList = userRegionListOptional.get();
            for (UserRegion userRegion : userRegionList) {
                userInfo.put("region_code", userRegion.getRegion().getRegionCode());
            }
        }
        // Trade 리스트 처리
        Optional<List<Trade>> tradeListOptional = tradeRepository.findBySellerIdOrBuyerId(user.getUserId(), user.getUserId());
        if (tradeListOptional.isPresent()) {
            List<Trade> tradeList = tradeListOptional.get();
            for (Trade trade : tradeList) {
                userInfo.put("buyer_id", trade.getBuyerId());
                userInfo.put("seller_id", trade.getSellerId());
                userInfo.put("trade_place", trade.getTradePlace());
                userInfo.put("trade_date", trade.getTradeDate());
                userInfo.put("trade_time", trade.getTradeTime());
            }
        }
        return userInfo;
    }

    public Optional<List<Map<String, Object>>> getUserScheduleListByUserIdAndDate(int userId, LocalDate tradeDate) {
        LocalDate startOfWeek = DateUtil.getStartOfWeek(tradeDate);
        LocalDate endOfWeek = DateUtil.getEndOfWeek(tradeDate);
        Optional<List<Trade>> tradesOptional = tradeRepository.findByTradeDateBetweenAndBuyerIdOrSellerId(startOfWeek, endOfWeek, userId, userId);

        if (tradesOptional.isEmpty()) {
            return Optional.empty();
        }

        List<Trade> trades = tradesOptional.get();
        List<Map<String, Object>> tradeList = new ArrayList<>();

        for (Trade trade : trades) {
            Map<String, Object> tradeResult = new HashMap<>();
            Optional<Product> productOptional = productRepository.findByProductId(trade.getProductId());

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
            Optional<Product> productOptional = productRepository.findByProductId(trade.getProductId());

            // productOptional이 비어 있지 않으면 값을 가져와서 처리
            productOptional.ifPresent(product -> {
                purchaseResult.put("name", product.getName());
                purchaseResult.put("price", product.getPrice());
                purchaseResult.put("live_id", trade.getLive().getLiveId());
            });

            purchaseResult.put("product_id", trade.getProductId());
            purchaseResult.put("trade_place", trade.getTradePlace());
            purchaseResult.put("trade_time", trade.getTradeTime());
            purchaseList.add(purchaseResult);
        }

        return Optional.of(purchaseList);
    }


    public Optional<List<Map<String, Object>>> getUserReservationListByUserId(int userId) {
        Optional<List<Reservation>> reservationOptional = reservationRepository.findByUser_userId(userId);

        // tradesOptional이 비어 있으면 Optional.empty() 반환
        if (reservationOptional.isEmpty()) {
            return Optional.empty();
        }
        List<Reservation> findReservationList = reservationOptional.get();
        List<Map<String, Object>> reservationList = new ArrayList<>();

        for (Reservation reservation : findReservationList) {
            Map<String, Object> reservationResult = new HashMap<>();
            Optional<Product> productOptional = productRepository.findByProductId(reservation.getProduct().getProductId());

            // productOptional이 비어 있지 않으면 값을 가져와서 처리
            productOptional.ifPresent(product -> {
                reservationResult.put("name", product.getName());
                reservationResult.put("price", product.getPrice());
            });

            Optional<Trade> tradeOptional = tradeRepository.findByProduct_productId(reservation.getProduct().getProductId());
            if (tradeOptional.isPresent()) {
                reservationResult.put("trade_place", tradeOptional.get().getTradePlace());
                reservationResult.put("trade_time", tradeOptional.get().getTradeTime());
                reservationResult.put("trade_date", tradeOptional.get().getTradeDate());
                reservationResult.put("live_id", tradeOptional.get().getLive().getLiveId());
            }
            reservationList.add(reservationResult);
        }

        return Optional.of(reservationList);
    }

    public Optional<List<Map<String, Object>>> getUserCommerceLiveListByUserId(int userId) {
        Optional<List<Live>> commerceLiveListOptional = liveRepository.findBySeller_userId(userId);
        if (commerceLiveListOptional.isEmpty()) {
            return Optional.empty();
        }
        List<Live> commerceLiveList = commerceLiveListOptional.get();
        List<Map<String, Object>> userCommerceLiveList = new ArrayList<>();

        for (Live live : commerceLiveList) {
            Optional<Live> commerceLiveOptional = liveRepository.findById(live.getLiveId());

            // Optional이 비어 있지 않으면 값을 가져와서 처리
            commerceLiveOptional.ifPresent(commerceLive -> {
                Map<String, Object> commerceLiveResult = new HashMap<>();
                commerceLiveResult.put("title", commerceLive.getTitle());
                commerceLiveResult.put("trade_place", commerceLive.getTradePlace());
                commerceLiveResult.put("is_live", commerceLive.getIsLive());
                commerceLiveResult.put("live_date", commerceLive.getLiveDate());
                userCommerceLiveList.add(commerceLiveResult);
            });
        }

        return Optional.of(userCommerceLiveList);
    }

    public Optional<List<Map<String, Object>>> getUserScrapLiveByUserId(int userId) {
        Optional<List<LiveScrap>> scrapLiveListOptional = liveScrapRepository.findByUser_userId(userId);
        if (scrapLiveListOptional.isEmpty()) {
            return Optional.empty();
        }
        List<LiveScrap> scrapLiveList = scrapLiveListOptional.get();
        List<Map<String, Object>> userScrapLiveList = new ArrayList<>();

        for (LiveScrap liveScrap : scrapLiveList) {
            Map<String, Object> scrapLiveResult = new HashMap<>();
            Optional<Live> scrapLiveOptional = liveRepository.findByLiveId(liveScrap.getLive().getLiveId());

            // Optional이 비어 있지 않으면 값을 가져와서 처리
            scrapLiveOptional.ifPresent(scrapLive -> {
                scrapLiveResult.put("title", scrapLive.getTitle());
                scrapLiveResult.put("seller_id", scrapLive.getSeller().getUserId());
                scrapLiveResult.put("live_date", scrapLive.getLiveDate());
                scrapLiveResult.put("is_live", scrapLive.getIsLive());
                scrapLiveResult.put("live_thumbnail", scrapLive.getLiveThumbnail());
                scrapLiveResult.put("trade_place", scrapLive.getTradePlace());
                scrapLiveResult.put("live_id", scrapLive.getLiveId());
            });

            userScrapLiveList.add(scrapLiveResult);
        }
        return Optional.of(userScrapLiveList);
    }

    public Optional<List<Map<String, Object>>> getUserScrapShortsByUserId(int userId) {
        Optional<List<ShortsScrap>> scrapShortsOptional = shortsScrapRepository.findByUser_userId(userId);
        if (scrapShortsOptional.isEmpty()) {
            return Optional.empty();
        }
        List<ShortsScrap> scrapLiveList = scrapShortsOptional.get();
        List<Map<String, Object>> userScrapShortList = new ArrayList<>();

        for (ShortsScrap shortsScrap : scrapLiveList) {
            Map<String, Object> shortsResult = new HashMap<>();
            Optional<Shorts> scrapShortsList = shortsRepository.findByShortsId(shortsScrap.getShorts().getShortsId());
            scrapShortsList.ifPresent(scrapShorts -> {
                shortsResult.put("length", scrapShorts.getLength());
                shortsResult.put(("product_id"), scrapShorts.getProduct().getProductId());
                shortsResult.put(("shorts_id"), scrapShorts.getShortsId());
                shortsResult.put(("upload_date"), scrapShorts.getUploadDate());
                shortsResult.put(("shorts_thumbnail"), scrapShorts.getShortsThumbnail());
                shortsResult.put("video_address", scrapShorts.getVideoAddress());
            });
            userScrapShortList.add(shortsResult);
        }
        return Optional.of(userScrapShortList);
    }

    public void addUserExtraInfo(Map<String, Object> extraInfo, String email) {
        Optional<User> findUser = userRepository.findByEmail(email);
        if (findUser.isPresent()) {
            User user = User.builder()
                    .nickname(extraInfo.get("nickname").toString())
                    .phone(extraInfo.get("phone").toString())
                    .build();
            userRepository.save(user);
        }
    }

    public void addUserRegion(int userId, Map<String, Object> region) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            String sido = region.get("sido").toString();
            String gugun = region.get("gugun").toString();
            String eupmyeon = region.get("eupmyeon") != null ? region.get("eupmyeon").toString() : null;
            String li = region.get("li") != null ? region.get("li").toString() : null;

            Optional<RegionInfo> findRegionInfo = regionInfoRepository.findBySidoAndGugunAndEupmyeonAndLi(sido, gugun, eupmyeon, li);
            if (findRegionInfo.isPresent()) {
                RegionInfo regionInfo = findRegionInfo.get();

                // UserRegion 객체 생성 시 User와 RegionInfo 객체를 직접 할당
                UserRegion addUserRegion = UserRegion.builder()
                        .user(user.get())
                        .region(regionInfo)
                        .build();

                userRegionRepository.save(addUserRegion);
            }
        }
    }

    public void updateUserRegion(int userId, Map<String, Object> newRegion, Map<String, Object> deleteRegion) {
        try {
            Optional<UserRegion> findUser = userRegionRepository.findByUser_userIdAndRegion_RegionCode(userId, (String) deleteRegion.get("region_code"));
            Optional<User> user = userRepository.findById(userId);
            if (findUser.isPresent()) {
                String sido = newRegion.get("sido").toString();
                String gugun = newRegion.get("gugun").toString();
                String eupmyeon = newRegion.get("eupmyeon") != null ? newRegion.get("eupmyeon").toString() : null;
                String li = newRegion.get("li") != null ? newRegion.get("li").toString() : null;

                Optional<RegionInfo> findRegionInfo = regionInfoRepository.findBySidoAndGugunAndEupmyeonAndLi(sido, gugun, eupmyeon, li);
                if (findRegionInfo.isPresent()) {
                    RegionInfo regionInfo = findRegionInfo.get();

                    UserRegion updateUserRegion = UserRegion.builder()
                            .user(user.get())
                            .region(regionInfo)
                            .build();

                    userRegionRepository.save(updateUserRegion);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public void addUserLiveScrap(int userId, int liveId) {
        try {
            Optional<User> findUser = userRepository.findById(userId);
            if (findUser.isPresent()) {
                Optional<Live> findLive = liveRepository.findById(liveId);
                if (findLive.isPresent()) {
                    LiveScrap liveScrap = LiveScrap.builder()
                            .user(findUser.get())
                            .live(findLive.get())
                            .build();
                    liveScrapRepository.save(liveScrap);
                } else {
                    throw new IllegalArgumentException("Cannot find live");
                }
            } else {
                throw new IllegalArgumentException("Cannot find user");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteUserLivewScrap(int userId, int liveId) {
        try {
            Optional<LiveScrap> findLiveScrap = liveScrapRepository.findByUser_userIdAndLive_liveId(userId, liveId);
            if (findLiveScrap.isPresent()) {
                liveScrapRepository.delete(findLiveScrap.get());
            } else {
                throw new IllegalArgumentException("Cannot find live scrap");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public Live getUserCommerLiveDetails(int userId, int liveId) {
        try {
            Optional<Live> findLive = liveRepository.findByLiveIdAndSeller_userId(liveId, userId);
            // Optional이 비어 있을 경우 예외를 던짐
            return findLive.orElseThrow(() -> new RuntimeException("Live not found for userId: " + userId + ", liveId: " + liveId));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<Map<String, Object>> getUserShortsListByUserId(int userId) {
        Optional<List<Shorts>> shortsOptional = shortsRepository.findByUser_userId(userId);
        List<Map<String, Object>> shrotsList = new ArrayList<>();
        if (shortsOptional.isPresent()) {
            for (Shorts shorts : shortsOptional.get()) {
                Map<String, Object> shortsMap = new HashMap<>();

                shortsMap.put("short_id", shorts.getShortsId());
                shortsMap.put("name", shorts.getProduct().getName());
                shortsMap.put("price", shorts.getProduct().getPrice());
                shortsMap.put("trade_place", shorts.getProduct().getLive().getTradePlace());
                shortsMap.put("length", shorts.getLength());
                shortsMap.put("video_address", shorts.getVideoAddress());
                shortsMap.put("user_id", shorts.getUser().getUserId());
                shrotsList.add(shortsMap);
            }

        }
        else {
            throw new IllegalArgumentException("Cannot find short list");
        }
        return shrotsList;
    }

    public Optional<List<Map<String, Object>>> getUserInfoByLiveId(int liveId){
        Optional<List<LiveScrap>> findLiveScrapList = liveScrapRepository.findByLive_liveId(liveId);
        List<Map<String , Object>> userInfoList = new ArrayList<>();
        if (findLiveScrapList.isPresent()) {
            for (LiveScrap liveScrap : findLiveScrapList.get()) {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("user_id", liveScrap.getUser().getUserId());
                userMap.put("user_nickname", liveScrap.getUser().getNickname());
                userMap.put("profile_picture", liveScrap.getUser().getProfilePicture());
                userMap.put("level", liveScrap.getUser().getLevel());
                userInfoList.add(userMap);
            }
            return Optional.of(userInfoList);
        }
        else {
            throw new IllegalArgumentException("Cannot find live scrap");
        }
    }
}
