package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Chatting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChattingRepository extends JpaRepository<Chatting, Integer> {

    @Query("SELECT c FROM Chatting c WHERE c.buyer.userId = :userId OR (c.seller.userId = :userId AND c.view = true)")
    List<Chatting> findChattingByBuyerOrSellerWithView(@Param("userId") int userId);

    Optional<Chatting> findByBuyer_UserIdAndLive_LiveId(int buyerId, int liveId);

    Optional<Chatting> findByChattingId(int chatId);
}
