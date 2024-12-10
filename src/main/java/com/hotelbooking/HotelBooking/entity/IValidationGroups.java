package com.hotelbooking.HotelBooking.entity;

/*
 * Password confirmation is only required during the registration process
 * This interface is used to skip the validation during profile updates or other operations 
 */
public interface IValidationGroups {
    interface Registration {}
    interface Update {}
}
