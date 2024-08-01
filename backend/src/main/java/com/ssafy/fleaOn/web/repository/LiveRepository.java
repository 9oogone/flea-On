package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Live;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LiveRepository extends JpaRepository<Live, Integer> {

    Optional<List<Live>> findBySeller_UserId(int sellerID);

    Optional<Live> findById(int liveId);


}
