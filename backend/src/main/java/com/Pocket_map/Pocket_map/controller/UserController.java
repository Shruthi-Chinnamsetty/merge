package com.Pocket_map.Pocket_map.controller;

import com.Pocket_map.Pocket_map.model.User;
import com.Pocket_map.Pocket_map.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        logger.debug("Received registration request for email: {}", user.getEmail());
        User savedUser = userService.createUser(user);
        logger.debug("User registered successfully with ID: {}", savedUser.getId());
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        logger.debug("Received request to get user with email: {}", email);
        Optional<User> user = userService.getUserByEmail(email);
        if (user.isPresent()) {
            logger.debug("User found with email: {}", email);
            return ResponseEntity.ok(user.get());
        } else {
            logger.debug("User not found with email: {}", email);
            return ResponseEntity.notFound().build();
        }
    }
    
    // Add a simple health check endpoint to test if controller is accessible
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        logger.debug("Health check endpoint accessed");
        return ResponseEntity.ok("UserController is up and running!");
    }
}