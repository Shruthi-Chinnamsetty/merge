package com.Pocket_map.Pocket_map.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Pocket_map.Pocket_map.model.Destination;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
}
