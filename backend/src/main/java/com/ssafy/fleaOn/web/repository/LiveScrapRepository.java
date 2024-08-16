package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.LiveScrap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LiveScrapRepository extends JpaRepository<LiveScrap, Integer> {

    Optional<List<LiveScrap>> findByUser_userId(int userId);

    Optional<LiveScrap> findByUser_userIdAndLive_liveId(int userId, int liveId);

    Optional<List<LiveScrap>> findByLive_liveId(int liveId);
    void deleteByLive_LiveId(int liveId);
}
