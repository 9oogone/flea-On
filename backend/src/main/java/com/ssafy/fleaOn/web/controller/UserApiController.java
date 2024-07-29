package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.UserDTO;
import com.ssafy.fleaOn.web.entity.UserEntity;
import com.ssafy.fleaOn.web.jwt.JWTFilter;
import com.ssafy.fleaOn.web.jwt.JWTUtil;
import com.ssafy.fleaOn.web.repository.UserRepository;
import com.ssafy.fleaOn.web.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@Controller
@RequiredArgsConstructor
@RequestMapping("/fleaOn/users")
public class UserApiController {


    @Autowired
    private UserService userService;


    @PostMapping("/")
    public ResponseEntity<?> join() {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login() {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/")
    public ResponseEntity<?> deleteMember(HttpServletRequest request, HttpServletResponse response){
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            Cookie jwtCookie = Arrays.stream(cookies)
                    .filter(cookie -> "Authorizatoin".equals(cookie.getName()))
                    .findFirst().orElse(null);

            if(jwtCookie != null) {
                String jwtToken = jwtCookie.getValue();

                String email = JWTUtil.getEmail(jwtToken);
                UserEntity user = userService.findByEmail(email);

                System.out.println("해당 회원 찾음 : " + user);

                if(user != null) {
                    userService.deleteMember(email);

                    return ResponseEntity.ok("회원 탈퇴 성공");
                }
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("회원 탈퇴 실패");
    }

//    @GetMapping("/{id}/myPage")
//    public String myPage() {
//
//    }
//
//    @GetMapping("/main")
//    public String main(HttpServletRequest request, HttpServletResponse response) {
//
//    }



}
