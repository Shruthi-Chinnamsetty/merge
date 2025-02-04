package com.myapp.languagephrases.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.myapp.languagephrases.Model.Category;
import com.myapp.languagephrases.Model.Language;
import com.myapp.languagephrases.Model.Phrase;
import com.myapp.languagephrases.repository.CategoryRepository;
import com.myapp.languagephrases.repository.LanguageRepository;
import com.myapp.languagephrases.repository.PhraseRepository;

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