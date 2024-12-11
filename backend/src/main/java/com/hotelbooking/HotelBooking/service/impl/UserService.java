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
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;

    /*
     * Register a new user
     * @param user
     * @return Response
     */
    @Override
    @Transactional
    public Response register(User user) {
        Response response = new Response();
        
        try {
            if(user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("USER");
            }

            if(userRepository.existsByEmail(user.getEmail())) {
                response.setStatusCode(400);
                response.setMessage("Email already exists: " + user.getEmail());
                return response;
            }

            if (!user.getPassword().equals(user.getPasswordConfirm())) {
                response.setStatusCode(400);
                response.setMessage("Passwords do not match");
                return response;
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));

            User savedUser = userRepository.save(user);

            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            response.setStatusCode(200);
            response.setUser(userDTO);
            response.setMessage("Registration successful");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Registration failed: " + e.getMessage());
        }
        
        return response;
    }

    /*
     * Login a user
     * @param loginRequest
     * @return Response
     */
    @Override
    public Response login(LoginRequest loginRequest) {
        Response response = new Response();
        try {
            var user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new OurException("This email does not exist."));
            
            try {
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
                );
            } catch (BadCredentialsException e) {
                response.setStatusCode(401);
                response.setMessage("The password does not match.");
                return response;
            }

            String accessToken = jwtUtils.generateAccessToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(user);
            
            response.setStatusCode(200);
            response.setAccessToken(accessToken);
            response.setRefreshToken(refreshToken);
            response.setRole(user.getRole());
            response.setExpirationTime("30 minutes");
            response.setMessage("Login successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("An error occurred during login: " + e.getMessage());
        }
        return response;
    }

    /*
     * Get all users
     * @return Response
     */
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

    /*
     * Get a user's booking history
     * @param userId
     * @return Response
     */
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
            response.setMessage("Error getting booking history " + e.getMessage());
        }
        return response ;
    }

    /*
     * Delete a user
     * @param userId
     * @return Response
     */
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
            response.setMessage("Error deleting user " + e.getMessage());
        }
        return response;
    }

    /*
     * Get a user by id
     * @param userId
     * @return Response
     */
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
            response.setMessage("Error getting user info " + e.getMessage());
        }
        return response;
    }

    /*
     * Get my info
     * @param email
     * @return Response
     */
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

    /*
     * Update a user's profile
     * @param email
     * @param userRequest
     * @return Response
     */
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