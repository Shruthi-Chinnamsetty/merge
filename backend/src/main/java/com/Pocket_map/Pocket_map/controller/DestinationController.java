package com.Pocket_map.Pocket_map.controller;

import com.Pocket_map.Pocket_map.model.Destination;
import com.Pocket_map.Pocket_map.service.DestinationService;
import com.Pocket_map.Pocket_map.service.GeoNamesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;
    
    @Autowired
    private GeoNamesService geoNamesService;

    @GetMapping
    public List<Destination> getAllDestinations() {
        System.out.println("Getting all destinations");
        return destinationService.getAllDestinations();
    }
    
    @GetMapping("/search")
    public List<Destination> searchDestinations(@RequestParam(required = false) String q) {
        System.out.println("Search request received for query: " + q);
        List<Destination> results = destinationService.searchDestinations(q);
        System.out.println("Returning " + results.size() + " results");
        return results;
    }
    
    @GetMapping("/search/advanced")
    public List<Destination> advancedSearch(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String country) {
        System.out.println("Advanced search request received - name: " + name + ", country: " + country);
        List<Destination> results = destinationService.searchByNameAndCountry(name, country);
        System.out.println("Returning " + results.size() + " results from advanced search");
        return results;
    }
    
    @PostMapping
    public ResponseEntity<Destination> addDestination(@RequestBody Destination destination) {
        Destination savedDestination = destinationService.addDestination(destination);
        return ResponseEntity.ok(savedDestination);
    }
    
    @GetMapping("/test-geonames")
    public List<Destination> testGeoNames(@RequestParam String query) {
        System.out.println("Testing GeoNames with query: " + query);
        List<Destination> results = geoNamesService.searchLocations(query);
        System.out.println("GeoNames test returned " + results.size() + " results");
        return results;
    }
}