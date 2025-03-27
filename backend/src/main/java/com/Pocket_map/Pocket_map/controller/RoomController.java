package com.Pocket_map.Pocket_map.controller;

import com.Pocket_map.Pocket_map.model.Room;
import com.Pocket_map.Pocket_map.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {
    private static final Logger logger = LoggerFactory.getLogger(RoomController.class);

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableRooms(
            @RequestParam Long hotelId,
            @RequestParam(required = false) String checkInDate,
            @RequestParam(required = false) String checkOutDate) {
        
        try {
            logger.info("Searching rooms for hotelId: {}", hotelId);
            List<Room> rooms = roomRepository.findByHotelId(hotelId);
            
            if (rooms.isEmpty()) {
                logger.info("No rooms found for hotelId: {}", hotelId);
                return ResponseEntity.ok().body("No rooms available for the specified hotel");
            }
            
            logger.info("Found {} rooms for hotelId: {}", rooms.size(), hotelId);
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            logger.error("Error searching rooms: ", e);
            return ResponseEntity.internalServerError().body("Error searching rooms: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        try {
            List<Room> rooms = roomRepository.findAll();
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            logger.error("Error fetching all rooms: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}