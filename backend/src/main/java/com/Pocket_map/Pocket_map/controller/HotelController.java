package com.Pocket_map.Pocket_map.controller;

import com.Pocket_map.Pocket_map.model.Hotel;
import com.Pocket_map.Pocket_map.repository.HotelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:3000")
public class HotelController {
    private static final Logger logger = LoggerFactory.getLogger(HotelController.class);

    @Autowired
    private HotelRepository hotelRepository;

    @GetMapping("/search")
    public ResponseEntity<?> searchHotels(
            @RequestParam String location,
            @RequestParam(required = false, defaultValue = "1") int adults,
            @RequestParam(required = false, defaultValue = "0") int children,
            @RequestParam(required = false, defaultValue = "1") int rooms,
            @RequestParam(required = false) String checkInDate,
            @RequestParam(required = false) String checkOutDate) {
        
        try {
            logger.info("Searching hotels for location: {}", location);
            List<Hotel> hotels = hotelRepository.findByLocationIgnoreCase(location);
            
            if (hotels.isEmpty()) {
                logger.info("No hotels found for location: {}", location);
                return ResponseEntity.ok().body("No hotels found for the specified location");
            }
            
            logger.info("Found {} hotels for location: {}", hotels.size(), location);
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            logger.error("Error searching hotels: ", e);
            return ResponseEntity.internalServerError().body("Error searching hotels: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            logger.error("Error fetching all hotels: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}