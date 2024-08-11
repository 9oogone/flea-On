package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.ShortsChatting;
import com.ssafy.fleaOn.web.domain.ShortsScrap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShortsChattingRepository  extends JpaRepository<ShortsChatting, Integer> {
    Optional<List<ShortsChatting>> findByShorts_ShortsId(int shortsId);
}
