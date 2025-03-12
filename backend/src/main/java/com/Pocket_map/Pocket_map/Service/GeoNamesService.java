package com.Pocket_map.Pocket_map.service;

import com.Pocket_map.Pocket_map.model.Destination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeoNamesService {
    private final String username = "2336048Anas"; // Replace with your GeoNames username
    private final RestTemplate restTemplate;
    
    @Autowired
    public GeoNamesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    public List<Destination> searchLocations(String query) {
        try {
            String url = "http://api.geonames.org/searchJSON?q={query}&maxRows=20&username={username}";
            
            // Add explicit casting to fix the type safety warning
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(
                url,
                Map.class,
                query,
                username
            );
            
            if (response == null) {
                return new ArrayList<>();
            }
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> geonames = (List<Map<String, Object>>) response.get("geonames");
            if (geonames == null) {
                return new ArrayList<>();
            }
            
            return geonames.stream()
                .map(this::convertToDestination)
                .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    private Destination convertToDestination(Map<String, Object> geoname) {
        Destination destination = new Destination();
        destination.setName((String) geoname.get("name"));
        destination.setCountry((String) geoname.get("countryName"));
        destination.setDescription("A destination in " + geoname.get("countryName"));
        
        if (geoname.containsKey("lat") && geoname.containsKey("lng")) {
            destination.setLatitude(Double.parseDouble(geoname.get("lat").toString()));
            destination.setLongitude(Double.parseDouble(geoname.get("lng").toString()));
        }
        
       
        return destination;
    }
}