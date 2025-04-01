package com.Pocket_map.Pocket_map.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Pocket_map.Pocket_map.model.Destination;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    // Find by name containing search term (case insensitive)
    List<Destination> findByNameContainingIgnoreCase(String name);
    
    // Find by country containing search term (case insensitive)
    List<Destination> findByCountryContainingIgnoreCase(String country);
    
    // Find by both name and country
    List<Destination> findByNameContainingIgnoreCaseAndCountryContainingIgnoreCase(String name, String country);
    
    // Custom query to search across multiple fields
    @Query("SELECT d FROM Destination d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.country) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Destination> searchDestinations(@Param("searchTerm") String searchTerm);
}