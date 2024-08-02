package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Optional<Product> findByProductId(int productId);

    Optional<List<Product>> findByLive_LiveId(int liveId);

    Optional<List<Product>> findByName(String name);

    Optional<Product> findProductByName (String name);

    Slice<Product> findByNameContainingOrFirstCategoryIdOrSecondCategoryId(String name, int firstCategoryId, int secondCategoryId, Pageable pageable);
}
