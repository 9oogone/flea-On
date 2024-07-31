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
        live = liveRepository.save(live);

        // Product 엔티티 생성 및 저장
        Live finalLive = live;
        List<Product> products = addLiveRequest.getProduct().stream()
                .map(addProductRequest -> addProductRequest.toEntity(finalLive, user.getUserId()))
                .collect(Collectors.toList());

        productRepository.saveAll(products);

        return live;
    }

    @Transactional // 트랜잭션 메서드, 매칭한 메서드를 하나의 트랜잭션으로 묶는 역할
    // 엔티티의 필드값이 바뀌면 중간에 에러가 발생해도 제대로 된 값 수정 보장
    public Live updateLive(int id, UpdateLiveRequest request, User user) {
        Live live = liveRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));
        authorizeArticleAuthor(live);
        live.update(request.getTitle(), request.getLive_date(), request.getThumbnail(), request.getTrade_place());

//        return live;
        return liveRepository.save(live);
    }

    // 게시글을 작성한 유저인지 확인
    private static void authorizeArticleAuthor(Live live) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!live.getUser().getEmail().equals(userName)) {
            throw new IllegalArgumentException("not authorized");
        }
    }

}
