package com.Pocket_map.Pocket_map.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Pocket_map.Pocket_map.model.Phrase;



// repository/PhraseRepository.java
@Repository
public interface PhraseRepository extends JpaRepository<Phrase, Integer> {
    List<Phrase> findByLanguageLanguageIdAndCategoryCategoryId(Integer languageId, Integer categoryId);
    List<Phrase> findByLanguageLanguageId(Integer languageId);
    List<Phrase> findByCategoryCategoryId(Integer categoryId);
    List<Phrase> findByLanguageLanguageIdAndCategoryCategoryIdIn(Integer languageId, List<Integer> categoryIds);
}