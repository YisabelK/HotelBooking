package com.hotelbooking.HotelBooking.service.impl;

import com.hotelbooking.HotelBooking.dto.LoginRequest;
import com.hotelbooking.HotelBooking.dto.Response;
import com.hotelbooking.HotelBooking.dto.UserDTO;
import com.hotelbooking.HotelBooking.entity.User;
import com.hotelbooking.HotelBooking.exception.OurException;
import com.hotelbooking.HotelBooking.repo.UserRepository;
import com.hotelbooking.HotelBooking.service.interfac.IUserService;
import com.hotelbooking.HotelBooking.utils.JWTUtils;
import com.hotelbooking.HotelBooking.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Response register(User user) {
        Response response = new Response();
        try {
            if(user.getRole() == null || user.getRole().isBlank()){
                user.setRole("USER");
            }
            if(userRepository.existsByEmail(user.getEmail())){
                throw new OurException(user.getEmail() + "Already Exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            response.setStatusCode(200);
            response.setUser(userDTO);
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e){
            response.setStatusCode(500);
            response.setMessage("Error Occurred During User Registration " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response login(LoginRequest loginRequest) {

        Response response = new Response();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new OurException("user Not found"));

            var token = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(token);
            response.setRole(user.getRole());
            response.setExpirationTime("7 Days");
            response.setMessage("successful");

        } catch (OurException e){
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e){
            response.setStatusCode(500);
            response.setMessage("Error Occurred During User Login " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllUsers() {
        Response response = new Response();
        try {
            List<User> userList = userRepository.findAll();
            List<UserDTO> userDTOList = Utils.mapUserListEntityToUserListDTO(userList);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUserList(userDTOList);

        } catch (Exception e){
            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserBookingHistory(String userId) {
        Response response = new Response();
        try {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTOPlusUserBookingAndRoom(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        }catch (OurException e){
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response ;
    }

    @Override
    public Response deleteUser(String userId) {

        Response response = new Response();

        try {
            userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new OurException("User Not Found"));
            userRepository.deleteById(Long.valueOf(userId));
            response.setStatusCode(200);
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserById(String userId) {

        Response response = new Response();

        try {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getMyInfo(String email) {
        Response response = new Response();

        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTOPlusUserBookingAndRoom(user);

            response.setPastBookings(userDTO.getPastBookings());
            response.setUpcomingBookings(userDTO.getUpcomingBookings());

            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting user info: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateProfile(String email, User userRequest) {
        Response response = new Response();
        try {
            User existingUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new OurException("User Not Found"));

            if (userRequest.getName() != null && !userRequest.getName().isEmpty()) {
                existingUser.setName(userRequest.getName());
            }
            if (userRequest.getPhoneNumber() != null && !userRequest.getPhoneNumber().isEmpty()) {
                existingUser.setPhoneNumber(userRequest.getPhoneNumber());
            }
            if (userRequest.getStreetName() != null && !userRequest.getStreetName().isEmpty()) {
                existingUser.setStreetName(userRequest.getStreetName());
            }
            if (userRequest.getHouseNumber() != null && !userRequest.getHouseNumber().isEmpty()) {
                existingUser.setHouseNumber(userRequest.getHouseNumber());
            }
            if (userRequest.getPostalCode() != null && !userRequest.getPostalCode().isEmpty()) {
                existingUser.setPostalCode(userRequest.getPostalCode());
            }
            if (userRequest.getCity() != null && !userRequest.getCity().isEmpty()) {
                existingUser.setCity(userRequest.getCity());
            }
            if (userRequest.getState() != null && !userRequest.getState().isEmpty()) {
                existingUser.setState(userRequest.getState());
            }
            if (userRequest.getCountry() != null && !userRequest.getCountry().isEmpty()) {
                existingUser.setCountry(userRequest.getCountry());
            }
            if (userRequest.getBirthDate() != null) {
                existingUser.setBirthDate(userRequest.getBirthDate());
            }
            if (userRequest.getGender() != null && !userRequest.getGender().isEmpty()) {
                existingUser.setGender(userRequest.getGender());
            }
            if (userRequest.getEmail() != null && !userRequest.getEmail().isEmpty()
                    && !userRequest.getEmail().equals(existingUser.getEmail())) {
                if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
                    throw new OurException("Email already exists");
                }
                existingUser.setEmail(userRequest.getEmail());
            }

            User updatedUser = userRepository.save(existingUser);
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(updatedUser);

            response.setStatusCode(200);
            response.setMessage("Profile updated successfully");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error updating profile: " + e.getMessage());
        }
        return response;
    }
}
