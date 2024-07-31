package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.dto.AddLiveRequest;
import com.ssafy.fleaOn.web.repository.LiveRepository;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LiveService {

    private final LiveRepository liveRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Live saveLive(AddLiveRequest addLiveRequest, int sellerId) {

        // Live 엔티티 생성 및 저장
        Live live = liveRepository.save(addLiveRequest.toEntity(sellerId));

        // Product 엔티티 생성 및 저장
        List<Product> products = addLiveRequest.getProduct().stream()
                .map(addProductRequest -> addProductRequest.toEntity(live, sellerId))
                .collect(Collectors.toList());

        productRepository.saveAll(products);

        return live;
    }
}
