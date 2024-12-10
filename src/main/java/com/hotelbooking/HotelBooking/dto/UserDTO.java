package com.hotelbooking.HotelBooking.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    private Long id;
    private String email;
    private String name;
    private String phoneNumber;
    private String role;
    
    // Detailed address fields
    private String streetName;
    private String houseNumber;
    private String postalCode;
    private String city;
    private String state;
    private String country;
    
    private LocalDate birthDate;
    private String gender;
    private List<BookingDTO> pastBookings = new ArrayList<>();
    private List<BookingDTO> upcomingBookings = new ArrayList<>();
}
