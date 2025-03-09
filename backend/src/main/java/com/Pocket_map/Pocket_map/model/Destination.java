package com.Pocket_map.Pocket_map.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "destinations")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String country;
    private String description;
    
    // You can add additional searchable fields below
    // Examples:
    // private String category;
    // private Double rating;
    // private String imageUrl;
    // private Boolean isFeatured;
    
    // For tags or multiple categories, you could use:
    // @ElementCollection
    // private List<String> tags;
    
    // For more advanced relationships:
    // @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL)
    // private List<Review> reviews;
}