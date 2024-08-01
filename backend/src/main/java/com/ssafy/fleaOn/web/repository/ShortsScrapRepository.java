package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.ShortsScrap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShortsScrapRepository extends JpaRepository<ShortsScrap, Integer> {

    Optional<List<ShortsScrap>> findByUser_userId(int userId);
}
