package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.dto.ShortsRequest;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.ShortsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ShortsService {

    private final ShortsRepository shortsRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ShortsService(ShortsRepository shortsRepository, ProductRepository productRepository) {
        this.shortsRepository = shortsRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Shorts saveShorts(ShortsRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        Shorts shorts = request.toEntity(product);
        return shortsRepository.save(shorts);
    }

    public Optional<Shorts> getShorts(int shortsId) {
        return shortsRepository.findById(shortsId);
    }
}
