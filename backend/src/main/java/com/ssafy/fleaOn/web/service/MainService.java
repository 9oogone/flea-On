package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.*;
import com.ssafy.fleaOn.web.repository.*;
import com.sun.tools.javac.Main;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class MainService {

    private final LiveRepository liveRepository;

    private final ShortsRepository shortsRepository;

    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    private final RegionInfoRepository regionInfoRepository;

    private final UserRegionRepository userRegionRepository;

    public Slice<MainLiveResponse> getMainLiveListByRegionCode(List<UserRegion> findUserRegionList, LocalDateTime currentTime) {
        Pageable pageable = PageRequest.of(0, 10);
        List<MainLiveResponse> mainLiveResponseList = new ArrayList<>();

        for (UserRegion userRegion : findUserRegionList) {
            String regionCode = userRegion.getRegion().getRegionCode();
            System.out.println("코드요 : " + regionCode);

            Slice<Live> livePage = liveRepository.findByRegionInfo_RegionCodeAndLiveDateGreaterThanEqual(regionCode, currentTime, pageable);

            for (Live live : livePage) {
                Optional<List<Product>> findProductList = productRepository.findByLive_LiveId(live.getLiveId());
                if (findProductList.isPresent()) {
                    MainLiveResponse mainLiveResponse = MainLiveResponse.fromEntity(live, findProductList.get());
                    mainLiveResponseList.add(mainLiveResponse);
                }
            }
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), mainLiveResponseList.size());
        boolean hasNext = mainLiveResponseList.size() > end;
        List<MainLiveResponse> content = mainLiveResponseList.subList(start, end);

        return new SliceImpl<>(content, pageable, hasNext);
    }

    public List<UserRegion> getUserRegionByUserId(int userId) {
        Optional<List<UserRegion>> userRegionList = userRegionRepository.findByUser_userId(userId);
        return Optional.ofNullable(userRegionList.get()).orElse(Collections.emptyList());
    }

    public Slice<MainShortsResponse> getMainShortsListByUploadDate() {
        Pageable pageable = PageRequest.of(0, 10);
        List<MainShortsResponse> mainShortsResponseList = new ArrayList<>();

        // Shorts 데이터 가져오기 (Slice로)
        Slice<Shorts> shortsSlice = shortsRepository.findAllByOrderByUploadDateAsc(pageable);
        for (Shorts shorts : shortsSlice) {
            Optional<Product> product = productRepository.findByProductId(shorts.getProduct().getProductId());
            Optional<Live> live = liveRepository.findByLiveId(product.get().getLive().getLiveId());

            if (product.isPresent() && live.isPresent()) {
                MainShortsResponse mainShortsResponse = MainShortsResponse.fromEntity(shorts, product.get(), live.get());
                mainShortsResponseList.add(mainShortsResponse);
            }
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), mainShortsResponseList.size());
        boolean hasNext = mainShortsResponseList.size() > end;
        List<MainShortsResponse> content = mainShortsResponseList.subList(start, end);

        return new SliceImpl<>(content, pageable, hasNext);
    }

    public Optional<List<Category>> getMainCategoryList() {
        return Optional.of(categoryRepository.findAll());
    }

    public Slice<List<Map<String, Object>>> getSearchResultByName(String name, int userId) {
        Pageable pageable = PageRequest.of(0, 10);

        // findProductByName을 사용하여 Product를 찾습니다.
        Optional<List<Product>> findProduct = productRepository.findByNameIgnoreCaseContaining(name);

        if (!findProduct.isPresent() || findProduct.get().isEmpty()) {
            // Optional이 비어있거나 리스트가 비어있는 경우 빈 Slice 반환
            return new SliceImpl<>(Collections.emptyList(), pageable, false);
        }

        Optional<List<Category>> findCategory = categoryRepository.findAllByFirstCategoryNameOrSecondCategoryName(name, name);
        // 이름과 카테고리를 기반으로 검색
        Slice<Product> searchResultResponseSlice = productRepository.findByNameContainingOrFirstCategoryIdAndSecondCategoryId(
                name, findProduct.get().get(0).getFirstCategoryId(), findProduct.get().get(0).getSecondCategoryId(), pageable);

        List<Map<String, Object>> resultLiveMapList = new ArrayList<>();
        List<Map<String, Object>> resultUpcomingMapLlist = new ArrayList<>();
        List<Map<String, Object>> resultShortsMapList = new ArrayList<>();

        List<List<Map<String, Object>>> resultList = new ArrayList<>();

        // 검색 결과를 순회하며 필요한 데이터를 추출합니다.
        for (Product product : searchResultResponseSlice) {
            Optional<List<Live>> live = liveRepository.findAllByLiveId(product.getLive().getLiveId());
            Optional<List<Shorts>> shorts = shortsRepository.findAllByShortsId(product.getShorts().getShortsId());

            if (live.isPresent()) {
                for (Live findLive : live.get()) {
                    if (findLive.getIsLive() == 0) {
                        Map<String, Object> upcomingMap = new HashMap<>();

                        // UPCOMING 정보를 담을 Map 생성
                        upcomingMap.put("live_id", findLive.getLiveId());
                        upcomingMap.put("name", product.getName());
                        upcomingMap.put("price", product.getPrice());
                        upcomingMap.put("live_date", findLive.getLiveDate());
                        upcomingMap.put("title", findLive.getTitle());

                        resultUpcomingMapLlist.add(upcomingMap);
                    }
                }

                for (Live findLive : live.get()) {
                    if (findLive.getIsLive() == 1) {

                        Map<String, Object> liveMap = new HashMap<>();
                        // LIVE 정보를 담을 Map 생성
                        liveMap.put("live_id", findLive.getLiveId());
                        liveMap.put("name", product.getName());
                        liveMap.put("price", product.getPrice());
                        liveMap.put("title", findLive.getTitle());
                        liveMap.put("tradePlace", findLive.getTradePlace());
                        liveMap.put("live_thumbnail", findLive.getLiveThumbnail());

                        resultLiveMapList.add(liveMap);
                    }

                }
            }

            if (shorts.isPresent()) {
                for (int i = 0; i < shorts.get().size(); i++) {
                    Shorts findShorts = shorts.get().get(i);
                    Map<String, Object> shortsMap = new HashMap<>();

                    // shortsMap 정보를 담을 Map 생성
                    shortsMap.put("shorts_id", findShorts.getShortsId());
                    shortsMap.put("name", product.getName());
                    shortsMap.put("price", product.getPrice());
                    shortsMap.put("trade_place", live.isPresent() && live.get().size() > i ? live.get().get(i).getTradePlace() : null);
                    shortsMap.put("length", findShorts.getLength());
                    shortsMap.put("shorts_thumbnail", findShorts.getShortsThumbnail());

                    // scrap 데이터 확인 로직 추가
                    Set<ShortsScrap> shortsScrapSet = findShorts.getShortsScrapSet();
                    boolean isScrap = shortsScrapSet.stream()
                            .anyMatch(scrap -> scrap.getUser().getUserId() == userId && scrap.getShorts().getShortsId() == findShorts.getShortsId());

                    shortsMap.put("is_scrap", isScrap);
                    resultShortsMapList.add(shortsMap);
                }
            }

        }
        resultList.add(resultUpcomingMapLlist);
        resultList.add(resultLiveMapList);
        resultList.add(resultShortsMapList);

        Slice<List<Map<String, Object>>> resultSlice = new SliceImpl<>(resultList, pageable, searchResultResponseSlice.hasNext());
        return resultSlice;
    }


    public List<SidoNameResponse> getSidoNameList() {
        return regionInfoRepository.findDistinctSido();
    }

    public List<GugunNameResponse> getGugunNameBySidoName(String sidoName) {
        return regionInfoRepository.findDistinctGugunBySido(sidoName);
    }

    public List<EupmyeonNameResponse> getEupmyeonNameAndRegionCodeBySidoNameAndGugunName(String sidoName, String gugunName) {
        return regionInfoRepository.findDistinctBySidoAndGugun(sidoName, gugunName);
    }
}
