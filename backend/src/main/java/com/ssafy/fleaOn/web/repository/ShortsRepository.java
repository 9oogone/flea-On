package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Shorts;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShortsRepository extends JpaRepository<Shorts, Integer> {

    Optional<Shorts> findByShortsId(int shortsId);

    Slice<Shorts> findAllByOrderByUploadDateAsc(Pageable pageable);

    Optional<List<Shorts>> findByUser_userId(int userId);

    Optional<Shorts> findByProduct_ProductId(int productId);

    Optional<List<Shorts>> findAllByShortsId(int shortsId);

}
