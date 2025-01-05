package com.hotelbooking.HotelBooking.security;

import com.hotelbooking.HotelBooking.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {

    private static final String ROLE_ADMIN = "ADMIN";
    
    @Bean
    public AuthenticationProvider authenticationProvider(CustomUserDetailsService customUserDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JWTAuthFilter jwtAuthFilter) throws Exception {
        return http
                .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Public
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/rooms/all").permitAll()
                .requestMatchers("/rooms/room-by-id/**").permitAll()
                .requestMatchers("/rooms/types").permitAll()
                .requestMatchers("/rooms/available-rooms-by-date-and-type/**").permitAll()
                .requestMatchers("/rooms/all-available-rooms").permitAll()
                // Booking
                .requestMatchers(HttpMethod.POST, "/bookings/book-room/**").authenticated()
                .requestMatchers("/bookings/pending").hasAuthority(ROLE_ADMIN)
                .requestMatchers("/bookings/all").hasAuthority(ROLE_ADMIN)
                .requestMatchers(HttpMethod.PUT, "/bookings/update-status").hasAuthority(ROLE_ADMIN)
                .requestMatchers("/bookings/get-by-confirmation-code/**").authenticated()
                .requestMatchers("/bookings/cancel/**").authenticated()
                
                // Admin only
                .requestMatchers("/users/all").hasAuthority(ROLE_ADMIN)
                .requestMatchers("/rooms/add").hasAuthority(ROLE_ADMIN)
                .requestMatchers("/rooms/update/**").hasAuthority(ROLE_ADMIN)
                .requestMatchers("/rooms/delete/**").hasAuthority(ROLE_ADMIN)
                
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
}
