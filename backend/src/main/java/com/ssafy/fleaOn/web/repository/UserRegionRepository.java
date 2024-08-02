package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.UserRegion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRegionRepository extends JpaRepository<UserRegion, Integer> {

    Optional<List<UserRegion>> findByUser_userId(int userId);
}
