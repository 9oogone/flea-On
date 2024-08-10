package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.ShortsChatting;
import com.ssafy.fleaOn.web.domain.ShortsScrap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShortsChattingRepository  extends JpaRepository<ShortsChatting, Integer> {
}
