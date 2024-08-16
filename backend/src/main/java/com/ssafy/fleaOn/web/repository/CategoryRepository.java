package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Category;
import com.ssafy.fleaOn.web.domain.Live;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    void deleteById(int id);

    Optional<List<Category>> findByFirstCategoryId(int firstCategoryId);

    Optional<List<Category>> findBySecondCategoryId(int secondCategoryId);

    List<Category> findByFirstCategoryName(String firstCategoryName);

    Category findByFirstCategoryNameAndSecondCategoryName(String firstCategoryName, String secondCategoryName);

    List<Category> findAllByFirstCategoryId(int firstCategoryId);

    Optional<Category> findAllByFirstCategoryNameAndSecondCategoryName(String firstCategoryName, String secondCategoryName);

    Slice<Category> findByFirstCategoryNameContainingOrSecondCategoryNameContaining(String firstCategoryName, String secondCategoryName, Pageable pageable);

}
