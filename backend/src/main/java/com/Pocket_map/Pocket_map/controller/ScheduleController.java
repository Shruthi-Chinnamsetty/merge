package com.Pocket_map.Pocket_map.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Pocket_map.Pocket_map.model.Schedule;
import com.Pocket_map.Pocket_map.model.User;
import com.Pocket_map.Pocket_map.service.ScheduleService;
import com.Pocket_map.Pocket_map.service.UserService;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleController {
    @Autowired
    private ScheduleService scheduleService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody Schedule schedule) {
        try {
            // Get current user from security context
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.findByEmail(email);
            
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            // Set the user for the schedule
            schedule.setUser(currentUser);
            
            // Ensure ID is null for new entity
            schedule.setId(null);
            
            Schedule saved = scheduleService.createSchedule(schedule);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create schedule: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        try {
            // Get current user from security context
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.findByEmail(email);
            
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            // Get only schedules for this user
            return ResponseEntity.ok(scheduleService.getSchedulesByUser(currentUser.getId()));
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error in getAllSchedules: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        // Get current user from security context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userService.findByEmail(email);
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Verify the schedule belongs to this user
        Schedule existingSchedule = scheduleService.findById(id);
        if (existingSchedule == null || !existingSchedule.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Maintain the same user
        schedule.setUser(currentUser);
        
        return ResponseEntity.ok(scheduleService.updateSchedule(id, schedule));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        // Get current user from security context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userService.findByEmail(email);
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Verify the schedule belongs to this user
        Schedule existingSchedule = scheduleService.findById(id);
        if (existingSchedule == null || !existingSchedule.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/auth-test")
    public ResponseEntity<?> testAuthentication() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.findByEmail(email);
            
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not found for authenticated email", "email", email));
            }
            
            return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "email", email,
                "userId", currentUser.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}