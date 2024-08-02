package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.AddLiveRequest;
import com.ssafy.fleaOn.web.dto.UpdateLiveRequest;
import com.ssafy.fleaOn.web.repository.LiveRepository;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
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
        System.out.println("service: " + live.getLiveDate()); // 로그 추가
        live = liveRepository.save(live);

        // Product 엔티티 생성 및 저장
        Live finalLive = live;
        List<Product> products = addLiveRequest.getProduct().stream()
                .map(addProductRequest -> addProductRequest.toEntity(finalLive, user.getUserId()))
                .collect(Collectors.toList());

        productRepository.saveAll(products);

        return live;
    }

    public Live findById(int id) {
        return liveRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("not found: " + id));
    }

    @Transactional
    public Live updateLive(int id, UpdateLiveRequest request, User user) {
        Live live = liveRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));
        authorizeArticleAuthor(live);
        live.update(request.getTitle(), request.getLive_date(), request.getThumbnail(), request.getTrade_place());
        return liveRepository.save(live);
    }

    public void delete(int id) {
        Live live = liveRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));
        authorizeArticleAuthor(live);
        liveRepository.delete(live);
    }

    private static void authorizeArticleAuthor(Live live) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!live.getSeller().getEmail().equals(userName)) {
            throw new IllegalArgumentException("not authorized");
        }
    }
}
