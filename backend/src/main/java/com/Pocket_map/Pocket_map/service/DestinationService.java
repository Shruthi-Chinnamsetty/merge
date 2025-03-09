package com.Pocket_map.Pocket_map.service;

import com.Pocket_map.Pocket_map.model.Destination;
import com.Pocket_map.Pocket_map.repository.DestinationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DestinationService {
    @Autowired
    private DestinationRepository destinationRepository;

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination addDestination(Destination destination) {
        return destinationRepository.save(destination);
    }
    
    public List<Destination> searchDestinations(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllDestinations();
        }
        return destinationRepository.searchDestinations(searchTerm);
    }
    
    public List<Destination> searchByNameAndCountry(String name, String country) {
        if ((name == null || name.trim().isEmpty()) && 
            (country == null || country.trim().isEmpty())) {
            return getAllDestinations();
        }
        
        if (name == null || name.trim().isEmpty()) {
            return destinationRepository.findByCountryContainingIgnoreCase(country);
        }
        
        if (country == null || country.trim().isEmpty()) {
            return destinationRepository.findByNameContainingIgnoreCase(name);
        }
        
        return destinationRepository.findByNameContainingIgnoreCaseAndCountryContainingIgnoreCase(name, country);
    }
}