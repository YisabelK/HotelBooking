package com.hotelbooking.HotelBooking.service.interfac;

import com.hotelbooking.HotelBooking.dto.Response;
import com.hotelbooking.HotelBooking.entity.Booking;

public interface IBookingService {
    Response saveBooking (Long roomId, Long userId, Booking bookingRequest);
    Response findBookingByConfirmationCode(String confirmationCode);

    Response getAllBookings();
    Response cancelBooking(Long bookingId);
}
