package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Chatting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChattingRepository extends JpaRepository<Chatting, Integer> {
    Optional<Chatting> findByBuyer_UserIdAndLive_LiveId(int buyerId, int liveId);
}
