package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Integer> {

     Optional<List<Trade>> findBySellerId(int userId);

     Optional<List<Trade>> findByTradeDateBetweenAndBuyerIdOrSellerId(LocalDate startDate, LocalDate endDate, int buyerId, int sellerId);

     Optional<List<Trade>> findByBuyerId(int buyerId);
}
