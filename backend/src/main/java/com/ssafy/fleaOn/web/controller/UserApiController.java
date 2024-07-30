package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
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
    public ResponseEntity<?> deleteUser(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            Cookie jwtCookie = Arrays.stream(cookies)
                    .filter(cookie -> "Authorizatoin".equals(cookie.getName()))
                    .findFirst().orElse(null);

            if (jwtCookie != null) {
                String jwtToken = jwtCookie.getValue();

                String email = JWTUtil.getEmail(jwtToken);
                User user = userService.findByEmail(email);

                System.out.println("해당 회원 찾음 : " + user);

                if (user != null) {
                    userService.deleteUserByEmail(email);

                    return ResponseEntity.ok("회원 탈퇴 성공");
                }
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("회원 탈퇴 실패");
    }

    @GetMapping("/{email}/info")
    public ResponseEntity<?> getUserInfo(@PathVariable String email) {
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
    }

    @PutMapping("{email}/info")
    public ResponseEntity<?> updateUserInfo(@PathVariable String email, @RequestBody User user) {
        User getUser = userService.findByEmail(email);
        if (getUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        else{
            userService.updateUserByEmail(email, user);
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
    }
}

