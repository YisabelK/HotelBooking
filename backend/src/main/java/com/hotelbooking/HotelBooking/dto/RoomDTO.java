package com.hotelbooking.HotelBooking.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hotelbooking.HotelBooking.entity.RoomType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomDTO {

    private Long id;

    /*
     * Room type: Specifies the type of room and its maximum occupancy capacity
     * Room type: SINGLE_ROOM(1),DOUBLE_ROOM(2),FAMILY_ROOM(4),PREMIUM_ROOM(2);
     */
    private RoomType roomType;
    private int maxOccupancy;
    
    private BigDecimal roomPrice;
    private String roomPhotoUrl;
    private String roomDescription;
    private List<BookingDTO> bookings;
    

}
