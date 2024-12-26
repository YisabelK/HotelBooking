package com.hotelbooking.HotelBooking.dto;

import com.hotelbooking.HotelBooking.entity.BookingStatus;
import lombok.Data;

@Data
public class BookingUpdateDTO {
    private Long bookingId;
    private BookingStatus status;
}
