package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Chatting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChattingRepository extends JpaRepository<Chatting, Integer> {
    List<Chatting> findByBuyer_UserIdOrSeller_UserId(int buyerId, int sellerId);

    Optional<Chatting> findByBuyer_UserIdAndLive_LiveId(int buyerId, int liveId);

    Optional<Chatting> findByChattingId(int chatId);
}
