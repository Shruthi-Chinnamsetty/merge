package com.Pocket_map.Pocket_map.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Pocket_map.Pocket_map.dto.UserPostDTO;
import com.Pocket_map.Pocket_map.model.User;
import com.Pocket_map.Pocket_map.security.JWTService;
import com.Pocket_map.Pocket_map.service.UserService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;
  
    // Get All Users
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    // Register a new user
    @PostMapping("/user")
    public ResponseEntity<Optional<User>> addUser(@RequestBody UserPostDTO newUserDTO) {
        if (newUserDTO.getName() == null || 
            newUserDTO.getEmail() == null ||
            newUserDTO.getPassword() == null) {
            return new ResponseEntity<>(Optional.empty(), HttpStatus.BAD_REQUEST);
        }
    
        // Check if user already exists
        if (userService.findByEmail(newUserDTO.getEmail()) != null) {
            return new ResponseEntity<>(Optional.empty(), HttpStatus.CONFLICT);
        }
    
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User newUser = new User(
            newUserDTO.getName(), 
            newUserDTO.getEmail(),
            encoder.encode(newUserDTO.getPassword())
        );
        userService.addUser(newUser);
        return new ResponseEntity<>(Optional.of(newUser), HttpStatus.CREATED);
    }
  
    // Get User by ID
    @GetMapping("/user/{id}")
    public Optional<User> getUserById(@PathVariable(value = "id") long Id) {
        return userService.findByID(Id);
    }
  
    // Delete a User by ID
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable(value = "id") long Id) {
        userService.deleteUser(Id);
        return "User Deleted"; 
    }
  
    // Get User by Email
    @GetMapping("/user/findByEmail")
    public Optional<User> getUserByEmail(@RequestParam String email) {
        return Optional.ofNullable(userService.findByEmail(email));
    }

    // Get the details for the currently logged in user
    @GetMapping("/user/getDetails")
    public Optional<User> getLoggedInUserDetails() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        if (user != null) {
            // Don't return the password
            user.setPassword(null);
        }
        return Optional.ofNullable(user);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserPostDTO userDTO) {
        try {
            User newUser = userService.createUser(userDTO);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletResponse response) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        System.out.println("Login attempt for email: " + email);
        
        try {
            // Manually find user by email
            User user = userService.findByEmail(email);
            if (user == null) {
                System.out.println("User not found for email: " + email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
            }
            
            // Manually verify password
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            boolean passwordMatches = encoder.matches(password, user.getPassword());
            System.out.println("Password match result: " + passwordMatches);
            
            if (!passwordMatches) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
            }
            
            try {
                // Generate JWT token
                String token = generateToken(user);
                if (token == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to generate authentication token"));
                }
                
                response.addHeader("Authorization", "Bearer " + token);
                response.addHeader("Access-Control-Expose-Headers", "Authorization");
                
                // Password matches, return success with user details
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("success", true);
                responseBody.put("message", "Login successful");
                responseBody.put("user", Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail()
                ));
                
                return ResponseEntity.ok(responseBody);
            } catch (Exception e) {
                System.err.println("Error generating token: " + e.getMessage());
                e.printStackTrace();
                throw e;
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An error occurred during login", "message", e.getMessage()));
        }
    }

    @GetMapping("/verify-token")
    public ResponseEntity<?> verifyToken() {
        // The request reaching this point means JWT filter already verified the token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        
        if (user != null) {
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("valid", true);
            responseMap.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
            ));
            return ResponseEntity.ok(responseMap);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
        }
    }

    // Helper method to generate JWT token
    private String generateToken(User user) {
        try {
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpiration);
            
            System.out.println("JWT Secret length: " + jwtSecret.length());
            System.out.println("JWT Expiration: " + jwtExpiration);
            
            // For HS512, we need at least 64 bytes for the key
            // Let's use a more reliable key generation approach
            byte[] keyBytes = jwtSecret.getBytes();
            SecretKey key = Keys.hmacShaKeyFor(keyBytes);
            
            String token = Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)  // Simplified signing, let it choose appropriate algorithm
                .compact();
                
            System.out.println("Token generated successfully");
            return token;
        } catch (Exception e) {
            System.err.println("Token generation error: " + e.getMessage());
            e.printStackTrace();
            return null; // This will trigger proper error handling in the login method
        }
    }
}