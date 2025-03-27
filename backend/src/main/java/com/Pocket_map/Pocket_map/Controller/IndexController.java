package com.Pocket_map.Pocket_map.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {

    @GetMapping("/")
    public String home() {
        return "Welcome to Hotel Booking!";
    }
}
