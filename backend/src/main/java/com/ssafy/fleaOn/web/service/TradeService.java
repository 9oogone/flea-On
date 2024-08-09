package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.TradeRequest;
import com.ssafy.fleaOn.web.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TradeService {

    private final TradeRepository tradeRepository;
    private final TradeDoneRepository tradeDoneRepository;
    private final ProductRepository productRepository;
    private final ShortsRepository shortsRepository;
    private final ReservationRepository reservationRepository;
    private final LiveRepository liveRepository;
    private final LiveScrapRepository liveScrapRepository;
    private final ShortsScrapRepository shortsScrapRepository;
    private final UserRepository userRepository;
    private final LiveTradeTimeRepository liveTradeTimeRepository;

    @Transactional
    public void confirmTrade(TradeRequest request) {
        // 1. Trade 정보를 가져와서 TradeDone으로 옮기기
        Trade trade = tradeRepository.findByBuyerIdAndProduct_ProductId(request.getBuyerId(), request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid trade data"));

        User buyer = userRepository.findById(trade.getBuyerId()).orElseThrow(() -> new IllegalArgumentException("Invalid buyer ID"));
        User seller = userRepository.findById(trade.getSellerId()).orElseThrow(() -> new IllegalArgumentException("Invalid seller ID"));

        TradeDone tradeDone = TradeDone.builder()
                .buyer(buyer)
                .seller(seller)
                .productName(trade.getProduct().getName())
                .productPrice(trade.getProduct().getPrice())
                .tradeDate(trade.getTradeDate())
                .tradeTime(trade.getTradeTime())
                .tradePlace(trade.getTradePlace())
                .liveTitle(trade.getLive().getTitle())
                .build();

        tradeDoneRepository.save(tradeDone);

        // 2. 관련된 Shorts, Reservation, Product 삭제
        deleteShortsAndRelatedData(trade.getProduct());
        reservationRepository.deleteByProduct_ProductId(trade.getProduct().getProductId());
        productRepository.delete(trade.getProduct());

        // 3. Trade 삭제
        tradeRepository.delete(trade);

        // 4. Live에 속한 모든 Product가 삭제된 경우, Live와 관련된 데이터 삭제
        int liveId = trade.getLive().getLiveId();
        if (productRepository.findByLive_LiveId(liveId).isEmpty()) {
            deleteLiveAndRelatedData(liveId);
        }
    }

    @Transactional
    public void deleteShortsAndRelatedData(Product product) {
        Optional<Shorts> shorts = shortsRepository.findByProduct_ProductId(product.getProductId());
        shorts.ifPresent(s -> {
            // 관련된 ShortsScrap 삭제
            shortsScrapRepository.deleteByShorts_ShortsId(s.getShortsId());
            // Shorts 삭제
            shortsRepository.delete(s);
        });
    }

    @Transactional
    public void deleteLiveAndRelatedData(int liveId) {
        // LiveScrap 삭제
        liveScrapRepository.deleteByLive_LiveId(liveId);

        // Live 관련 TradeTime 삭제
        liveTradeTimeRepository.deleteByLive_LiveId(liveId);

        // Live 삭제
        liveRepository.deleteById(liveId);
    }
}
