package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.TradeDone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TradeDoneRepository extends JpaRepository<TradeDone, Integer> {

    Optional<List<TradeDone>> findBySeller_UserId(int sellerId);

    Optional<List<TradeDone>> findByBuyer_UserId(int buyerId);

    @Query("SELECT COUNT(td) FROM TradeDone td WHERE (td.buyer.userId = :userId OR td.seller.userId = :userId) AND td.tradeDate BETWEEN :startOfWeek AND :endOfWeek")
    int countCompletedTrades(@Param("userId") int userId, @Param("startOfWeek") LocalDate startOfWeek, @Param("endOfWeek") LocalDate endOfWeek);

    Optional<TradeDone> findByProductId(int productId);
}