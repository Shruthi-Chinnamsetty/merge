package com.Pocket_map.Pocket_map.config;

import com.Pocket_map.Pocket_map.model.Destination;
import com.Pocket_map.Pocket_map.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DestinationRepository destinationRepository;
    
    @Override
    public void run(String... args) {
        // Add sample data only if repository is empty
        if (destinationRepository.count() == 0) {
            destinationRepository.saveAll(Arrays.asList(
                new Destination(null, "Paris", "France", "City of lights and romance"),
                new Destination(null, "London", "United Kingdom", "Historic city with modern appeal"),
                new Destination(null, "Tokyo", "Japan", "Blend of traditional and futuristic"),
                new Destination(null, "New York", "USA", "The city that never sleeps"),
                new Destination(null, "Sydney", "Australia", "Beautiful harbor city")
            ));
        }
    }
}