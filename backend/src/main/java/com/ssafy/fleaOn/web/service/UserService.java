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

    public User updateUserByEmail(String email, ExtraInfoRequest extraInfoRequest, String profilePicture) {
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
                .profilePicture(profilePicture == null ? existingUser.getProfilePicture() : profilePicture) // 프로필 사진 보존
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

            LocalDate endOfWeek = startOfWeek.plusDays(6);

            int totalTrade = tradeRepository.countByBuyerIdOrSellerIdAndTradeDateBetween(
                    userOptional.getUserId(), startOfWeek, endOfWeek)
                    + tradeDoneRepository.countTradeDateBetween(
                    userOptional.getUserId(), startOfWeek, endOfWeek);
            int saleCount = tradeRepository.countBySellerIdAndTradeDateBetween(
                    userOptional.getUserId(), startOfWeek, endOfWeek)
                    + tradeDoneRepository.countBySellerIdAndTradeDateBetween(
                    userOptional.getUserId(), startOfWeek, endOfWeek);
            int purchaseCount = tradeRepository.countByBuyerIdAndTradeDateBetween(
                    userOptional.getUserId(), startOfWeek, endOfWeek)
                    + tradeDoneRepository.countByBuyerIdAndTradeDateBetween(
                    userOptional.getUserId(), startOfWeek, endOfWeek);
            int completedTrades = tradeDoneRepository.countCompletedTrades(
                    userOptional.getUserId(), startOfWeek, endOfWeek);


            // Create WeeklyTrade list
            List<WeeklyTrade> weeklyTrades = new ArrayList<>();
            LocalDate currentDate = startOfWeek;
            while (!currentDate.isAfter(endOfWeek)) {
                int dailyCompletedTrades = tradeDoneRepository.countCompletedTrades(
                        userOptional.getUserId(), currentDate, currentDate);
                int dailyTotalTrades = tradeRepository.countTradesByUserAndDate(
                        userOptional.getUserId(), currentDate)
                        + dailyCompletedTrades;
                weeklyTrades.add(new WeeklyTrade(currentDate, dailyTotalTrades, dailyCompletedTrades));
                currentDate = currentDate.plusDays(1);
            }


            return MyPageResponse.builder()
                    .tradeInfo(new TradeCountResponse(totalTrade, saleCount, purchaseCount, completedTrades))
                    .tradeList(weeklyTrades)
                    .build();
        }
        return null;
    }

    public ScheduleResponse getUserScheduleListByUserIdAndDate(int userId, LocalDate tradeDate) {
        Optional<List<Trade>> trades = tradeRepository.findByTradeDateAndBuyerIdOrSellerId(userId, tradeDate);
        List<DayTradeResponse> tradeList = new ArrayList<>();

        if (trades.isPresent()) {
            for (Trade trade : trades.get()) {
                Product product = productRepository.findByProductId(trade.getProduct().getProductId()).orElse(null);

                DayTradeResponse dayTradeResponse = DayTradeResponse.builder()
                        .productName(product.getName())
                        .price(product.getPrice())
                        .buyerId(trade.getBuyerId())
                        .sellerId(trade.getSellerId())
                        .dongName(product.getLive().getRegionInfo().getEupmyeon())
                        .tradePlace(trade.getTradePlace())
                        .tradeTime(trade.getTradeTime())
                        .build();
                tradeList.add(dayTradeResponse);
            }
        }

        Optional<List<TradeDone>> tradeDones = tradeDoneRepository.findByTradeDateAndBuyerIdOrSellerId(userId, tradeDate);
        List<TradeDoneSchedule> tradeDoneSchedules = new ArrayList<>();
        if (tradeDones.isPresent()) {
            for (TradeDone tradeDone : tradeDones.get()) {
                TradeDoneSchedule tradeDoneSchedule= TradeDoneSchedule.builder()
                        .productId(tradeDone.getProductId())
                        .productName(tradeDone.getProductName())
                        .productPrice(tradeDone.getProductPrice())
                        .buyerId(tradeDone.getBuyer().getUserId())
                        .sellerId(tradeDone.getSeller().getUserId())
                        .tradePlace(tradeDone.getTradePlace())
                        .tradeTime(tradeDone.getTradeTime())
                        .tradeDate(tradeDate)
                        .build();
                tradeDoneSchedules.add(tradeDoneSchedule);
            }
        }

        return new ScheduleResponse(tradeList,tradeDoneSchedules);
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
                        .dongName(trade.getLive().getRegionInfo().getEupmyeon())
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


    public List<ReservationListResponse> getUserReservationListByUserId(int userId) {
        Optional<List<Reservation>> reservationOptional = reservationRepository.findByUser_userId(userId);

        // tradesOptional이 비어 있으면 Optional.empty() 반환
        if (reservationOptional.isEmpty()) {
            return null;
        }
        List<Reservation> findReservationList = reservationOptional.get();
        List<ReservationListResponse> reservationList = new ArrayList<>();

        for (Reservation reservation : findReservationList) {
            Product product = productRepository.findByProductId(reservation.getProduct().getProductId()).orElse(null);

            ReservationListResponse reservationListResponse = ReservationListResponse.builder()
                    .productId(product.getProductId())
                    .productName(product.getName())
                    .productPrice(product.getPrice())
                    .liveId(product.getLive().getLiveId())
                    .dongName(product.getLive().getRegionInfo().getEupmyeon())
                    .build();

            reservationList.add(reservationListResponse);
        }

        return reservationList;
    }

    public List<LiveListResponse> getUserCommerceLiveListByUserId(int userId) {
        List<Live> commerceLiveList = liveRepository.findBySeller_userId(userId).orElseThrow(()-> new IllegalArgumentException("Invalid user ID: " + userId));
        List<LiveListResponse> userCommerceLiveList = new ArrayList<>();

        for (Live live : commerceLiveList) {
            Optional<Live> commerceLiveOptional = liveRepository.findById(live.getLiveId());

            // Optional이 비어 있지 않으면 값을 가져와서 처리
            commerceLiveOptional.ifPresent(commerceLive -> {
                LiveListResponse liveListResponse = LiveListResponse.builder()
                        .title(commerceLive.getTitle())
                        .liveDate(commerceLive.getLiveDate())
                        .dongName(commerceLive.getRegionInfo().getEupmyeon())
                        .isLive(commerceLive.getIsLive())
                        .liveId(commerceLive.getLiveId())
                        .build();
                userCommerceLiveList.add(liveListResponse);
            });
        }

        return userCommerceLiveList;
    }

    public List<ScrapLiveResponse> getUserScrapLiveByUserId(int userId) {
        Optional<List<LiveScrap>> scrapLiveListOptional = liveScrapRepository.findByUser_userId(userId);
        if (scrapLiveListOptional.isEmpty()) {
            return null;
        }
        List<LiveScrap> scrapLiveList = scrapLiveListOptional.get();
        List<ScrapLiveResponse> userScrapLiveList = new ArrayList<>();

        for (LiveScrap liveScrap : scrapLiveList) {
            Optional<Live> scrapLiveOptional = liveRepository.findByLiveId(liveScrap.getLive().getLiveId());

            // Optional이 비어 있지 않으면 값을 가져와서 처리
            scrapLiveOptional.ifPresent(scrapLive -> {
                ScrapLiveResponse scrapLiveResponse = ScrapLiveResponse.builder()
                        .title(scrapLive.getTitle())
                        .sellerId(scrapLive.getSeller().getUserId())
                        .isLive(scrapLive.getIsLive())
                        .thumbnail(scrapLive.getLiveThumbnail())
                        .liveDate(scrapLive.getLiveDate())
                        .dongName(scrapLive.getRegionInfo().getEupmyeon())
                        .liveId(scrapLive.getLiveId())
                        .build();

                userScrapLiveList.add(scrapLiveResponse);
            });

        }
        return userScrapLiveList;
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
                    .dongName(findLive.get().getRegionInfo().getEupmyeon())
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
        Optional<Live> findLive = liveRepository.findBySeller_userIdAndIsLiveAndLiveDateGreaterThanEqual(userId, 0, currentTime);
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
