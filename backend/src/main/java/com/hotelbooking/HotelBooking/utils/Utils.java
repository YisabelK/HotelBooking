package com.hotelbooking.HotelBooking.utils;

import com.hotelbooking.HotelBooking.dto.BookingDTO;
import com.hotelbooking.HotelBooking.dto.RoomDTO;
import com.hotelbooking.HotelBooking.dto.UserDTO;
import com.hotelbooking.HotelBooking.entity.Booking;
import com.hotelbooking.HotelBooking.entity.Room;
import com.hotelbooking.HotelBooking.entity.User;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;

public class Utils {
    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private static final SecureRandom secureRandom = new SecureRandom();

    private Utils() {
        // Private constructor to hide implicit public one
    }

    public static String generateRandomConfirmationCode (int length) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
            char randomChar = ALPHANUMERIC_STRING.charAt(randomIndex);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }

    /*
     * Map User entity to UserDTO
     * @param user
     * @return UserDTO
     */
    public static UserDTO mapUserEntityToUserDTO (User user){
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        userDTO.setStreetName(user.getStreetName());
        userDTO.setHouseNumber(user.getHouseNumber());
        userDTO.setPostalCode(user.getPostalCode());
        userDTO.setCity(user.getCity());
        userDTO.setState(user.getState());
        userDTO.setCountry(user.getCountry());
        userDTO.setBirthDate(user.getBirthDate());
        userDTO.setGender(user.getGender());

        return userDTO;
    }

    /*
     * Map Room entity to RoomDTO
     * @param room
     * @return RoomDTO
     */
    public static RoomDTO mapRoomEntityToRoomDTO (Room room){
        RoomDTO roomDTO = new RoomDTO();

        roomDTO.setId(room.getId());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setRoomPhotoUrl(room.getRoomPhotoUrl());
        roomDTO.setRoomDescription(room.getRoomDescription());
        return roomDTO;
    }

    /*
     * Map Booking entity to BookingDTO
     * @param booking
     * @return BookingDTO
     */
    public static BookingDTO mapBookingEntityToBookingDTO (Booking booking){
        BookingDTO bookingDTO = new BookingDTO();

        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalNumOfGuest(booking.getTotalNumOfGuest());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
        bookingDTO.setStatus(booking.getStatus());

        if (booking.getUser() != null) {
            UserDTO userDTO = mapUserEntityToUserDTO(booking.getUser());
            bookingDTO.setUser(userDTO);
        }

        if (booking.getRoom() != null) {
            RoomDTO roomDTO = mapRoomEntityToRoomDTO(booking.getRoom());
            bookingDTO.setRoom(roomDTO);
        }

        return bookingDTO;
    }

    /*
     * Map Room entity to RoomDTO with bookings
     * @param room
     * @return RoomDTO
     */
    public static RoomDTO mapRoomEntityToRoomDTOPlusBookings (Room room){
    RoomDTO roomDTO = new RoomDTO();

    roomDTO.setId(room.getId());
    roomDTO.setRoomType(room.getRoomType());
    roomDTO.setRoomPrice(room.getRoomPrice());
    roomDTO.setRoomPhotoUrl(room.getRoomPhotoUrl());
    roomDTO.setRoomDescription(room.getRoomDescription());
    roomDTO.setMaxOccupancy(room.getMaxOccupancy());

    if(room.getBookings() != null) {
        roomDTO.setBookings(room.getBookings().stream()
                .map(booking -> mapBookingEntityToBookingDTOPlusBookedRooms(booking, true))
                .toList());
    }
    return roomDTO;
}

    /*
     * Map User entity to UserDTO with bookings and rooms
     * @param user
     * @return UserDTO
     */
    public static UserDTO mapUserEntityToUserDTOPlusUserBookingAndRoom(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        userDTO.setStreetName(user.getStreetName());
        userDTO.setHouseNumber(user.getHouseNumber());
        userDTO.setPostalCode(user.getPostalCode());
        userDTO.setCity(user.getCity());
        userDTO.setState(user.getState());
        userDTO.setCountry(user.getCountry());
        userDTO.setBirthDate(user.getBirthDate());
        userDTO.setGender(user.getGender());

        if (!user.getBookings().isEmpty()) {
            LocalDate today = LocalDate.now();

            List<BookingDTO> pastBookings = user.getBookings().stream()
                    .filter(booking -> booking.getCheckOutDate().isBefore(today))
                    .map(booking -> mapBookingEntityToBookingDTOPlusBookedRooms(booking, false))
                    .toList();

            List<BookingDTO> upcomingBookings = user.getBookings().stream()
                    .filter(booking -> !booking.getCheckOutDate().isBefore(today))
                    .map(booking -> mapBookingEntityToBookingDTOPlusBookedRooms(booking, false))
                    .toList();

            userDTO.setPastBookings(pastBookings);
            userDTO.setUpcomingBookings(upcomingBookings);
        }

        return userDTO;
    }

    /*
     * Map Booking entity to BookingDTO with booked rooms
     * @param booking
     * @param mapUser
     * @return BookingDTO
     */
    public static BookingDTO mapBookingEntityToBookingDTOPlusBookedRooms(Booking booking, boolean mapUser){
        BookingDTO bookingDTO = new BookingDTO();

        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalNumOfGuest(booking.getTotalNumOfGuest());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
        
        if(mapUser) {
            bookingDTO.setUser(Utils.mapUserEntityToUserDTO(booking.getUser()));
        }
        
        if (booking.getRoom() != null){
            RoomDTO roomDTO = new RoomDTO();
            roomDTO.setId(booking.getRoom().getId());
            roomDTO.setRoomType(booking.getRoom().getRoomType());
            roomDTO.setRoomPrice(booking.getRoom().getRoomPrice());
            roomDTO.setRoomPhotoUrl(booking.getRoom().getRoomPhotoUrl());
            roomDTO.setRoomDescription(booking.getRoom().getRoomDescription());
            bookingDTO.setRoom(roomDTO);
        }
        
        return bookingDTO;
    }

    /*
     * Map User entity to UserDTO
     * @param userList
     * @return List<UserDTO>
     */
    public static List<UserDTO> mapUserListEntityToUserListDTO(List<User> userList){
        return userList.stream().map(Utils::mapUserEntityToUserDTO).toList();
    }

    /*
     * Map Room entity to RoomDTO
     * @param roomList
     * @return List<RoomDTO>
     */
    public static List<RoomDTO> mapRoomListEntityToRoomListDTO(List<Room> roomList){
        return roomList.stream().map(Utils::mapRoomEntityToRoomDTO).toList();
    }

    /*
     * Map Booking entity to BookingDTO
     * @param bookingList
     * @return List<BookingDTO>
     */
    public static List<BookingDTO> mapBookingListEntityToBookingListDTO(List<Booking> bookingList){
        return bookingList.stream().map(Utils::mapBookingEntityToBookingDTO).toList();
    }

}
