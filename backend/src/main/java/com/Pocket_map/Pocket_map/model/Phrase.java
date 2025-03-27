package com.Pocket_map.Pocket_map.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "phrases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Phrase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phrase_id")
    private Integer phraseId;
    
    @ManyToOne
    @JoinColumn(name = "language_id")
    private Language language;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Column(name = "phrase_text")
    private String phraseText;
    
    @Column(name = "translation")
    private String translation;
}