package com.Pocket_map.Pocket_map.service;

import com.Pocket_map.Pocket_map.model.Booking;
import com.Pocket_map.Pocket_map.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, Booking updatedBooking) {
        return bookingRepository.findById(id).map(existing -> {
            existing.setGuestName(updatedBooking.getGuestName());
            existing.setEmail(updatedBooking.getEmail());
            existing.setCheckInDate(updatedBooking.getCheckInDate());
            existing.setCheckOutDate(updatedBooking.getCheckOutDate());
            existing.setHotel(updatedBooking.getHotel());
            existing.setRoom(updatedBooking.getRoom());
            return bookingRepository.save(existing);
        }).orElse(null);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
