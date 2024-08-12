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

    private final TradeRepository tradeRepository;
    private final LiveScrapRepository liveScrapRepository;

    public Slice<MainLiveResponse> getMainLiveListByRegionCode(int userId, List<UserRegion> findUserRegionList) {
        Pageable pageable = PageRequest.of(0, 10);
        List<MainLiveResponse> mainLiveResponseList = new ArrayList<>();

        for (UserRegion userRegion : findUserRegionList) {
            String regionCode = userRegion.getRegion().getRegionCode();
            Slice<Live> livePage = liveRepository.findByRegionCodeAndIsLiveOrderByIsLiveDescLiveDateAsc(regionCode, pageable);

            for (Live live : livePage) {
                Optional<List<Product>> findProductList = productRepository.findByLive_LiveId(live.getLiveId());
                Optional<LiveScrap> findLiveScrap = liveScrapRepository.findByUser_userIdAndLive_liveId(userId, live.getLiveId());
                if (findProductList.isPresent()) {
                    boolean isScrap = false;
                    if (findLiveScrap.isPresent()) {
                        isScrap = true;
                    }
                    MainLiveResponse mainLiveResponse = MainLiveResponse.fromEntity(live, findProductList.get(), isScrap);
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
        Slice<Shorts> shortsSlice = shortsRepository.findAllByOrderByUploadDateDesc(pageable);
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

    public Slice<Map<String, Object>> getSearchResultByName(String name, int userId) {
        Pageable pageable = PageRequest.of(0, 10);

        // 1. 이름에 따른 상품 검색 (상품명에 키워드가 포함된 경우)
        Slice<Product> findProductSlice = productRepository.findByNameIgnoreCaseContaining(name, pageable);

        // 2. 카테고리 이름에 따른 상품 검색
        Slice<Product> categoryProductSlice = productRepository.findByCategoryName(name, pageable);

        // 3. 검색된 모든 상품을 합침
        Set<Product> allProducts = new HashSet<>();
        allProducts.addAll(findProductSlice.getContent());
        allProducts.addAll(categoryProductSlice.getContent());

        // 4. 각 상품에 대해 연관된 라이브와 쇼츠를 검색하여 결과를 구성
        List<ResultUpcomingResponse> upcomingResponseList = new ArrayList<>();
        List<ResultLiveResponse> liveResponseList = new ArrayList<>();
        List<ResultShortsResponse> shortsResponseList = new ArrayList<>();

        for (Product product : allProducts) {
            Live live = liveRepository.findByLiveId(product.getLive().getLiveId()).orElse(null);
            Shorts shorts = shortsRepository.findByProduct_ProductId(product.getProductId()).orElse(null);

            // 관련 라이브와 쇼츠만 필터링하여 추가
            if (live != null) {
                if (live.getIsLive() == 0) {
                    ResultUpcomingResponse upcomingResponse = ResultUpcomingResponse.fromEntity(live, product);
                    upcomingResponseList.add(upcomingResponse);
                } else if (live.getIsLive() == 1 || live.getIsLive() == 2) {
                    ResultLiveResponse liveResponse = ResultLiveResponse.fromEntity(live, product);
                    liveResponseList.add(liveResponse);
                }
            }

            if (shorts != null) {
                ResultShortsResponse shortsResponse = ResultShortsResponse.fromEntity(shorts, product, live);
                shortsResponseList.add(shortsResponse);
            }
        }

        // 5. 결과를 맵에 담아 반환
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("upcoming", upcomingResponseList);
        resultMap.put("live", liveResponseList);
        resultMap.put("shorts", shortsResponseList);

        List<Map<String, Object>> resultList = new ArrayList<>();
        resultList.add(resultMap);

        // 6. Slice로 반환 (페이지네이션 고려)
        boolean hasNext = findProductSlice.hasNext() || categoryProductSlice.hasNext();
        return new SliceImpl<>(resultList, pageable, hasNext);
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
