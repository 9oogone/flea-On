package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.UserRegion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRegionRepository extends JpaRepository<UserRegion, Integer> {

    Optional<List<UserRegion>> findByUserId(int userId);
}
