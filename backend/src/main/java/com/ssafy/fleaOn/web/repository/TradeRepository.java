package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Integer> {

     Optional<List<Trade>> findBySellerIdOrBuyerId(int sellerId, int buyerId);

     Optional<List<Trade>> findByTradeDateBetweenAndBuyerIdOrSellerId(LocalDate startDate, LocalDate endDate, int buyerId, int sellerId);

     Optional<List<Trade>> findByBuyerId(int buyerId);

     Optional<Trade> findByProduct_productId(int productId);

     Optional<List<Trade>> findAllByTradeDateAndBuyerIdOrSellerId(LocalDate tradeDate, int buyerId, int sellerId);

     Optional<Trade> findByTradeDateAndBuyerIdOrSellerId(LocalDate tradeDate, int buyerId, int sellerId);

     Optional<List<Trade>> findByChatting_ChattingId(int chattingId);

     void deleteByProduct_ProductId(int productId);

     Optional<List<Trade>> findByChatting_chattingId(int chattingId);

     Optional<List<Trade>> findByLive_liveIdAndBuyerId(int liveId, int buyerId);

    Optional<List<Trade>> findByBuyerIdAndProduct_ProductId(int buyerId, int productId);

     void deleteByShorts_ShortsId(int shortsId);

     int countByBuyerIdOrSellerIdAndTradeDate(int buyerId, int sellerId, LocalDate tradeDate);

     int countBySellerIdAndTradeDate(int sellerId, LocalDate tradeDate);

     int countByBuyerIdAndTradeDate(int buyerId, LocalDate tradeDate);

     Optional<Trade> findByShorts_shortsId(int shortsId);


}
