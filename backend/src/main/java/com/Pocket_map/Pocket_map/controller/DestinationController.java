package com.Pocket_map.Pocket_map.controller;

import com.Pocket_map.Pocket_map.model.Destination;
import com.Pocket_map.Pocket_map.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @GetMapping
    public List<Destination> getAllDestinations() {
        return destinationService.getAllDestinations();
    }
    
    @GetMapping("/search")
    public List<Destination> searchDestinations(@RequestParam(required = false) String q) {
        return destinationService.searchDestinations(q);
    }
    
    @GetMapping("/search/advanced")
    public List<Destination> advancedSearch(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String country) {
        return destinationService.searchByNameAndCountry(name, country);
    }
    
    @PostMapping
    public ResponseEntity<Destination> addDestination(@RequestBody Destination destination) {
        Destination savedDestination = destinationService.addDestination(destination);
        return ResponseEntity.ok(savedDestination);
    }
}