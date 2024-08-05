package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.ShortsRequest;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.ShortsRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ShortsService {

    private final ShortsRepository shortsRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public ShortsService(ShortsRepository shortsRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.shortsRepository = shortsRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Shorts saveShorts(ShortsRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        User seller = userRepository.findById(product.getSeller().getUserId()).orElseThrow(() -> new IllegalArgumentException("Invalid seller"));
        Shorts shorts = request.toEntity(product, seller);
        return shortsRepository.save(shorts);
    }

    public Optional<Shorts> getShorts(int shortsId) {
        return shortsRepository.findById(shortsId);
    }
}
