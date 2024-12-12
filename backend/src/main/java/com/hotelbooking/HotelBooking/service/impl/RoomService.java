package com.hotelbooking.HotelBooking.service.impl;

import com.hotelbooking.HotelBooking.dto.Response;
import com.hotelbooking.HotelBooking.dto.RoomDTO;
import com.hotelbooking.HotelBooking.entity.Room;
import com.hotelbooking.HotelBooking.entity.RoomType;
import com.hotelbooking.HotelBooking.exception.OurException;
import com.hotelbooking.HotelBooking.repo.RoomRepository;
import com.hotelbooking.HotelBooking.service.AWSS3Service;
import com.hotelbooking.HotelBooking.service.interfac.IRoomService;
import com.hotelbooking.HotelBooking.utils.Utils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService implements IRoomService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private AWSS3Service awss3Service;

    /*
     * Add a new room
     * @param photo
     * @param roomType
     * @param roomPrice
     * @param description
     * @return Response
     */
    @Override
    public Response addNewRoom(MultipartFile photo, RoomType roomType, BigDecimal roomPrice, String description) {
        Response response = new Response();

        try {
            String imageUrl = awss3Service.saveImageToS3(photo);
            Room room = new Room();
            room.setRoomPhotoUrl(imageUrl);
            room.setRoomType(roomType);
            room.setRoomPrice(roomPrice);
            room.setRoomDescription(description);
            room.setMaxOccupancy(roomType.getMaxOccupancy());
            Room savedRoom = roomRepository.save(room);
            RoomDTO roomDTO = Utils.mapRoomEntityToRoomDTO(savedRoom);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoom(roomDTO);


        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error adding a room " + e.getMessage());
        }
        return response;
    }

    /*
     * Get all room types
     * @return List<Map<String, String>>
     */
    @Override
    public List<Map<String, String>> getAllRoomTypes() {
        return Arrays.stream(RoomType.values())
            .map(type -> {
                Map<String, String> roomTypeMap = new HashMap<>();
                roomTypeMap.put("value", type.name());
                roomTypeMap.put("displayName", type.getDisplayName());
                return roomTypeMap;
            })
            .collect(Collectors.toList());
    }

    /*
     * Get all rooms
     * @return Response
     */
    @Override
    public Response getAllRooms() {
        Response response = new Response();
        try {
            List<Room> roomList = roomRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            List<RoomDTO> roomDTOList = Utils.mapRoomListEntityToRoomListDTO(roomList);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoomList(roomDTOList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retrieving rooms: " + e.getMessage());
        }
        return response;
    }

    /*
     * Delete a room
     * @param roomId
     * @return Response
     */
    @Override
    public Response deleteRoom(Long roomId) {
        Response response = new Response();

        try {
            roomRepository.findById(roomId).orElseThrow(() -> new OurException("Room Not found"));
            roomRepository.deleteById(roomId);
            response.setStatusCode(200);
            response.setMessage("successful");


        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error deleting a room " + e.getMessage());
        }
        return response;
    }

    /*
     * Update a room
     * @param roomId
     * @param description
     * @param roomType
     * @param roomPrice
     * @param photo
     * @return Response
     */
    @Override
    public Response updateRoom(Long roomId, String description, RoomType roomType, BigDecimal roomPrice, MultipartFile photo) {
        Response response = new Response();

        try {
            String imageUrl = null;
            if(photo != null && !photo.isEmpty()){
                imageUrl = awss3Service.saveImageToS3(photo);
            }
            Room room = roomRepository.findById(roomId).orElseThrow(()-> new OurException("Room Not found"));

            if(roomType != null) room.setRoomType(roomType);
            if(roomPrice != null) room.setRoomPrice(roomPrice);
            if(description != null) room.setRoomDescription(description);
            if(imageUrl != null) room.setRoomPhotoUrl(imageUrl);

            Room updatedRoom = roomRepository.save(room);
            RoomDTO roomDTO = Utils.mapRoomEntityToRoomDTO(updatedRoom);

            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoom(roomDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error updating a room " + e.getMessage());
        }
        return response;
    }

    /*
     * Get a room by id
     * @param roomId
     * @return Response
     */
    @Override
    public Response getRoomById(Long roomId) {
        Response response = new Response();

        try {
            Room room = roomRepository.findById(roomId).orElseThrow(() -> new OurException("Room Not found"));
            RoomDTO roomDTO = Utils.mapRoomEntityToRoomDTOPlusBookings(room);

            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoom(roomDTO);


        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        }
        catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retrieving a room " + e.getMessage());
        }
        return response;
    }

    /*
     * Get available rooms by date and type
     * @param checkInDate
     * @param checkOutDate
     * @param roomType
     * @return Response
     */
    @Override
    public Response getAvailableRoomsByDateAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        Response response = new Response();
        try {
            RoomType enumRoomType = RoomType.valueOf(roomType);
            List<Room> availableRooms = roomRepository.findAvailableRoomsByDatesAndTypes(checkInDate, checkOutDate, enumRoomType);
            List<RoomDTO> roomDTOList = Utils.mapRoomListEntityToRoomListDTO(availableRooms);
            
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoomList(roomDTOList);
        } catch (IllegalArgumentException e) {
            response.setStatusCode(400);
            response.setMessage("Invalid room type: " + roomType);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error finding available rooms: " + e.getMessage());
        }
        return response;
    }

    /*
     * Get all available rooms
     * @return Response
     */
    @Override
    public Response getAllAvailableRooms() {
        Response response = new Response();

        try {
            List<Room> roomList = roomRepository.getAllAvailableRooms();
            List<RoomDTO> roomDTOList = Utils.mapRoomListEntityToRoomListDTO(roomList);

            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoomList(roomDTOList);


        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retrieving available rooms " + e.getMessage());
        }
        return response;
    }
}
