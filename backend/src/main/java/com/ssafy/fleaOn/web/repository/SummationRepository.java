package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.ShortsContent;
import com.ssafy.fleaOn.web.domain.ShortsScrap;
import com.ssafy.fleaOn.web.dto.SummaryResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SummationRepository extends JpaRepository<ShortsContent, Integer> {
    Optional<ShortsContent> findByShorts_ShortsId(int shortId);
}
