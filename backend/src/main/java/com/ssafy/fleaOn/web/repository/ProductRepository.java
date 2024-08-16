package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<List<Product>> findByLive_LiveIdAndProductIdNotIn(int liveId, List<Integer> productIds);

    Optional<Product> findByProductId(int productId);

    Optional<List<Product>> findByLive_LiveId(int liveId);

    Slice<Product> findByNameIgnoreCaseContaining(String name, Pageable pageable);

    Optional<List<Product>> findProductIdsByFirstCategoryIdAndSecondCategoryId(int firstCategoryId, int secondCategoryId);

    Slice<Product> findByProductId(int productId, Pageable pageable);

    Optional<Product> findByLive_LiveIdAndCurrentBuyerId(int liveId, int buyerId);

    List<Product> findByFirstCategoryIdOrSecondCategoryId(int firstCategoryId, int secondCategoryId);

    // 카테고리 이름에 따른 상품 검색
    @Query("SELECT p FROM Product p JOIN Category c ON (p.firstCategoryId = c.firstCategoryId AND p.secondCategoryId = c.secondCategoryId) " +
            "WHERE LOWER(c.firstCategoryName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.secondCategoryName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Slice<Product> findByCategoryName(@Param("name") String name, Pageable pageable);

}
