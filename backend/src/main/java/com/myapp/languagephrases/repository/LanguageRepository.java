package com.myapp.languagephrases.repository;

// repository/LanguageRepository.java

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.myapp.languagephrases.Model.Language;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Integer> {
}


