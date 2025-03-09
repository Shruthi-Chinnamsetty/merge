package com.Pocket_map.Pocket_map.service;

import com.Pocket_map.Pocket_map.model.Destination;
import com.Pocket_map.Pocket_map.repository.DestinationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DestinationService {
    @Autowired
    private DestinationRepository destinationRepository;

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination addDestination(Destination destination) {
        return destinationRepository.save(destination);
    }
}
