package com.hotelbooking.HotelBooking.controller;

import com.hotelbooking.HotelBooking.dto.LoginRequest;
import com.hotelbooking.HotelBooking.dto.Response;
import com.hotelbooking.HotelBooking.entity.User;
import com.hotelbooking.HotelBooking.service.interfac.IUserService;
import com.hotelbooking.HotelBooking.utils.JWTUtils;
import com.hotelbooking.HotelBooking.service.CustomUserDetailsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth Controller", description = "Authentication API")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/auth")
public class AuthController {

    private final IUserService userService;
    private final JWTUtils jwtUtils;
    private final CustomUserDetailsService customUserDetailsService;

    public AuthController(IUserService userService,
                         JWTUtils jwtUtils,
                         CustomUserDetailsService customUserDetailsService) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Operation(summary = "Register a new user", description = "Register a new user to the database")
    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody User user) {
        Response response = userService.register(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @Operation(summary = "Login a user", description = "Login a user to the database")
    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequest loginRequest){
        Response response = userService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /*
     * Refresh a user's access token
     * @param refreshToken
     * @return ResponseEntity<Response>
     */
    @Operation(summary = "Refresh a user's access token", description = "Refresh a user's access token")
    @PostMapping("/refresh-token")
    public ResponseEntity<Response> refreshToken(@RequestBody String refreshToken) {
        Response response = new Response();
        try {
            String userEmail = jwtUtils.extractUsername(refreshToken);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);
            
            if (jwtUtils.isValidToken(refreshToken, userDetails)) {
            String newAccessToken = jwtUtils.generateAccessToken(userDetails);
            response.setStatusCode(200);
            response.setAccessToken(newAccessToken);
            response.setMessage("Token refreshed successfully");
        } else {
            response.setStatusCode(401);
            response.setMessage("Invalid refresh token");
        }
    } catch (Exception e) {
        response.setStatusCode(401);
        response.setMessage("Token refresh failed: " + e.getMessage());
    }
    return ResponseEntity.status(response.getStatusCode()).body(response);
}

}
