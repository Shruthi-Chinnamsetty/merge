package com.Pocket_map.Pocket_map.repository;

import com.Pocket_map.Pocket_map.model.Booking;
import com.Pocket_map.Pocket_map.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRoomAndCheckInDateLessThanEqualAndCheckOutDateGreaterThanEqual(
            Room room, LocalDate checkIn, LocalDate checkOut
    );
}
