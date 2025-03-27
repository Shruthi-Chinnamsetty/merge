package com.Pocket_map.Pocket_map.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Pocket_map.Pocket_map.model.Category;
import com.Pocket_map.Pocket_map.model.Language;
import com.Pocket_map.Pocket_map.model.Phrase;
import com.Pocket_map.Pocket_map.repository.CategoryRepository;
import com.Pocket_map.Pocket_map.repository.LanguageRepository;
import com.Pocket_map.Pocket_map.repository.PhraseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PhraseService {
    private final PhraseRepository phraseRepository;
    private final LanguageRepository languageRepository;
    private final CategoryRepository categoryRepository;

    public List<Language> getAllLanguages() {
        return languageRepository.findAll();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Phrase> getPhrasesByLanguageAndCategory(Integer languageId, Integer categoryId) {
        if (languageId != null && categoryId != null) {
            return phraseRepository.findByLanguageLanguageIdAndCategoryCategoryId(languageId, categoryId);
        } else if (languageId != null) {
            return phraseRepository.findByLanguageLanguageId(languageId);
        }
        return phraseRepository.findAll();
    }
}