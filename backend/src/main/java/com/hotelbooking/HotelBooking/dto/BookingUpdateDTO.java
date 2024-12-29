package com.hotelbooking.HotelBooking.dto;

import com.hotelbooking.HotelBooking.entity.BookingStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;


@Data
public class BookingUpdateDTO {
    private Long bookingId;
    
    @JsonProperty("status")
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}
