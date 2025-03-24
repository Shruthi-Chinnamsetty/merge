package com.Pocket_map.Pocket_map.repository;

// repository/CategoryRepository.java

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Pocket_map.Pocket_map.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}