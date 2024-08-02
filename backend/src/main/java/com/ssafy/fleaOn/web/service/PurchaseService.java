package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PurchaseService {

    private final ProductRepository productRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public PurchaseService(ProductRepository productRepository, ReservationRepository reservationRepository) {
        this.productRepository = productRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional
    public void processPurchaseRequest(PurchaseRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        if (product.getCurrentBuyerId() == null) {
            product.setCurrentBuyerId(request.getUserId());
            productRepository.save(product);
            // 구매 시간 폼 로직 추가
        } else if (product.getReservationCount() < 5) {
            Reservation reservation = new Reservation();
            reservation.setProductId(request.getProductId());
            reservation.setUserId(request.getUserId());
            reservationRepository.save(reservation);
            product.setReservationCount(product.getReservationCount() + 1);
            productRepository.save(product);
        } else {
            // 예약이 꽉 찬 경우 처리 로직 추가
        }
    }

    @Transactional
    public void processCancelPurchaseRequest(PurchaseRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        if (request.getUserId().equals(product.getCurrentBuyerId())) {
            product.setCurrentBuyerId(null);
            productRepository.save(product);

            Reservation nextReservation = reservationRepository.findFirstByProductIdOrderByReservationTimeAsc(request.getProductId());
            if (nextReservation != null) {
                product.setCurrentBuyerId(nextReservation.getUserId());
                reservationRepository.delete(nextReservation);
                product.setReservationCount(product.getReservationCount() - 1);
                productRepository.save(product);
            }
        }
    }

    @Transactional
    public void processReservationRequest(PurchaseRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        if (product.getReservationCount() < 5) {
            Reservation reservation = new Reservation();
            reservation.setProductId(request.getProductId());
            reservation.setUserId(request.getUserId());
            reservationRepository.save(reservation);
            product.setReservationCount(product.getReservationCount() + 1);
            productRepository.save(product);
        }
    }

    @Transactional
    public void processCancelReservationRequest(PurchaseRequest request) {
        Reservation reservation = reservationRepository.findByProductIdAndUserId(request.getProductId(), request.getUserId());
        if (reservation != null) {
            reservationRepository.delete(reservation);
            Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
            product.setReservationCount(product.getReservationCount() - 1);
            productRepository.save(product);
        }
    }

    @Transactional
    public void processConfirmPurchaseRequest(PurchaseRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        if (request.getUserId().equals(product.getCurrentBuyerId())) {
            Trade trade = new Trade();
            trade.setBuyerId(request.getUserId());
            trade.setProductId(request.getProductId());
            trade.setTradeDate(LocalDate.now());
            trade.setTradeTime(LocalTime.now());
            trade.setTradePlace("Trade Place"); // 필요에 따라 변경
            tradeRepository.save(trade);

            product.setCurrentBuyerId(null);
            productRepository.save(product);
        }
    }
}
