package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}