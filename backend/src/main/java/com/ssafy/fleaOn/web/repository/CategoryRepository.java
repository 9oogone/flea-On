package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Map;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
