package com.myapp.languagephrases.repository;

// repository/CategoryRepository.java

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.myapp.languagephrases.Model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}