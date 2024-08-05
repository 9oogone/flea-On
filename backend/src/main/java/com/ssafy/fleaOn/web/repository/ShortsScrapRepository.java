package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.ShortsScrap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShortsScrapRepository extends JpaRepository<ShortsScrap, Integer> {

    Optional<List<ShortsScrap>> findByUser_userId(int userId);

    Optional<ShortsScrap> findByUser_userIdAndShorts_shortsId(int userId, int shortsId);
}
