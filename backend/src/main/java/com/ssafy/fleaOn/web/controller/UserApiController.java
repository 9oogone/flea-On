package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaon/users")
@CrossOrigin("*")
public class UserApiController {

    private final UserService userService;


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
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7).trim(); // "Bearer " 이후의 토큰만 추출하고 공백 제거
            System.out.println("jwtToken: " + jwtToken);

            try {
                String email = JWTUtil.getEmail(jwtToken); // JWTUtil을 사용하여 토큰에서 이메일 추출
                System.out.println("email : " + email);
                User user = userService.findByEmail(email);

                System.out.println("해당 회원 찾음 : " + user);

                if (user != null) {
                    userService.deleteUserByEmail(email);
                    return ResponseEntity.ok("회원 탈퇴 성공");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 탈퇴 실패: 사용자를 찾을 수 없습니다.");
                }
            } catch (Exception e) {
                // JWT 파싱 오류 처리
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("회원 탈퇴 실패: 잘못된 토큰입니다.");
            }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원 탈퇴 실패: 토큰이 없습니다.");
    }

    @GetMapping("/{email}/info")
    public ResponseEntity<?> getUserInfo(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
    }

    @PutMapping("{email}/info")
    public ResponseEntity<?> updateUserInfo(@PathVariable("email") String email, @RequestBody User user) {
        User getUser = userService.findByEmail(email);
        if (getUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            userService.updateUserByEmail(email, user);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }

    @GetMapping("/{email}/mypage")
    public ResponseEntity<?> getMyPage(@PathVariable("email") String email) {
        Map<String, Object> userInfo = userService.getUserInfoByEmail(email);

        if (userInfo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(userInfo);
        }
    }

    @GetMapping("/{email}/{tradeDate}/schedule")
    public ResponseEntity<?> getUserSchedule(@PathVariable("email") String email, @PathVariable("tradeDate") LocalDate tradeDate) {
        User user = userService.findByEmail(email);
        Optional<List<Map<String, Object>>> userScheduleList = userService.getUserScheduleListByIdAndDate(user.getUserId(), tradeDate);

        if (userScheduleList.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(userScheduleList.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/{email}/purchaseList")
    public ResponseEntity<?> getUserPurchaseList(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);

        Optional<List<Map<String, Object>>> userPurchaseList = userService.getUserPurchaseListByUserId(user.getUserId());
        if (userPurchaseList.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(userPurchaseList.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    @GetMapping("/{email}/reservationList")
    public ResponseEntity<?> getUserReservationList(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);
        System.out.println("useId : " + user.getUserId());
        Optional<List<Map<String, Object>>> userReservationList = userService.getUserReservationListByUserId(user.getUserId());

        if (userReservationList.isPresent()) {
            System.out.println("userReservationList : " + userReservationList.get());
            Optional<List<Map<String, Object>>> userPurchaseList = userService.getUserPurchaseListByUserId(user.getUserId());
            if (userPurchaseList.isPresent()) {
                System.out.println("userPurchaseList : " + userPurchaseList.get());
                return ResponseEntity.status(HttpStatus.OK).body(userPurchaseList.get());
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/{email}/commerceLive")
    public ResponseEntity<?> getUserCommerceLive(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);
        System.out.println(user);
        Optional<List<Map<String, Object>>> userCommerceLiveList = userService.getUserCommerceLiveListById(user.getUserId());
        if (userCommerceLiveList.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(userCommerceLiveList.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("{email}/scrapLive")
    public ResponseEntity<?> getUserScrapLive(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);

        Optional<List<Map<String, Object>>> userScrapLiveList = userService.getUserScrapLiveById(user.getUserId());
        if (userScrapLiveList.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(userScrapLiveList.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }


    @GetMapping("/{email}/scrapShorts")
    public ResponseEntity<?> getUserScrapShorts(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);

        Optional<List<Map<String, Object>>> userScrapShortsList = userService.getUserScrapShortsById(user.getUserId());
        if (userScrapShortsList.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(userScrapShortsList.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
//    @GetMapping("{email}/scrapLive")
//    public ResponseEntity<?> getUserScrapLive(@PathVariable("email") String email) {
//        User user = userService.findByEmail(email);
//
//        Optional<List<Map<String, Object>>> userScrapLiveList = userService.getUserScrapLiveById(user.getUserId());
//        if (userScrapLiveList.isPresent()) {
//            return ResponseEntity.status(HttpStatus.OK).body(userScrapLiveList.get());
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//    }
}

//    @GetMapping("/{email}/{liveId}/commerceItem")
//    public ResponseEntity<?> getUserCommerceItem(@PathVariable String email) {
//        User user = userService.findByEmail(email);
//        Optional<List<Map<String, Object>>> userCommerceItemList = userService.getUserCommerceItemListById(user.getUserId());
//        if (userCommerceItemList.isPresent()) {
//            return ResponseEntity.status(HttpStatus.OK).body(userCommerceItemList.get());
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//    }



