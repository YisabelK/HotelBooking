package com.hotelbooking.HotelBooking.service.interfac;

import com.hotelbooking.HotelBooking.dto.Response;
import com.hotelbooking.HotelBooking.entity.RoomType;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IRoomService {
    Response addNewRoom(MultipartFile photo, RoomType roomType, BigDecimal roomPrice, String description);
    List<Map<String, String>> getAllRoomTypes();

    Response getAllRooms();

    Response deleteRoom(Long roomId);
    Response updateRoom(Long roomId, String description, RoomType roomType, BigDecimal roomPrice, MultipartFile photo);
    Response getRoomById(Long roomId);
    Response getAvailableRoomsByDateAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType);
    Response getAllAvailableRooms();
}
