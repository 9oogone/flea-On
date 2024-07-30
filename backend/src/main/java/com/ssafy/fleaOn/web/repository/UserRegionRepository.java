package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.UserRegion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRegionRepository extends JpaRepository<UserRegion, Integer> {

    List<UserRegion> findByUserId(int userId);
}
