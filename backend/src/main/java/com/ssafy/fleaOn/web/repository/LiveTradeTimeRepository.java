package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.LiveTradeTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;
import java.util.Optional;

@Repository
public interface LiveTradeTimeRepository extends JpaRepository<LiveTradeTime, Integer> {
    Optional<List<LiveTradeTime>> findByLive_LiveId(int liveId);
}
