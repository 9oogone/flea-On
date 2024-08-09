package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Live;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LiveRepository extends JpaRepository<Live, Integer> {

    Optional<List<Live>> findBySeller_userId(int userId);

    Optional<Live> findByLiveId(int liveId);

    Slice<Live> findAllByOrderByIsLiveDescLiveDateAsc(Pageable pageable);

    Optional<Live> findByLiveIdAndSeller_userId(int liveId, int userId);

    Slice<Live> findByRegionInfo_RegionCodeAndLiveDateGreaterThanEqual(String regionCode, LocalDateTime currentTime, Pageable pageable);

    Optional<Live> findBySeller_userIdAndIsLiveAndLiveDateGreaterThanEqual(int userId, int isLive, LocalDateTime currentTime);
}
