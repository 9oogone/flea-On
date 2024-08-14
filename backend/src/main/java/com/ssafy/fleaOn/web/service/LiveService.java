package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.config.handler.FileHandler;
import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.AddLiveRequest;
import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.dto.UpdateLiveRequest;
import com.ssafy.fleaOn.web.dto.LiveDetailResponse;
import com.ssafy.fleaOn.web.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LiveService {

    private final LiveRepository liveRepository;
    private final LiveTradeTimeRepository liveTradeTimeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final RegionInfoRepository regionInfoRepository;
    private final FileHandler fileHandler;

    @Transactional
    public Live saveLive(AddLiveRequest addLiveRequest, User user, String thumbnail) throws Exception {
        System.out.println(addLiveRequest.getRegionCode());
        RegionInfo regionInfo = regionInfoRepository.findByRegionCode(addLiveRequest.getRegionCode())
                .orElseThrow(()-> new IllegalArgumentException("no products found for region id: " + addLiveRequest.getRegionCode()));
        // Live 엔티티 생성 및 저장

        Live live = addLiveRequest.toEntity(user, regionInfo, thumbnail);
        live = liveRepository.save(live);

        // Product 엔티티 생성 및 저장
        Live finalLive = live;
        List<Product> products = addLiveRequest.getProduct().stream()
                .map(addAddProductRequest -> addAddProductRequest.toEntity(finalLive, user))
                .collect(Collectors.toList());

        List<LiveTradeTime> liveTradeTimes = addLiveRequest.getLiveTradeTime().stream()
                .map(addLiveTradeRequest -> addLiveTradeRequest.toEntity(finalLive))
                .collect(Collectors.toList());

        productRepository.saveAll(products);
        liveTradeTimeRepository.saveAll(liveTradeTimes);

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
        LocalDateTime parsedDate = LocalDateTime.parse(request.getLiveDate(), formatter);
        RegionInfo regionInfo = regionInfoRepository.findByRegionCode(request.getRegionCode())
                .orElseThrow(()-> new IllegalArgumentException("no products found for region id: " + request.getRegionCode()));
        live.update(request.getTitle(), parsedDate, request.getLiveThumbnail(), request.getTradePlace(), regionInfo);

        // 라이브 내의 Product 수정
        List<Product> deleteProducts = productRepository.findByLive_LiveId(liveId).orElseThrow(() -> new IllegalArgumentException("no products found for live id: " + liveId));
        productRepository.deleteAll(deleteProducts);
        // Product 엔티티 생성 및 저장
        Live finalLive = live;
        List<Product> products = request.getProduct().stream()
                .map(addAddProductRequest -> addAddProductRequest.toEntity(finalLive, user))
                .collect(Collectors.toList());

        // 라이브 내의 live trade time 수정
        List<LiveTradeTime> deleteLiveTradeTimes = liveTradeTimeRepository.findByLive_LiveId(liveId).orElseThrow(() -> new IllegalArgumentException("no teade times found for live id: " + liveId));
        liveTradeTimeRepository.deleteAll(deleteLiveTradeTimes);
        // LiveTradeTime 엔티티 생성 및 저장
        List<LiveTradeTime> liveTradeTimes = request.getLiveTradeTime().stream()
                .map(addLiveTradeRequest -> addLiveTradeRequest.toEntity(finalLive))
                .toList();

        productRepository.saveAll(products);
        liveTradeTimeRepository.saveAll(liveTradeTimes);
        return live;
    }

    @Transactional
    public void delete(int id) {
        Live live = liveRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));
        authorizeArticleAuthor(live);

        // 라이브와 연관된 모든 제품 삭제
        List<Product> products = productRepository.findByLive_LiveId(id).orElseThrow(() -> new IllegalArgumentException("no products found for live id: " + id));
        productRepository.deleteAll(products);

        // 라이브와 연관된 모든 시간대 삭제
        List<LiveTradeTime> liveTradeTimes = liveTradeTimeRepository.findByLive_LiveId(id).orElseThrow(() -> new IllegalArgumentException("no teade times found for live id: " + id));
        liveTradeTimeRepository.deleteAll(liveTradeTimes);

        // 라이브 삭제
        liveRepository.delete(live);
    }

    public LiveDetailResponse findLiveWithProducts(int liveId) {
        Live live = findById(liveId);
        List<Product> products = productRepository.findByLive_LiveId(liveId).orElseThrow(() -> new IllegalArgumentException("no products found for live id: " + liveId));
        List<LiveTradeTime> liveTradeTimes = liveTradeTimeRepository.findByLive_LiveId(liveId).orElseThrow(() -> new IllegalArgumentException("no teade times found for live id: " + liveId));
        User user = userRepository.findById(live.getSeller().getUserId()).orElseThrow(() -> new IllegalArgumentException("no sellers found for live id: " + liveId));
        return new LiveDetailResponse(live, products, liveTradeTimes,user);
    }


    @Transactional
    public LiveDetailResponse onLive(int liveId) {
        Live live = liveRepository.findById(liveId)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + liveId));
        authorizeArticleAuthor(live);
        live.on();
        List<Product> products = productRepository.findByLive_LiveId(liveId).orElseThrow(() -> new IllegalArgumentException("no products found for live id: " + liveId));
        List<LiveTradeTime> liveTradeTimes = liveTradeTimeRepository.findByLive_LiveId(liveId).orElseThrow(() -> new IllegalArgumentException("no teade times found for live id: " + liveId));
        User user = userRepository.findById(live.getSeller().getUserId()).orElseThrow(() -> new IllegalArgumentException("no sellers found for live id: " + liveId));
        return new LiveDetailResponse(live, products, liveTradeTimes,user);
    }

    @Transactional
    public void offLive(int liveId) {
        Live live = liveRepository.findById(liveId)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + liveId));
        authorizeArticleAuthor(live);
        live.off();
        liveRepository.save(live);
    }

    @Transactional
    public void connect(int liveId) {
        Live live = liveRepository.findById(liveId)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + liveId));
        live.connect();
        liveRepository.save(live);
    }

    @Transactional
    public void disconnect(int liveId) {
        Live live = liveRepository.findById(liveId)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + liveId));
        live.disconnect();
        liveRepository.save(live);
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
