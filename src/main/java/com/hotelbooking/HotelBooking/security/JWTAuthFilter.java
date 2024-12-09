package com.hotelbooking.HotelBooking.security;

import com.hotelbooking.HotelBooking.service.CustomUserDetailsService;
import com.hotelbooking.HotelBooking.utils.JWTUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String userEmail;

        // Authorization 헤더가 없거나 Bearer로 시작하지 않으면 다음 필터로 넘김
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Bearer 다음의 토큰 추출
        jwtToken = authHeader.substring(7);

        try {
            // 토큰에서 이메일 추출
            userEmail = jwtUtils.extractUsername(jwtToken);

            // 이메일이 존재하고 현재 인증된 상태가 아닌 경우
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // UserDetails 로드
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);

                // 토큰 유효성 검증
                if (jwtUtils.isValidToken(jwtToken, userDetails)) {
                    // 새로운 SecurityContext 생성
                    SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

                    // Authentication 객체 생성
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // 요청 상세 정보 설정
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // SecurityContext에 Authentication 설정
                    securityContext.setAuthentication(authToken);
                    SecurityContextHolder.setContext(securityContext);
                }
            }
        } catch (Exception e) {
            // 토큰 처리 중 오류 발생 시 로깅 (실제 환경에서는 적절한 로깅 구현 필요)
            logger.error("JWT Token processing error: " + e.getMessage());
        }

        // 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}