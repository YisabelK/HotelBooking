package com.hotelbooking.HotelBooking.service.impl;

import com.hotelbooking.HotelBooking.common.GlobalStrings;
import com.hotelbooking.HotelBooking.dto.BookingDTO;
import com.hotelbooking.HotelBooking.dto.Response;
import com.hotelbooking.HotelBooking.entity.Booking;
import com.hotelbooking.HotelBooking.entity.BookingStatus;
import com.hotelbooking.HotelBooking.entity.Room;
import com.hotelbooking.HotelBooking.entity.User;
import com.hotelbooking.HotelBooking.exception.OurException;
import com.hotelbooking.HotelBooking.repo.BookingRepository;
import com.hotelbooking.HotelBooking.repo.RoomRepository;
import com.hotelbooking.HotelBooking.repo.UserRepository;
import com.hotelbooking.HotelBooking.service.interfac.IBookingService;
import com.hotelbooking.HotelBooking.utils.Utils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BookingService implements IBookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager;

    public BookingService(BookingRepository bookingRepository,
                         RoomRepository roomRepository,
                         UserRepository userRepository,
                         EntityManager entityManager) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
    }

    /*
     * Save a booking
     * @param roomId
     * @param userId
     * @param bookingRequest
     * @return Response
     */
    @Override
    public Response saveBooking(Long roomId, Long userId, Booking bookingRequest) {
        Response response = new Response();
        try {
            Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new OurException("Room Not Found"));
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new OurException("User Not Found"));

            bookingRequest.setRoom(room);
            bookingRequest.setUser(user);
            bookingRequest.setStatus(BookingStatus.PENDING);
            bookingRequest.setTotalNumOfGuest(
                bookingRequest.getNumOfAdults() + bookingRequest.getNumOfChildren()
            );

            String confirmationCode = UUID.randomUUID().toString();
            bookingRequest.setBookingConfirmationCode(confirmationCode);

            Booking savedBooking = bookingRepository.save(bookingRequest);
            BookingDTO bookingDTO = Utils.mapBookingEntityToBookingDTO(savedBooking);

            response.setStatusCode(200);
            response.setMessage(GlobalStrings.SUCCESSFUL);
            response.setBooking(bookingDTO);
            response.setBookingConfirmationCode(confirmationCode);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Saving a booking: " + e.getMessage());
        }
        return response;
    }

    /*
     * Update a booking status
     * @param bookingId
     * @param status
     * @return Response
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Response updateBookingStatus(Long bookingId, BookingStatus status) {
        Response response = new Response();
        try {
            Query query = entityManager.createQuery(
                "UPDATE Booking b SET b.status = :status WHERE b.id = :id"
            );
            query.setParameter("status", status);
            query.setParameter("id", bookingId);
            
            int updatedCount = query.executeUpdate();
            
            if (updatedCount == 0) {
                throw new OurException("Booking does Not Exist");
            }
            
            Booking updatedBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new OurException("Booking does Not Exist"));
            
            BookingDTO bookingDTO = Utils.mapBookingEntityToBookingDTO(updatedBooking);
            response.setStatusCode(200);
            response.setMessage(GlobalStrings.SUCCESSFUL);
            response.setBooking(bookingDTO);
            
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Updating Booking Status: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    /*
     * Find a booking by confirmation code
     * @param confirmationCode
     * @return Response
     */
    @Override
    public Response findBookingByConfirmationCode(String confirmationCode) {
        Response response = new Response();
        try {
            Booking booking = bookingRepository.findByBookingConfirmationCode(confirmationCode).orElseThrow(() -> new OurException("Booking Not Found"));
            BookingDTO bookingDTO = Utils.mapBookingEntityToBookingDTO(booking);
            response.setStatusCode(200);
            response.setMessage(GlobalStrings.SUCCESSFUL);
            response.setBooking(bookingDTO);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error finding a booking: " + e.getMessage());
        }
        return response;
    }

    /*
     * Get all bookings
     * @return Response
     */
    @Override
    public Response getAllBookings() {
        Response response = new Response();
        try {
            List<Booking> bookingList = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            List<BookingDTO> bookingDTOList = Utils.mapBookingListEntityToBookingListDTO(bookingList);
            response.setStatusCode(200);
            response.setMessage(GlobalStrings.SUCCESSFUL);
            response.setBookingList(bookingDTOList);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting all bookings: " + e.getMessage());
        }
        return response;
    }

    /*
     * Get all pending bookings
     * @return Response
     */
    @Override
    public Response getAllPendingBookings() {
        Response response = new Response();
        try {
            List<Booking> bookingList = bookingRepository.findByStatus(BookingStatus.PENDING);
            List<BookingDTO> bookingDTOList = Utils.mapBookingListEntityToBookingListDTO(bookingList);
            response.setStatusCode(200);
            response.setMessage(GlobalStrings.SUCCESSFUL);
            response.setBookingList(bookingDTOList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting pending bookings: " + e.getMessage());
        }
        return response;
    }

    /*
     * Cancel a booking
     * @param bookingId
     * @return Response
     */
    @Override
    public Response cancelBooking(Long bookingId) {
        Response response = new Response();
        try {
            Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new OurException("Booking does Not Exist"));
            bookingRepository.delete(booking);
            response.setStatusCode(200);
            response.setMessage(GlobalStrings.SUCCESSFUL);
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Cancelling a booking: " + e.getMessage());
        }
        return response;
    }

    /*
     * Check if a room is available for the given booking request
     * @param bookingRequest
     * @param existingBookings
     * @return boolean
     */
    private boolean roomIsAvailable(Booking bookingRequest, List<Booking> existingBookings) {

        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                                || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))

                                ||(bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
                );
    }
}
