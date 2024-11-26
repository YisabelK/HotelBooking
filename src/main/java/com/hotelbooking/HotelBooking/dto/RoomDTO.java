package com.hotelbooking.HotelBooking.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hotelbooking.HotelBooking.entity.Booking;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomDTO {

    private Long id;
    private String roomType;
    private String roomPrice;
    private String roomPhotoUrl;
    private String roomDescription;
    private List<BookingDTO> bookings;
}
