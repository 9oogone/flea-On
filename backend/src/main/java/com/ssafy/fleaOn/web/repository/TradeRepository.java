package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Trade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Integer> {

     List<Trade> findByUser_UserId(int userId);

     List<Trade> findByTradeDateBetweenAndBuyerIdOrSellerId(LocalDate startDate, LocalDate endDate, int buyerId, int sellerId);
}
