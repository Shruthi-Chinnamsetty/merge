package com.Pocket_map.Pocket_map.controller;

import com.Pocket_map.Pocket_map.model.Guest;
import com.Pocket_map.Pocket_map.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestRepository guestRepository;

    // Sign up new guest
    @PostMapping("/signup")
    public Guest register(@RequestBody Guest guest) {
        return guestRepository.save(guest);
    }

    // Login existing guest
    @PostMapping("/login")
    public String login(@RequestBody Guest guest) {
        Optional<Guest> existingGuest = guestRepository.findByEmail(guest.getEmail());

        if (existingGuest.isPresent() && existingGuest.get().getPassword().equals(guest.getPassword())) {
            return "Login successful!";
        } else {
            return "Invalid email or password.";
        }
    }
}
