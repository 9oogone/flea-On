package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.TradeDone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface TradeDoneRepository extends JpaRepository<TradeDone, Integer> {

    int countByBuyer_UserIdOrSeller_UserIdAndTradeDate (int buyerId, int sellerId, LocalDate tradeDate);
}