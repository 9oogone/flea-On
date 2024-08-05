package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    int findByFirstCategoryId(int firstCategoryId);

    int findBySecondCategoryId(int secondCategoryId);

    List<Category> findByFirstCategoryName(String firstCategoryName);

    Category findByFirstCategoryNameAndSecondCategoryName(String firstCategoryName, String secondCategoryName);

}
