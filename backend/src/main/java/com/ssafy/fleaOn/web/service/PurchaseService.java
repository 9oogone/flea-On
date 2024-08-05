package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.dto.TradeRequest;
import com.ssafy.fleaOn.web.repository.LiveRepository;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.ReservationRepository;
import com.ssafy.fleaOn.web.repository.TradeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@Service
public class PurchaseService {

    private static final Logger logger = LoggerFactory.getLogger(PurchaseService.class);

    private final ProductRepository productRepository;
    private final LiveRepository liveRepository;
    private final ReservationRepository reservationRepository;
    private final TradeRepository tradeRepository;

    @Autowired
    public PurchaseService(ProductRepository productRepository, LiveRepository liveRepository, ReservationRepository reservationRepository, TradeRepository tradeRepository) {
        this.productRepository = productRepository;
        this.liveRepository = liveRepository;
        this.reservationRepository = reservationRepository;
        this.tradeRepository = tradeRepository;
    }

    @Transactional
    public int processPurchaseRequest(PurchaseRequest request) {
        logger.info("Processing purchase request for productId: {} and userId: {}", request.getProductId(), request.getUserId());
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        // Check if the user is already the buyer
        if (product.getCurrentBuyerId() == request.getUserId()) {
            logger.warn("User {} is already the buyer for product {}", request.getUserId(), request.getProductId());
            return -2; // Already the buyer
        }

        // Check if the user is already in the reservation list
        Optional<Reservation> existingReservation = reservationRepository.findByProduct_ProductIdAndUser_UserId(request.getProductId(), request.getUserId());
        if (existingReservation.isPresent()) {
            logger.warn("User {} is already reserved for product {}", request.getUserId(), request.getProductId());
            return -3; // Already reserved
        }

        if (product.getCurrentBuyerId() == 0) {
            product.setCurrentBuyerId(request.getUserId());
            productRepository.save(product);
            return 0; // 구매 예정자
        } else if (product.getReservationCount() < 5) {
            Reservation reservation = Reservation.builder()
                    .product(product)
                    .user(User.builder().userId(request.getUserId()).build())
                    .build();
            reservationRepository.save(reservation);
            product.setReservationCount(product.getReservationCount() + 1);
            productRepository.save(product);
            return product.getReservationCount(); // 예약자 순번 반환
        } else {
            return 6; // 예약 불가능
        }
    }

    @Transactional
    public int processCancelPurchaseRequest(PurchaseRequest request) {
        logger.info("Processing cancel purchase request for productId: {} and userId: {}", request.getProductId(), request.getUserId());
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        if (request.getUserId() == product.getCurrentBuyerId()) {
            product.setCurrentBuyerId(0);
            productRepository.save(product);

            Optional<Reservation> nextReservation = reservationRepository.findFirstByProduct_ProductIdOrderByReservationTimeAsc(request.getProductId());
            if (nextReservation.isPresent()) {
                product.setCurrentBuyerId(nextReservation.get().getUser().getUserId());
                reservationRepository.delete(nextReservation.get());
                product.setReservationCount(product.getReservationCount() - 1);
                productRepository.save(product);
                return product.getCurrentBuyerId();
            }
            return 0; // 다음 예약자가 없는 경우
        }
        return -1; // 현재 구매자가 아닌 경우
    }

    @Transactional
    public int processReservationRequest(PurchaseRequest request) {
        logger.info("Processing reservation request for productId: {} and userId: {}", request.getProductId(), request.getUserId());
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        // Check if the user is already the buyer
        if (product.getCurrentBuyerId() == request.getUserId()) {
            logger.warn("User {} is already the buyer for product {}", request.getUserId(), request.getProductId());
            return -2; // Already the buyer
        }

        // Check if the user is already in the reservation list
        Optional<Reservation> existingReservation = reservationRepository.findByProduct_ProductIdAndUser_UserId(request.getProductId(), request.getUserId());
        if (existingReservation.isPresent()) {
            logger.warn("User {} is already reserved for product {}", request.getUserId(), request.getProductId());
            return -3; // Already reserved
        }

        if (product.getReservationCount() < 5) {
            Reservation reservation = Reservation.builder()
                    .product(product)
                    .user(User.builder().userId(request.getUserId()).build())
                    .build();
            reservationRepository.save(reservation);
            product.setReservationCount(product.getReservationCount() + 1);
            productRepository.save(product);
            return product.getReservationCount(); // 그 다음 예약자 순번 반환
        }
        return 6; // 예약 불가능
    }

    @Transactional
    public int processCancelReservationRequest(PurchaseRequest request) {
        logger.info("Processing cancel reservation request for productId: {} and userId: {}", request.getProductId(), request.getUserId());
        Optional<Reservation> reservation = reservationRepository.findByProduct_ProductIdAndUser_UserId(request.getProductId(), request.getUserId());
        if (reservation.isPresent()) {
            reservationRepository.delete(reservation.get());
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
            product.setReservationCount(product.getReservationCount() - 1);
            productRepository.save(product);
            return product.getReservationCount();
        }
        return -1; // 예약이 없는 경우
    }

    @Transactional
    public void processConfirmPurchaseRequest(TradeRequest request) {
        logger.info("Processing confirm purchase request for productId: {} and buyerId: {}", request.getProductId(), request.getBuyerId());
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        Live live = liveRepository.findById(request.getLiveId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid live ID"));

        if (request.getBuyerId() == product.getCurrentBuyerId()) {
            Trade trade = request.toEntity(live, product);
            tradeRepository.save(trade);
            product.setCurrentBuyerId(0); // 구매 확정 후 현재 구매자 초기화
            productRepository.save(product);
        }
    }
}
