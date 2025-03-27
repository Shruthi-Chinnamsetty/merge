package com.Pocket_map.Pocket_map.controller;

// controller/PhraseController.java

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Pocket_map.Pocket_map.model.Category;
import com.Pocket_map.Pocket_map.model.Language;
import com.Pocket_map.Pocket_map.model.Phrase;
import com.Pocket_map.Pocket_map.service.PhraseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/phrases")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PhraseController {
    private final PhraseService phraseService;

    @GetMapping("/languages")
    public ResponseEntity<List<Language>> getAllLanguages() {
        return ResponseEntity.ok(phraseService.getAllLanguages());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(phraseService.getAllCategories());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Phrase>> getPhrases(
            @RequestParam Integer languageId,
            @RequestParam(required = false) Integer categoryId) {
        return ResponseEntity.ok(
            phraseService.getPhrasesByLanguageAndCategory(languageId, categoryId)
        );
    }
}