package com.Pocket_map.Pocket_map.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Pocket_map.Pocket_map.model.CycleStation;
import com.Pocket_map.Pocket_map.service.CycleStationService;

@RestController
@RequestMapping("/api/cycle-stations")
public class CycleStationController {

    private final CycleStationService cycleStationService;

    @Autowired
    public CycleStationController(CycleStationService cycleStationService) {
        this.cycleStationService = cycleStationService;
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<CycleStation>> getNearbyStations(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1000") double radius) {
        
        List<CycleStation> stations = cycleStationService.getNearbyStations(lat, lng, radius);
        return ResponseEntity.ok(stations);
    }
}