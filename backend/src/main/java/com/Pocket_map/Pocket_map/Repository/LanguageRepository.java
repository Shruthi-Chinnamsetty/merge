package com.Pocket_map.Pocket_map.repository;

// repository/LanguageRepository.java

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Pocket_map.Pocket_map.model.Language;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Integer> {
}

