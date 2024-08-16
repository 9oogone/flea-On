package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT (t) FROM Trade t WHERE (t.buyerId = :userId OR t.sellerId = :userId) AND t.tradeDate = :tradeDate")
     Optional<List<Trade>> findByTradeDateAndBuyerIdOrSellerId(@Param("userId") int userId, @Param("tradeDate")LocalDate tradeDate);

     Optional<List<Trade>> findByChatting_ChattingId(int chattingId);

     void deleteByProduct_ProductId(int productId);

     Optional<List<Trade>> findByChatting_chattingId(int chattingId);

     Optional<List<Trade>> findByLive_liveIdAndBuyerId(int liveId, int buyerId);

    Optional<List<Trade>> findByBuyerIdAndProduct_ProductId(int buyerId, int productId);

     void deleteByShorts_ShortsId(int shortsId);


    @Query("SELECT COUNT(t) FROM Trade t WHERE (t.buyerId = :userId OR t.sellerId = :userId) AND t.tradeDate BETWEEN :startOfWeek AND :endOfWeek")
    int countByBuyerIdOrSellerIdAndTradeDateBetween(@Param("userId") int userId, @Param("startOfWeek") LocalDate startOfWeek, @Param("endOfWeek") LocalDate endOfWeek);

    int countBySellerIdAndTradeDateBetween(int userId, LocalDate startOfWeek, LocalDate endOfWeek);

    int countByBuyerIdAndTradeDateBetween(int userId, LocalDate startOfWeek, LocalDate endOfWeek);
    boolean existsByBuyerIdAndSellerIdAndChatting_ChattingId(int buyerId, int sellerId, int chattingId);

    @Query("SELECT COUNT(t) FROM Trade t WHERE (t.buyerId = :userId OR t.sellerId = :userId) AND t.tradeDate = :tradeDate")
    int countTradesByUserAndDate(@Param("userId") int userId, @Param("tradeDate") LocalDate tradeDate);

    @Query("SELECT t FROM Trade t WHERE t.product.productId = :productId")
    Optional<Trade> findByProductId(int productId);

    @Query("SELECT t FROM Trade t WHERE (t.buyerId = :buyerId AND t.sellerId = :sellerId AND t.live.liveId = :liveId)")
    Optional<List<Trade>> findByBuyerIdAndSellerIdAndLiveId(int buyerId, int sellerId, int liveId);
}
