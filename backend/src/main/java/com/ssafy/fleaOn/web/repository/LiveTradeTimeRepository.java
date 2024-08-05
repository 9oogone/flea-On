package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.LiveTradeTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LiveTradeTimeRepository extends JpaRepository<LiveTradeTime, Integer> {
}
