package com.Pocket_map.Pocket_map.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Pocket_map.Pocket_map.dto.UserPostDTO;
import com.Pocket_map.Pocket_map.exception.ResourceNotFoundException;
import com.Pocket_map.Pocket_map.model.User;
import com.Pocket_map.Pocket_map.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getUsers() {
        return (List<User>) userRepository.findAll();
    }

    public void addUser(User newUser) {
        userRepository.save(newUser);
    }
  
    public Optional<User> findByID(Long id) {
        return userRepository.findById(id);
    }
  
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }
  
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(UserPostDTO userDTO) {
        // Check if user already exists
        if (userRepository.findByEmail(userDTO.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
    
        return userRepository.save(user);
    }

    // Add this method to verify passwords
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}