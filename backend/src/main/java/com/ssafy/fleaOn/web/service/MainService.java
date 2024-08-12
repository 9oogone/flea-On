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

    public Slice<MainLiveResponse> getMainLiveListByRegionCode(int userId, List<UserRegion> findUserRegionList, LocalDateTime currentTime) {
        Pageable pageable = PageRequest.of(0, 10);
        List<MainLiveResponse> mainLiveResponseList = new ArrayList<>();

        for (UserRegion userRegion : findUserRegionList) {
            String regionCode = userRegion.getRegion().getRegionCode();
            System.out.println("코드요 : " + regionCode);

            Slice<Live> livePage = liveRepository.findByRegionInfo_RegionCodeAndLiveDateGreaterThanEqual(regionCode, currentTime, pageable);

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
        Slice<Product> findProductSlice = productRepository.findByNameIgnoreCaseContaining(name, pageable);

        List<ResultUpcomingResponse> upcomingResponseList = new ArrayList<>();
        List<ResultLiveResponse> liveResponseList = new ArrayList<>();
        List<ResultShortsResponse> shortsResponseList = new ArrayList<>();

        for (Product product : findProductSlice) {
            Live live = liveRepository.findByLiveId(product.getLive().getLiveId()).orElse(null);
            Shorts shorts = shortsRepository.findByProduct_ProductId(product.getProductId()).orElse(null);

            if (live != null && shorts != null) {
                if (live.getIsLive() == 0) {
                    ResultUpcomingResponse upcomingResponse = ResultUpcomingResponse.fromEntity(live, product);
                    upcomingResponseList.add(upcomingResponse);
                } else if (live.getIsLive() == 1) {
                    ResultLiveResponse liveResponse = ResultLiveResponse.fromEntity(live, product);
                    liveResponseList.add(liveResponse);
                }
                ResultShortsResponse shortsResponse = ResultShortsResponse.fromEntity(shorts, product, live);
                shortsResponseList.add(shortsResponse);
            }
        }

        Slice<Category> categorySlice = categoryRepository.findByFirstCategoryNameContainingOrSecondCategoryNameContaining(name, name, pageable);
        for (Category category : categorySlice) {
            Slice<Product> findCategoryProductSlice = productRepository.findByFirstCategoryIdOrSecondCategoryId(category.getFirstCategoryId(), category.getSecondCategoryId(), pageable);
            for (Product product : findCategoryProductSlice) {
                Live live = liveRepository.findByLiveId(product.getLive().getLiveId()).orElse(null);
                Shorts shorts = shortsRepository.findByProduct_ProductId(product.getProductId()).orElse(null);

                if (live != null && shorts != null) {
                    if (live.getIsLive() == 0) {
                        ResultUpcomingResponse upcomingResponse = ResultUpcomingResponse.fromEntity(live, product);
                        upcomingResponseList.add(upcomingResponse);
                    } else if (live.getIsLive() == 1) {
                        ResultLiveResponse liveResponse = ResultLiveResponse.fromEntity(live, product);
                        liveResponseList.add(liveResponse);
                    }
                    ResultShortsResponse shortsResponse = ResultShortsResponse.fromEntity(shorts, product, live);
                    shortsResponseList.add(shortsResponse);
                }
            }
        }

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("upcoming", upcomingResponseList);
        resultMap.put("live", liveResponseList);
        resultMap.put("shorts", shortsResponseList);

        List<Map<String, Object>> resultList = new ArrayList<>();
        resultList.add(resultMap);

        // Slice로 반환
        return new SliceImpl<>(resultList, pageable, findProductSlice.hasNext() || categorySlice.hasNext());
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
