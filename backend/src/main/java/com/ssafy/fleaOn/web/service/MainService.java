package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Category;
import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.dto.MainShortsResponse;
import com.ssafy.fleaOn.web.repository.CategoryRepository;
import com.ssafy.fleaOn.web.repository.LiveRepository;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.ShortsRepository;
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

    public Slice<Live> getMainLiveListByLiveDate(LocalDateTime liveDate){
        Pageable pageable = PageRequest.of(0, 20);
        return liveRepository.findAllByOrderByIsLiveDescLiveDateAsc(pageable);
    }

    public Slice<MainShortsResponse> getMainShortsListByUploadDate(){
        Pageable pageable = PageRequest.of(0, 20);

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
                    shorts.getThumbnail()
            );
        }).getContent();

        // Slice 형태로 반환
        return new SliceImpl<>(shortsResponsesList, pageable, shortsSlice.hasNext());
    }

    public Optional<List<Category>> getMainCategoryList(){
        return Optional.of(categoryRepository.findAll());
    }


}
