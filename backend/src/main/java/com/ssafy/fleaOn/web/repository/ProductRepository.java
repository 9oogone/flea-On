package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    Optional<Product> findByProductId(int productId);
    Optional<List<Product>> findByLive_LiveId(int liveId);
}
