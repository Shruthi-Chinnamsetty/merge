package com.Pocket_map.Pocket_map.repository;

import com.Pocket_map.Pocket_map.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);
}
