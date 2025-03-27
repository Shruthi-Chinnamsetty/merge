package com.Pocket_map.Pocket_map.repository;

import com.Pocket_map.Pocket_map.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByLocationIgnoreCase(String location);
}
