package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.SecondCategoryResponse;
import com.ssafy.fleaOn.web.repository.CategoryRepository;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public List<SecondCategoryResponse> getMainFirstCategoryList(int firstCategoryId) {
        try {
            List<Category> findCategory = categoryRepository.findAllByFirstCategoryId(firstCategoryId);
            List<SecondCategoryResponse> findCategoryResponse = new ArrayList<>();
            for (Category category : findCategory) {
                SecondCategoryResponse secondCategoryResponse = new SecondCategoryResponse(category.getSecondCategoryName());
                findCategoryResponse.add(secondCategoryResponse);
            }
            return findCategoryResponse;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

//    public List<SecondCategoryResponse> getMainSecondCategoryList(String firstCategoryName) {
//        try {
//            List<Category> categoryList = categoryRepository.findByFirstCategoryName(firstCategoryName);
//            return categoryList.stream()
//                    .map(category -> new SecondCategoryResponse(category.getSecondCategoryName()))
//                    .collect(Collectors.toList());
//        } catch (Exception e) {
//            e.printStackTrace();
//            throw e;
//        }
//    }

    public Slice<Map<String, Object>> getSearchResultByCategory(int firstCategoryId, int secondCategoryId, int userId) {
        try {
            Pageable pageable = PageRequest.of(0, 10);
            Optional<List<Product>> findProductList = productRepository.findProductIdsByFirstCategoryIdAndSecondCategoryId(firstCategoryId, secondCategoryId);

            List<Map<String, Object>> resultList = new ArrayList<>();

            if (findProductList.isPresent()) {
                List<Product> productList = findProductList.get();
                for (Product findProduct : productList) {
                    int productId = findProduct.getProductId();
                    Slice<Product> findProductResponseSlice = productRepository.findByProductId(productId, pageable);

                    for (Product findFinalProduct : findProductResponseSlice) {
                        Map<String, Object> resultMap = new HashMap<>();
                        Live live = findFinalProduct.getLive();
                        Shorts shorts = findFinalProduct.getShorts();

                        Map<String, Object> upcomingMap = new HashMap<>();
                        upcomingMap.put("live_id", live.getLiveId());
                        upcomingMap.put("name", findFinalProduct.getName());
                        upcomingMap.put("price", findFinalProduct.getPrice());
                        upcomingMap.put("live_date", live.getLiveDate());
                        upcomingMap.put("title", live.getTitle());

                        Map<String, Object> liveMap = new HashMap<>();
                        liveMap.put("live_id", live.getLiveId());
                        liveMap.put("name", findFinalProduct.getName());
                        liveMap.put("price", findFinalProduct.getPrice());
                        liveMap.put("title", live.getTitle());
                        liveMap.put("tradePlace", live.getTradePlace());
                        liveMap.put("live_thumbnail", live.getLiveThumbnail());

                        Map<String, Object> shortsMap = new HashMap<>();
                        shortsMap.put("shorts_id", shorts.getShortsId());
                        shortsMap.put("name", findFinalProduct.getName());
                        shortsMap.put("price", findFinalProduct.getPrice());
                        shortsMap.put("trade_place", live.getTradePlace());
                        shortsMap.put("length", shorts.getLength());
                        shortsMap.put("shorts_thumbnail", shorts.getShortsThumbnail());

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
                    }
                }
            }
            // 최종 결과 Slice를 생성하여 반환
            Slice<Map<String, Object>> resultSlice = new SliceImpl<>(resultList, pageable, resultList.size() > pageable.getPageSize());
            return resultSlice;

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public Optional<List<Category>> getMainCategoryList() {
        return Optional.of(categoryRepository.findAll());
    }
}
