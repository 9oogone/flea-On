package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Product;
import com.ssafy.fleaOn.web.domain.Reservation;
import com.ssafy.fleaOn.web.domain.Trade;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.repository.ProductRepository;
import com.ssafy.fleaOn.web.repository.ReservationRepository;
import com.ssafy.fleaOn.web.repository.TradeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class PurchaseService {

    private final ProductRepository productRepository;
    private final ReservationRepository reservationRepository;
    private final TradeRepository tradeRepository;

    @Autowired
    public PurchaseService(ProductRepository productRepository, ReservationRepository reservationRepository, TradeRepository tradeRepository) {
        this.productRepository = productRepository;
        this.reservationRepository = reservationRepository;
        this.tradeRepository = tradeRepository;
    }

    @Transactional
    public int processPurchaseRequest(PurchaseRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

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
            return 0;
        }
        return -1;
    }

    @Transactional
    public void processReservationRequest(PurchaseRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        if (product.getReservationCount() < 5) {
            Reservation reservation = Reservation.builder()
                    .product(product)
                    .user(User.builder().userId(request.getUserId()).build())
                    .build();
            reservationRepository.save(reservation);
            product.setReservationCount(product.getReservationCount() + 1);
            productRepository.save(product);
        }
    }

    @Transactional
    public void processCancelReservationRequest(PurchaseRequest request) {
        Optional<Reservation> reservation = reservationRepository.findByProduct_ProductIdAndUser_UserId(request.getProductId(), request.getUserId());
        if (reservation.isPresent()) {
            reservationRepository.delete(reservation.get());
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
            product.setReservationCount(product.getReservationCount() - 1);
            productRepository.save(product);
        }
    }

//    @Transactional
//    public void processConfirmPurchaseRequest(PurchaseRequest request) {
//        Product product = productRepository.findById(request.getProductId())
//                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
//
//        if (request.getUserId() == product.getCurrentBuyerId()) {
//            Trade trade = Trade.builder()
//                    .buyerId(request.getUserId())
//                    .product(product)
//                    .tradeDate(LocalDate.now())
//                    .tradeTime(LocalTime.now())
//                    .tradePlace("Trade Place")
//                    .build();
//            tradeRepository.save(trade);
//
//            product.setCurrentBuyerId(0);
//            productRepository.save(product);
//        }
//    }
}
