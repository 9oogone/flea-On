package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Shorts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShortsRepository extends JpaRepository<Shorts, Integer> {

    Optional<Shorts> findByShortsId(int shortsId);
}
