package com.Pocket_map.Pocket_map.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor // Zero-argument constructor
@Table(name = "destinations")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String country;
    private String description;
    private Double latitude;
    private Double longitude;
    
    // Add a constructor with all the original fields
    public Destination(Long id, String name, String country, String description) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.description = description;
    }
    
    // Add a constructor with all fields including the new ones
    public Destination(Long id, String name, String country, String description, 
                       Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}