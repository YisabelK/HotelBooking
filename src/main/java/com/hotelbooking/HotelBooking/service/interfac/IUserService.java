package com.hotelbooking.HotelBooking.service.interfac;

import com.hotelbooking.HotelBooking.dto.LoginRequest;
import com.hotelbooking.HotelBooking.dto.Response;
import com.hotelbooking.HotelBooking.entity.User;

public interface IUserService {
    Response register(User user);
    Response login(LoginRequest loginRequest);
    Response getAllUsers();
    Response getUserBookingHistory(String userId);
    Response deleteUser(String userId);
    Response getUserById(String userId);
    Response getMyInfo(String email);


}
