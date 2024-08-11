package com.ssafy.fleaOn.web.service;


import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.*;
import com.ssafy.fleaOn.web.repository.*;
import com.ssafy.fleaOn.web.util.DateUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

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
    private final TradeDoneRepository tradeDoneRepository;

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

    public User updateUserByEmail(String email, ExtraInfoRequest extraInfoRequest) {
        // 이메일로 사용자 검색
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // 사용자 존재 여부 확인 및 Optional 안전 처리
        if (!optionalUser.isPresent()) {
            return null;
        }

        // 기존 유저 객체 가져오기
        User existingUser = optionalUser.get();

        // 기존 객체를 기반으로 업데이트
        User updatedUser = User.builder()
                .userId(existingUser.getUserId()) // 기존 ID를 명시적으로 보존
                .email(existingUser.getEmail()) // 이메일 보존
                .name(existingUser.getName()) // 기존 이름 보존
                .nickname(extraInfoRequest.getNickname() == null ? existingUser.getNickname() : extraInfoRequest.getNickname())// 닉네임 업데이트
                .phone(extraInfoRequest.getPhone() == null ? existingUser.getPhone() : extraInfoRequest.getPhone()) // 전화번호 업데이트
//                .profilePicture(extraInfoRequest.getProfilePicture() == null ? existingUser.getProfilePicture() : extraInfoRequest.getProfilePicture()) // 프로필 사진 보존
                .level(existingUser.getLevel())
                .role(existingUser.getRole())
                .userIdentifier(existingUser.getUserIdentifier())// 레벨 보존
                .build();

        // 업데이트된 유저 정보 저장
        userRepository.save(updatedUser);
        return updatedUser;
    }
    public UserFullInfoResponse getUserFullInfoByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Optional<List<UserRegion>> userRegionListOptional = userRegionRepository.findByUser_userId(user.getUserId());
            List<String> eupmyeonList = new ArrayList<>();
            List<String> regionCodes = new ArrayList<>();

            if (userRegionListOptional.isPresent()) {
                List<UserRegion> userRegionList = userRegionListOptional.get();

                for (UserRegion userRegion : userRegionList) {
                    // regionCode 리스트 생성
                    String regionCode = userRegion.getRegion().getRegionCode();
                    regionCodes.add(regionCode);

                    // regionCode에 해당하는 Eupmyeon 가져오기
                    String eupmyeon = userRegion.getRegion().getEupmyeon();
                    eupmyeonList.add(eupmyeon);
                }
            }

            // UserFullInfoResponse 객체 생성 및 반환
            return UserFullInfoResponse.builder()
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .profilePicture(user.getProfilePicture())
                    .name(user.getName())
                    .nickname(user.getNickname())
                    .phone(user.getPhone())
                    .level(user.getLevel())
                    .dongName(eupmyeonList)  // Eupmyeon 리스트 추가
                    .regionCode(regionCodes) // regionCodes 추가
                    .build();
        }

        return null; // 또는 Optional<UserFullInfoResponse>를 반환하여 empty()로 반환
    }

    public MyPageResponse getUserPageByEmail(String email, LocalDate startOfWeek) {
        User userOptional = userRepository.findByEmail(email).orElseThrow(()->new IllegalArgumentException("User not found with email: " + email));

        Optional<List<UserRegion>> userRegionListOptional = userRegionRepository.findByUser_userId(userOptional.getUserId());
        if (userRegionListOptional.isPresent()) {
            List<String> userRegionCodes = new ArrayList<>();
            for (UserRegion userRegion : userRegionListOptional.get()) {
                userRegionCodes.add(userRegion.getRegion().getRegionCode());
            }

            LocalDate endOfWeek = startOfWeek.plusDays(6);

            int totalTrade = tradeRepository.countByBuyerIdOrSellerIdAndTradeDateBetween(
                    userOptional.getUserId(), startOfWeek, endOfWeek);
            int saleCount = tradeRepository.countBySellerIdAndTradeDateBetween(
                    userOptional.getUserId(), startOfWeek, endOfWeek);
            int purchaseCount = tradeRepository.countByBuyerIdAndTradeDateBetween(
                    userOptional.getUserId(), startOfWeek, endOfWeek);
            int completedTrades = tradeDoneRepository.countCompletedTrades(
                    userOptional.getUserId(), startOfWeek, endOfWeek);


            // Create WeeklyTrade list
            List<WeeklyTrade> weeklyTrades = new ArrayList<>();
            LocalDate currentDate = startOfWeek;
            while (!currentDate.isAfter(endOfWeek)) {
                int dailyTotalTrades = tradeRepository.countTradesByUserAndDate(
                        userOptional.getUserId(), currentDate);
                int dailyCompletedTrades = tradeDoneRepository.countCompletedTrades(
                        userOptional.getUserId(), currentDate, currentDate);
                weeklyTrades.add(new WeeklyTrade(currentDate, dailyTotalTrades, dailyCompletedTrades));
                currentDate = currentDate.plusDays(1);
            }


            MyPageResponse myPageResponse = MyPageResponse.builder()
                    .nickName(userOptional.getNickname())
                    .level(userOptional.getLevel())
                    .profilePicture(userOptional.getProfilePicture())
                    .regionCode(userRegionCodes)
                    .tradeInfo(new TradeCountResponse(totalTrade, saleCount, purchaseCount, completedTrades))
                    .tradeList(weeklyTrades)
                    .build();

            return myPageResponse;
        }
        return null;
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
            Optional<Product> productOptional = productRepository.findByProductId(trade.getProduct().getProductId());

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


    public PurchaseListResponse getUserPurchaseListByUserId(int userId) {
        List<PurchaseResponse> purchaseResponseList = new ArrayList<>();
        List<TradeDoneResponse> tradeDoneLists = new ArrayList<>();

        Optional<List<Trade>> findTrades = tradeRepository.findByBuyerId(userId);
        if (findTrades.isPresent()) {
            for (Trade trade : findTrades.get()) {
                Optional<Product> findProduct = productRepository.findByProductId(trade.getProduct().getProductId());
                Optional<TradeDone> findTradeDone = tradeDoneRepository.findByProductId(trade.getProduct().getProductId());
                boolean isDone = findTradeDone.isPresent();
                ZonedDateTime zonedDateTime = ZonedDateTime.of(trade.getTradeDate(), trade.getTradeTime(), ZoneId.systemDefault());

                PurchaseResponse purchaseResponse = PurchaseResponse.builder()
                        .productId(findProduct.get().getProductId())
                        .productName(findProduct.get().getName())
                        .productPrice(findProduct.get().getPrice())
                        .liveId(trade.getLive().getLiveId())
                        .tradePlace(trade.getTradePlace())
                        .tradeTime(zonedDateTime.toLocalTime())
                        .tradeDate(zonedDateTime.toLocalDate())
                        .isTradeDone(isDone)
                        .build();
                purchaseResponseList.add(purchaseResponse);
            }
        }

        Optional<List<TradeDone>> findTradeDone = tradeDoneRepository.findByBuyer_UserId(userId);
        if (findTradeDone.isPresent()) {
            for (TradeDone tradeDone : findTradeDone.get()){
                TradeDoneResponse tradeDoneResponse = TradeDoneResponse.builder()
                        .productId(tradeDone.getProductId())
                        .productName(tradeDone.getProductName())
                        .productPrice(tradeDone.getProductPrice())
                        .tradePlace(tradeDone.getTradePlace())
                        .tradeDate(tradeDone.getTradeDate())
                        .tradeTime(tradeDone.getTradeTime())
                        .build();

                tradeDoneLists.add(tradeDoneResponse);
            }
        }

        PurchaseListResponse purchaseListResponse = PurchaseListResponse.builder()
                .purchases(purchaseResponseList)
                .tradeDoneResponses(tradeDoneLists)
                .build();

        return purchaseListResponse;
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

    public Optional<List<ScrapShortsResponse>> getUserScrapShortsByUserId(int userId) {
        Optional<List<ShortsScrap>> scrapShortsOptional = shortsScrapRepository.findByUser_userId(userId);
        if (scrapShortsOptional.isEmpty()) {
            return Optional.empty();
        }
        List<ScrapShortsResponse> scrapShortsResponseList = new ArrayList<>();
        for (ShortsScrap shortsScrap : scrapShortsOptional.get()) {
            Optional<Shorts> findShorts = shortsRepository.findByShortsId(shortsScrap.getShorts().getShortsId());
            Optional<Product> findProduct = productRepository.findByProductId(findShorts.get().getProduct().getProductId());
            Optional<Live> findLive = liveRepository.findByLiveId(findProduct.get().getLive().getLiveId());

            ScrapShortsResponse scrapShortsResponse = ScrapShortsResponse.builder()
                    .length(findShorts.get().getLength())
                    .productId(findProduct.get().getProductId())
                    .shortsId(findShorts.get().getShortsId())
                    .uploadDate(findShorts.get().getUploadDate())
                    .shortsThumbnail(findShorts.get().getShortsThumbnail())
                    .videoAddress(findShorts.get().getVideoAddress())
                    .productPrice(findProduct.get().getPrice())
                    .productName(findProduct.get().getName())
                    .tradePlace(findLive.get().getTradePlace())
                    .build();

            scrapShortsResponseList.add(scrapShortsResponse);
        }
        return Optional.of(scrapShortsResponseList);
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

    @Transactional
    public void addUserRegion(int userId, String regionCode) {
        Optional<User> user = userRepository.findByUserId(userId);
        if (user.isPresent()) {
            Optional<RegionInfo> regionInfo = regionInfoRepository.findByRegionCode(regionCode);
            if (regionInfo.isPresent()) {
                UserRegion userRegion = UserRegion.builder()
                        .user(user.get())
                        .region(regionInfo.get())
                        .build();
                userRegionRepository.save(userRegion);
                System.out.println("Saved user region: " + userRegion);
            } else {
                System.out.println("Region info not found for code: " + regionCode);
            }
        } else {
            System.out.println("User not found for id: " + userId);
        }
    }

    public UserRegion getUserRegion(int userId,String regionCode) {
        Optional<UserRegion> userRegion = userRegionRepository.findByUser_userIdAndRegion_RegionCode(userId, regionCode);
        return userRegion.get();
    }

    @Transactional
    public void deleteUserRegion(int userId, String regionCode) {
        Optional<UserRegion> findUserReion = userRegionRepository.findByUser_userIdAndRegion_RegionCode(userId, regionCode);
        if (findUserReion.isPresent()) {
            userRegionRepository.delete(findUserReion.get());
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

    public SalesShortsListResponse getUserShortsListByUserId(int userId) {
        User findUser = userRepository.findByUserId(userId).orElseThrow(()->new RuntimeException("User not found for userId: " + userId));
        Optional<List<Shorts>> shortsList = shortsRepository.findByUser_userId(findUser.getUserId());

        List<SellingShortsResponse> sellingShortsResponseList = new ArrayList<>();
        List<TradeDoneResponse> tradeDoneLists = new ArrayList<>();

        if (shortsList.isPresent()) {
            for (Shorts shorts : shortsList.get()) {
                Product findProduct= productRepository.findByProductId(shorts.getProduct().getProductId()).orElseThrow(()->new RuntimeException("Product not found for productId: " + shorts.getProduct().getProductId()));
                Live findLive = liveRepository.findByLiveId(findProduct.getLive().getLiveId()).orElseThrow(()->new RuntimeException("Live not found for liveId: " + findProduct.getLive().getLiveId()));
                String dong = findLive.getRegionInfo().getEupmyeon();
                // shorts의 productId가 trade 테이블에 존재하는지 확인
                boolean isTradeNow = tradeRepository.findByProductId(findProduct.getProductId()).isPresent();

                SellingShortsResponse sellingShortsResponse = SellingShortsResponse.builder()
                        .productId(findProduct.getProductId())
                        .shortsId(shorts.getShortsId())
                        .productName(findProduct.getName())
                        .productPrice(findProduct.getPrice())
                        .dongName(dong)
                        .liveDate(findLive.getLiveDate())
                        .tradeNow(isTradeNow)
                        .build();

                sellingShortsResponseList.add(sellingShortsResponse);
            }
        }

        Optional<List<TradeDone>> findTradeDone = tradeDoneRepository.findBySeller_UserId(userId);
        if (findTradeDone.isPresent()) {
            for (TradeDone tradeDone : findTradeDone.get()){
                TradeDoneResponse tradeDoneResponse = TradeDoneResponse.builder()
                        .productId(tradeDone.getProductId())
                        .productName(tradeDone.getProductName())
                        .productPrice(tradeDone.getProductPrice())
                        .tradePlace(tradeDone.getTradePlace())
                        .tradeDate(tradeDone.getTradeDate())
                        .tradeTime(tradeDone.getTradeTime())
                        .build();

                tradeDoneLists.add(tradeDoneResponse);
            }
        }

        SalesShortsListResponse salesShortsResponse = SalesShortsListResponse.builder()
                .sellingShortsResponses(sellingShortsResponseList)
                .tradeDoneLists(tradeDoneLists)
                .build();
        return salesShortsResponse;
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
    public CommerceLiveExpectedResponse getUserCommerceLiveExpectedByUserId(int userId){
        LocalDateTime currentTime = LocalDateTime.now();
        Optional<Live> findLive = liveRepository.findBySeller_userIdAndIsLiveAndLiveDateLessThanEqual(userId, 0, currentTime);
        if (findLive.isPresent()) {
            CommerceLiveExpectedResponse commerceLiveExpectedResponse = CommerceLiveExpectedResponse.builder()
                    .liveId(findLive.get().getLiveId())
                    .isExist(true)
                    .build();
            return commerceLiveExpectedResponse;
        }
        CommerceLiveExpectedResponse commerceLiveExpectedResponse = CommerceLiveExpectedResponse.builder()
                .liveId(0)
                .isExist(false)
                .build();
        return commerceLiveExpectedResponse;
    }

    public User updateFcmToken(User user, String fcmToken) {
        user.updateFcm(fcmToken);
        userRepository.save(user);
        return user;
    }
}
