package com.Pocket_map.Pocket_map.service;

import com.Pocket_map.Pocket_map.model.Destination;
import com.Pocket_map.Pocket_map.repository.DestinationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {
    @Autowired
    private DestinationRepository destinationRepository;
    
    @Autowired
    private GeoNamesService geoNamesService;

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
        // Use GeoNamesService for searching
        return geoNamesService.searchLocations(searchTerm);
    }
    
    public List<Destination> searchByNameAndCountry(String name, String country) {
        if ((name == null || name.trim().isEmpty()) && 
            (country == null || country.trim().isEmpty())) {
            return getAllDestinations();
        }
        
        // If only country is provided
        if (name == null || name.trim().isEmpty()) {
            return geoNamesService.searchLocations(country);
        }
        
        // If only name is provided
        if (country == null || country.trim().isEmpty()) {
            return geoNamesService.searchLocations(name);
        }
        
        // If both name and country are provided, search by name and filter by country
        List<Destination> nameResults = geoNamesService.searchLocations(name);
        return nameResults.stream()
            .filter(d -> d.getCountry().toLowerCase().contains(country.toLowerCase()))
            .collect(Collectors.toList());
    }
}