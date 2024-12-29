package com.hotelbooking.HotelBooking.controller;

import com.hotelbooking.HotelBooking.dto.BookingUpdateDTO;
import com.hotelbooking.HotelBooking.dto.Response;
import com.hotelbooking.HotelBooking.entity.Booking;
import com.hotelbooking.HotelBooking.service.interfac.IBookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Booking Controller", description = "Booking API")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/bookings")
public class BookingController {
    
    private final IBookingService bookingService;

    public BookingController(IBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Operation(summary = "Book a room", description = "Book a room to the database")
    @PostMapping("/book-room/{roomId}/{userId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> saveBookings(@PathVariable Long roomId,
                                                 @PathVariable Long userId,
                                                 @RequestBody Booking bookingRequest){
        Response response = bookingService.saveBooking(roomId, userId, bookingRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update-status")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Update booking status", description = "Update a booking status in the database")
    public ResponseEntity<Response> updateBookingStatus(@RequestBody BookingUpdateDTO bookingUpdateDTO) {
        Response response = bookingService.updateBookingStatus(
                bookingUpdateDTO.getBookingId(),
                bookingUpdateDTO.getStatus()
        );
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Get all pending bookings", description = "Get all pending bookings from the database")
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllPendingBookings() {
        Response response = bookingService.getAllPendingBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Get all bookings", description = "Get all bookings from the database")
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllBookings() {
        Response response = bookingService.getAllBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-confirmation-code/{confirmationCode}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @Operation(summary = "Get booking by confirmation code", description = "Get a booking by confirmation code from the database")
    public ResponseEntity<Response> getBookingByConfirmationCode(@PathVariable String confirmationCode) {
        Response response = bookingService.findBookingByConfirmationCode(confirmationCode);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Cancel a booking", description = "Cancel a booking from the database")
    @DeleteMapping("/cancel/{bookingId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> cancelBooking(@PathVariable Long bookingId) {
        Response response = bookingService.cancelBooking(bookingId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }






}
