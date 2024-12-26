package com.hotelbooking.HotelBooking.controller;

import com.hotelbooking.HotelBooking.dto.Response;
import com.hotelbooking.HotelBooking.entity.RoomType;
import com.hotelbooking.HotelBooking.service.interfac.IRoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Tag(name = "Room Controller", description = "Room API")
@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final IRoomService roomService;

    public RoomController(IRoomService roomService) {
        this.roomService = roomService;
    }

    @Operation(summary = "Add a new room", description = "Add a new room to the database")
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> addNewRoom(
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "roomType", required = false) RoomType roomType,
            @RequestParam(value = "roomPrice", required = false) BigDecimal roomPrice,
            @RequestParam(value = "roomDescription", required = false) String roomDescription
    ) {
        if(photo == null || photo.isEmpty() || roomType == null || roomPrice == null){
            Response response = new Response();
            response.setStatusCode(400);
            response.setMessage("Please provide values for all fields(photo, roomType, roomPrice)");
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }
        Response response = roomService.addNewRoom(photo, roomType, roomPrice, roomDescription);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Update a room", description = "Update a room in the database")
    @PutMapping("/update/{roomId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateRoom(@PathVariable Long roomId,
                                               @RequestParam(value = "photo", required = false)MultipartFile photo,
                                               @RequestParam(value = "roomType", required = false) RoomType roomType,
                                               @RequestParam(value = "roomPrice", required = false)BigDecimal roomPrice,
                                               @RequestParam(value = "roomDescription", required = false)String roomDescription
                                               ){
        Response response = roomService.updateRoom(roomId, roomDescription, roomType, roomPrice, photo);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Delete a room", description = "Delete a room from the database")
    @DeleteMapping("/delete/{roomId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteRoom(@PathVariable Long roomId){
        Response response = roomService.deleteRoom(roomId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Get all rooms", description = "Get all rooms from the database")
    @GetMapping("/all")
    public ResponseEntity<Response> getAllRooms() {
        Response response = roomService.getAllRooms();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Get all room types", description = "Get all room types from the database")
    @GetMapping("/types")
    public List<Map<String, String>> getRoomTypes() {
        return roomService.getAllRoomTypes();
    }

    @Operation(summary = "Get a room by id", description = "Get a room by id from the database")
    @GetMapping("/room-by-id/{roomId}")
    public ResponseEntity<Response> getRoomById(@PathVariable Long roomId) {
        Response response = roomService.getRoomById(roomId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Get all available rooms", description = "Get all available rooms from the database")
    @GetMapping("/all-available-rooms")
    public ResponseEntity<Response> getAvailableRooms() {
        Response response = roomService.getAllAvailableRooms();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Get all available rooms by date and type", description = "Get all available rooms by date and type from the database")
    @GetMapping("/available-rooms-by-date-and-type")
    public ResponseEntity<Response> getAvailableRoomsByDateAndType(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam(required = false) String roomType
    ) {
        Response response = new Response();
        
        // Required fields check
        if(checkInDate == null || roomType == null || roomType.isBlank() || checkOutDate == null) {
            response.setStatusCode(400);
            response.setMessage("Please provide values for all fields(checkInDate, checkOutDate, roomType)");
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }
        
        // Check if check-out date is before check-in date
        if(checkOutDate.isBefore(checkInDate)) {
            response.setStatusCode(400);
            response.setMessage("Check-out date cannot be before check-in date");
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }
        
        // Check if check-in date is in the past
        if(checkInDate.isBefore(LocalDate.now())) {
            response.setStatusCode(400);
            response.setMessage("Check-in date cannot be in the past");
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }
        
        response = roomService.getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


}
