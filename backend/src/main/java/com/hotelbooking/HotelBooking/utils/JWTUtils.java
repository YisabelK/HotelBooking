package com.hotelbooking.HotelBooking.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

/*
 * JWT Utils: Generate and validate JWT tokens 
 * access token is valid for 30 minutes
 * refresh token is valid for 14 days
 */
@Service
public class JWTUtils {

    private static final long ACCESS_TOKEN_EXPIRATION = 1000L * 60 * 30; // 30 minutes
    private static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 14; // 14 days
    
    private final SecretKey key;
    
    public JWTUtils(@Value("${jwt.secret}") String secretKey) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails, ACCESS_TOKEN_EXPIRATION);
    }
    
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, REFRESH_TOKEN_EXPIRATION);
    }

    private String generateToken(UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token){
        return extractClaims(token, Claims::getSubject);
    }
    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
        return claimsTFunction.apply(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload());
    }
    public boolean isValidToken(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token){
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }
}
