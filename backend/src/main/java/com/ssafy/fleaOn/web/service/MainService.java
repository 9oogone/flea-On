package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.*;
import com.ssafy.fleaOn.web.repository.*;
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

    public Slice<Live> getMainLiveListByLiveDate(LocalDateTime liveDate) {
        Pageable pageable = PageRequest.of(0, 10);
        return liveRepository.findAllByOrderByIsLiveDescLiveDateAsc(pageable);
    }

//    public Slice<MainLiveResponse> getMainLiveListByRegionCode(List<UserRegion> findUserRegionList){
//        Pageable pageable = PageRequest.of(0, 10);
//        List<MainLiveResponse> mainLiveResponseList = new ArrayList<>();
//
//        for(UserRegion userRegion : findUserRegionList){
//            String regionCode = userRegion.getRegion().getRegionCode();
//
//            List<Live> findLiveList = liveRepository.findByRegionCode
//
//        }
//    }

    public List<UserRegion> getUserRegionByUserId(int userId){
        Optional<List<UserRegion>> userRegionList = userRegionRepository.findByUser_userId(userId);
        return Optional.ofNullable(userRegionList.get()).orElse(Collections.emptyList());
    }

    public Slice<MainShortsResponse> getMainShortsListByUploadDate() {
        Pageable pageable = PageRequest.of(0, 10);

        // Shorts 데이터 가져오기 (Slice로)
        Slice<Shorts> shortsSlice = shortsRepository.findAllByOrderByUploadDateAsc(pageable);

        // Shorts 데이터를 DTO로 변환
        List<MainShortsResponse> shortsResponsesList = shortsSlice.map(shorts -> {
            Product product = shorts.getProduct();
            Live live = product.getLive();

            return new MainShortsResponse(
                    shorts.getShortsId(),
                    shorts.getUploadDate(),
                    product.getName(),
                    product.getPrice(),
                    live.getTradePlace(),
                    shorts.getShortsThumbnail()
            );
        }).getContent();

        // Slice 형태로 반환
        return new SliceImpl<>(shortsResponsesList, pageable, shortsSlice.hasNext());
    }

    public Optional<List<Category>> getMainCategoryList() {
        return Optional.of(categoryRepository.findAll());
    }

    public Slice<Map<String, Object>> getSearchResultByName(String name, int userId) {
        Pageable pageable = PageRequest.of(0, 10);

        int findFirstCategory = -1;
        int findSecondCategory = -1;

        // findProductByName을 사용하여 Product를 찾습니다.
        Optional<Product> findProduct = productRepository.findProductByName(name);

        findFirstCategory = categoryRepository.findByFirstCategoryId(findProduct.get().getFirstCategoryId());
        findSecondCategory = categoryRepository.findBySecondCategoryId(findProduct.get().getSecondCategoryId());

        // 이름과 카테고리를 기반으로 검색
        Slice<Product> searchResultResponseSlice = productRepository.findByNameContainingOrFirstCategoryIdOrSecondCategoryId(
                name, findFirstCategory, findSecondCategory, pageable);

        List<Map<String, Object>> resultList = new ArrayList<>();
        // 검색 결과를 순회하며 필요한 데이터를 추출합니다.
        for (Product product : searchResultResponseSlice) {
            Map<String, Object> resultMap = new HashMap<>();
            Live live = product.getLive();
            Shorts shorts = product.getShorts();

            // UPCOMING 정보를 담을 Map 생성
            Map<String, Object> upcomingMap = new HashMap<>();
            upcomingMap.put("live_id", live.getLiveId());
            upcomingMap.put("name", product.getName());
            upcomingMap.put("price", product.getPrice());
            upcomingMap.put("live_date", live.getLiveDate());
            upcomingMap.put("title", live.getTitle());

            // LIVE 정보를 담을 Map 생성
            Map<String, Object> liveMap = new HashMap<>();
            liveMap.put("live_id", live.getLiveId());
            liveMap.put("name", product.getName());
            liveMap.put("price", product.getPrice());
            liveMap.put("title", live.getTitle());
            liveMap.put("tradePlace", live.getTradePlace());
            liveMap.put("live_thumbnail", live.getLiveThumbnail());

            // SHORTS 정보를 담을 Map 생성
            Map<String, Object> shortsMap = new HashMap<>();
            shortsMap.put("shorts_id", shorts.getShortsId());
            shortsMap.put("name", product.getName());
            shortsMap.put("price", product.getPrice());
            shortsMap.put("trade_place", live.getTradePlace());
            shortsMap.put("length", shorts.getLength());
            shortsMap.put("shorts_thumbnail", shorts.getShortsThumbnail());

            // scrap 데이터 확인 로직 추가
            Set<ShortsScrap> shortsScrapSet = shorts.getShortsScrapSet();
            boolean isScrap = false;

            // shortsScrapSet을 순회하며 조건 검사
            for (ShortsScrap scrap : shortsScrapSet) {
                if (scrap.getUser().getUserId() == userId && scrap.getShorts().getShortsId() == shorts.getShortsId()) {
                    isScrap = true;
                    break;
                }
            }
            shortsMap.put("is_scrap", isScrap);

            // 각 Map을 포함할 최종 Map을 생성하여 List에 추가
            resultMap.put("UPCOMING", upcomingMap);
            resultMap.put("LIVE", liveMap);
            resultMap.put("SHORTS", shortsMap);

            resultList.add(resultMap);

            // 결과를 담을 List를 초기화합니다.
        }
        Slice<Map<String, Object>> resultSlice = new SliceImpl<>(resultList, pageable, searchResultResponseSlice.hasNext());
        return resultSlice;
    }

    public List<SidoNameResponse> getSidoNameList(){
        return regionInfoRepository.findDistinctSido();
    }

    public List<GugunNameResponse> getGugunNameBySidoName(String sidoName){
        return regionInfoRepository.findDistinctGugunBySido(sidoName);
    }

    public List<EupmyeonNameResponse> getEupmyeonNameAndRegionCodeBySidoNameAndGugunName(String sidoName, String gugunName){
        return regionInfoRepository.findDistinctBySidoAndGugun(sidoName, gugunName);
    }
}
