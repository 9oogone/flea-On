package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Live;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LiveRepository extends JpaRepository<Live, Integer> {

    Optional<List<Live>> findBySeller_userId(int userId);

    Optional<Live> findByLiveId(int liveId);

    Optional<List<Live>> findAllByLiveId(int liveId);

    Slice<Live> findAllByOrderByIsLiveDescLiveDateAsc(Pageable pageable);

    Optional<Live> findByLiveIdAndSeller_userId(int liveId, int userId);

    @Query("SELECT l FROM Live l WHERE l.regionInfo.regionCode = :regionCode AND l.isLive IN (0, 1) " +
            "ORDER BY l.isLive DESC, l.liveDate ASC")
    List<Live> findByRegionCodeAndIsLiveOrderByIsLiveDescLiveDateAsc(@Param("regionCode") String regionCode);

    List<Live> findByRegionInfo_regionCode(String regionCode);


//    @Query("SELECT l FROM Live l WHERE l.regionInfo.regionCode = :regionCode AND l.isLive = 1 " +
//            "ORDER BY l.liveDate ASC")
//    List<Live> findByRegionCodeAndIsLive1OrderByLiveDateAsc(@Param("regionCode") String regionCode);
//
//    @Query("SELECT l FROM Live l WHERE l.regionInfo.regionCode = :regionCode AND l.isLive = 0 " +
//            "ORDER BY l.liveDate ASC")
//    List<Live> findByRegionCodeAndIsLive0OrderByLiveDateAsc(@Param("regionCode") String regionCode);




    @Query("SELECT l FROM Live l WHERE l.seller.userId = :userId AND l.isLive = :isLive AND l.liveDate < now() ORDER BY l.liveDate ASC LIMIT 1")
    Optional<Live> findFirstLiveBySellerAndIsLiveAndPastDate(
            @Param("userId") int userId,
            @Param("isLive") int isLive);

}