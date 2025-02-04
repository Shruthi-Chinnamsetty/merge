package com.myapp.languagephrases.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// model/Language.java
@Entity
@Table(name = "languages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "language_id")
    private Integer languageId;
    
    @Column(name = "language_name")
    private String languageName;
}