package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTFilter;
import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.Trade;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.service.CalenderService;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaon/calender")
@Tag(name = "calender API", description = "calender 관련 API")
public class CalenderApiController {

    private final CalenderService calenderService;
    private final UserService userService;


    @Operation(summary = "일별 일정", description = "사용자의 일별 일정 목록을 조회할 때 사용합니다. ")
    @GetMapping("/{day}")
    public ResponseEntity<?> getDayCalender(@PathVariable("day") LocalDate day, HttpServletRequest request) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwtToken = authorizationHeader.substring(7);

                String email = JWTUtil.getEmail(jwtToken);
                User user = userService.findByEmail(email);

                if (user == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }
                List<Trade> findDayList = calenderService.getUserDayTradeList(day, user.getUserId());

                if (findDayList == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No trades found for the specified day");
                }

                return ResponseEntity.status(HttpStatus.OK).body(findDayList);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @Operation(summary = "상세 일정", description = "사용자의 일별 일정의 상세 내용을 조회할 때 사용합니다. ")
    @GetMapping("/{day}/detail")
    public ResponseEntity<?> getDayCalenderDetail(@PathVariable("day") LocalDate day, HttpServletRequest request) {
        try{
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwtToken = authorizationHeader.substring(7);
                String email = JWTUtil.getEmail(jwtToken);
                User user = userService.findByEmail(email);
                if (user == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }
                List<Trade> findDayTrade = calenderService.getUserDayTrade(day, user.getUserId());
                if (findDayTrade == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No trades found for the specified day");
                }
                return ResponseEntity.status(HttpStatus.OK).body(findDayTrade);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing Authorization header");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
}

