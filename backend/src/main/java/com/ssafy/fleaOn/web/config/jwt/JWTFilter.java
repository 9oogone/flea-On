package com.ssafy.fleaOn.web.config.jwt;

import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.domain.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization != null) {
            System.out.println("Authorization: " + authorization);
        }

        // Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            System.out.println("Token is null or doesn't start with Bearer");
            filterChain.doFilter(request, response);
            return;
        }

        // "Bearer " 접두사 제거
        String token = authorization.substring(7).trim();
        System.out.println("jwtToken: " + token);

        try {
            if (jwtUtil.isExpired(token)) {
                System.out.println("Token expired");

                // 만료된 토큰을 갱신하여 새로운 토큰 생성
                String newToken = jwtUtil.refreshToken(token);
                response.addCookie(createCookie("Authorization", newToken));
                // 새로운 토큰으로 인증 세션 업데이트
                updateAuthentication(newToken);
                filterChain.doFilter(request, response);
                return;
            }

            // 토큰에서 username과 role 획득
            updateAuthentication(token);

        } catch (Exception e) {
            // JWT 파싱 오류 처리
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void updateAuthentication(String token) {
        String userIdentifier = jwtUtil.getUserIdentifier(token);
        String role = jwtUtil.getRole(token);
        String email = jwtUtil.getEmail(token);
        System.out.println("userIdentifier: " + userIdentifier);
        System.out.println("role: " + role);
        System.out.println("email: " + email);

        // userEntity를 생성하여 값 set
        User user = User.builder()
                .userIdentifier(userIdentifier)
                .role(role)
                .email(email)
                .build();

        // UserDetails에 회원 정보 객체 담기
        CustomOAuth2User customOAuth2User = new CustomOAuth2User(user);

        // 스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());

        // 세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

//        filterChain.doFilter(request, response);
//
//        String requestUri = request.getRequestURI();
    }

    private Cookie createCookie(String name, String value) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        //cookie.setHttpOnly(true);
        cookie.setMaxAge(60 * 60); // 1시간
        return cookie;
    }
}
