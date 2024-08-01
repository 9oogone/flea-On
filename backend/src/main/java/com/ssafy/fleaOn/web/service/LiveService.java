package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.AddLiveRequest;
import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.dto.UpdateLiveRequest;
import com.ssafy.fleaOn.web.dto.UpdateProductRequest;
import com.ssafy.fleaOn.web.repository.LiveRepository;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LiveService {

    private final LiveRepository liveRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Live saveLive(AddLiveRequest addLiveRequest, User user) {
        // Live 엔티티 생성 및 저장
        Live live = addLiveRequest.toEntity(user);
        System.out.println("service: " + live.getLive_date()); // 로그 추가
        live = liveRepository.save(live);

        // Product 엔티티 생성 및 저장
        Live finalLive = live;
        List<Product> products = addLiveRequest.getProduct().stream()
                .map(addAddProductRequest -> addAddProductRequest.toEntity(finalLive, user))
                .collect(Collectors.toList());

        productRepository.saveAll(products);

        return live;
    }

    public Live findById(int id) {
        return liveRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("not found: " + id));
    }

    @Transactional
    public Live updateLive(int liveId, UpdateLiveRequest request, User user) {
        // Live 수정
        Live live = liveRepository.findById(liveId)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + liveId));
        authorizeArticleAuthor(live);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime parsedDate = LocalDateTime.parse(request.getLive_date(), formatter);
        live.update(request.getTitle(), parsedDate, request.getThumbnail(), request.getTrade_place());

        // 라이브 내의 Product 수정
        Optional<List<Product>> existingProductsOptional = productRepository.findByLive_LiveId(liveId);

        if (existingProductsOptional.isPresent()) {
            List<Product> existingProducts = existingProductsOptional.get();

            for (UpdateProductRequest updateProductRequest : request.getProduct()) {
                Optional<Product> productOptional = existingProducts.stream()
                        .filter(p -> p.getProductId() == updateProductRequest.getProductId())
                        .findFirst();

                if (productOptional.isPresent()) {
                    Product product = productOptional.get();
                    product.update(updateProductRequest.getName(), updateProductRequest.getPrice(),
                            updateProductRequest.getFirstCategory(), updateProductRequest.getSecondCategory());
                } else {
                    // 새로 추가된 제품 처리 (옵션)
                    Product newProduct = updateProductRequest.toEntity(live, user);
                    productRepository.save(newProduct);
                }
            }
        }

        return live;
    }

    public void delete(int id) {
        Live live = liveRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));
        authorizeArticleAuthor(live);
        liveRepository.delete(live);
    }

    private static void authorizeArticleAuthor(Live live) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String userEmail = oAuth2User.getEmail();
        if (!live.getSeller().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("not authorized");
        }
    }
}
