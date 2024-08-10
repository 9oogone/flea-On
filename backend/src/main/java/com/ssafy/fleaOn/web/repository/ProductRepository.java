package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<List<Product>> findByLive_LiveIdAndProductIdNotIn(int liveId, List<Integer> productIds);

    Optional<Product> findByProductId(int productId);

    Optional<List<Product>> findByLive_LiveId(int liveId);

    Optional<List<Product>> findByNameIgnoreCaseContaining(String name);

    Slice<Product> findByNameContainingOrFirstCategoryIdAndSecondCategoryId(String name, int firstCategoryId, int secondCategoryId, Pageable pageable);

    Optional<List<Product>> findProductIdsByFirstCategoryIdAndSecondCategoryId(int firstCategoryId, int secondCategoryId);

    Slice<Product> findByProductId(int productId, Pageable pageable);

    Optional<Product> findByLive_LiveIdAndCurrentBuyerId(int liveId, int buyerId);

}
