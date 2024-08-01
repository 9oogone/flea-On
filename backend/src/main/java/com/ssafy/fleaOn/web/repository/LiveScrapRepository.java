package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.LiveScrap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LiveScrapRepository extends JpaRepository<Live, Integer> {

    Optional<List<LiveScrap>> findByUser_UserId(int userId);
}
