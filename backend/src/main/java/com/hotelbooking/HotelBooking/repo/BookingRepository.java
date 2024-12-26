package com.hotelbooking.HotelBooking.repo;

import com.hotelbooking.HotelBooking.entity.Booking;
import com.hotelbooking.HotelBooking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRoomId(Long roomId);
    Optional<Booking> findByBookingConfirmationCode(String confirmationCode);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByStatus(BookingStatus status);

}
