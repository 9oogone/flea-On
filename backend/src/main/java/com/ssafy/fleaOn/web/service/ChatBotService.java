package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Chatting;
import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Reservation;
import com.ssafy.fleaOn.web.domain.Trade;
import com.ssafy.fleaOn.web.dto.ChatbotDetailResponse;
import com.ssafy.fleaOn.web.dto.ChatbotProductResponse;
import com.ssafy.fleaOn.web.dto.PurchaseCancleResponse;
import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatBotService {

    private final ChattingRepository chattingRepository;
    private final ReservationRepository reservationRepository;
    private final ChattingListRepository chattingListRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final TradeRepository tradeRepository;

    public ChatbotDetailResponse getChattingDetailsByChatId(int chatId, int userId) {
        Chatting chatting = chattingRepository.findById(chatId).orElseThrow(() -> new RuntimeException("Chatting not found"));

        List<Trade> trades = tradeRepository.findByChatting_ChattingId(chatId).orElseThrow(() -> new RuntimeException("Trade not found"));
        if (trades.isEmpty()) {
            throw new RuntimeException("No trades found for this chat.");
        }

        List<ChatbotProductResponse> buyProducts = new ArrayList<>();
        List<ChatbotProductResponse> otherProducts = new ArrayList<>();

        for (Trade t : trades) {
            Product product = t.getProduct();
            buyProducts.add(new ChatbotProductResponse(
                    product
            ));
        }

        // 라이브의 다른 상품들 추가
        List<Product> otherLiveProducts = productRepository.findByLive_LiveIdAndProductIdNotIn(chatting.getLive().getLiveId(), buyProducts.stream().map(ChatbotProductResponse::getProductId).toList())
                .orElseThrow(() -> new RuntimeException("Products not found"));
        for (Product product : otherLiveProducts) {
            otherProducts.add(new ChatbotProductResponse(
                    product
            ));
        }

        return new ChatbotDetailResponse(
                trades.get(0),
                buyProducts,
                otherProducts
        );
    }
}
