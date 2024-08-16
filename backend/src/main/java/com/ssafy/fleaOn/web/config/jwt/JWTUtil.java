package com.ssafy.fleaOn.web.config.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTUtil {

    private static SecretKey secretKey;
    private final String secret;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        this.secret = secret;
    }

    @PostConstruct
    public void init() {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());
    }

    public String getUserIdentifier(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("userIdentifier", String.class);
    }

    public static String getEmail(String token) {
        String email = Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("email", String.class);
        System.out.println("Email from Token: " + email); // 토큰에서 추출한 이메일 확인
        return email;
    }

    public String getRole(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public Boolean isExpired(String token) {
        try {
            Date expiration = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true; // 만료된 경우 예외를 던질 수 있음
        }
    }

    public static String createJwt(String userIdentifier, String role, String email, Long expiredMs) {
        return Jwts.builder()
                .claim("userIdentifier", userIdentifier)
                .claim("role", role)
                .claim("email", email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public static String refreshToken(String token) {
        Claims claims;
        try {
            claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            claims = e.getClaims();
        }

        String userIdentifier = claims.get("userIdentifier", String.class);
        String role = claims.get("role", String.class);
        String email = claims.get("email", String.class);

        return createJwt(userIdentifier, role, email, 3600000L); // 1시간 연장
    }
}
