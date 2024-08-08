package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.RegionInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegionInfoRepository extends JpaRepository<RegionInfo, Integer> {
    Optional<RegionInfo> findBySidoAndGugunAndEupmyeonAndLi(String sido, String gugun, String eupmyeon, String li);

    Optional<RegionInfo> findByRegionCode(String regionCode);
}
