package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaon/users")
@Tag(name = "users API", description = "users 관련 API")
public class UserApiController {

    private final UserService userService;


    @Operation(summary = "회원가입", description = "회원가입을 할 떄 사용합니다. ")
    @PostMapping("/")
    public ResponseEntity<?> join() {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "로그인", description = "로그인을 진행할 때 사용합니다. ")
    @PostMapping("/login")
    public ResponseEntity<?> login() {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴를 진행할 때 사용합니다. ")
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

    @Operation(summary = "회원 정보 조회", description = "사용자의 회원정보를 조회할 때 사용합니다. ")
    @GetMapping("/{email}/info")
    public ResponseEntity<?> getUserInfo(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
    }

    @Operation(summary = "회원 정보 조회", description = "사용자의 email이 주어지지 않을 때 회원 정보를 조회할 수 있습니다. ")
    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        // Authorization 헤더에서 JWT 토큰 추출
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7).trim();
            System.out.println("jwtToken: " + jwtToken);

            try {
                // JWTUtil을 사용하여 토큰에서 이메일 추출
                String email = JWTUtil.getEmail(jwtToken);
                System.out.println("email : " + email);

                // 이메일로 사용자 조회
                User user = userService.findByEmail(email);
                System.out.println("해당 회원 찾음 : " + user);

                if (user != null) {
                    // 사용자 정보를 ResponseEntity 본문에 포함하여 반환
                    return ResponseEntity.status(HttpStatus.OK).body(user);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 정보를 찾을 수 없습니다.");
                }
            } catch (Exception e) {
                // JWT 파싱 오류 처리
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("잘못된 토큰입니다.");
            }
        } else {
            // Authorization 헤더가 없거나 형식이 올바르지 않은 경우
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 없거나 형식이 올바르지 않습니다.");
        }
    }

    @Operation(summary = "회원 정보 수정", description = "회원 정보를 수정할 때 사용합니다. ")
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

    @Operation(summary = "마이페이지 조회", description = "사용자의 마이페이지를 조회할 때 사용합니다. ")
    @GetMapping("/{email}/mypage")
    public ResponseEntity<?> getMyPage(@PathVariable("email") String email) {
        Map<String, Object> userInfo = userService.getUserInfoByEmail(email);

        if (userInfo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(userInfo);
        }
    }

    @Operation(summary = "날짜별 회원 일정 조회", description = "이메일과 거래 날짜를 기반으로 회원의 일정을 조회할 때 사용합니다. ")
    @GetMapping("/{email}/{tradeDate}/schedule")
    public ResponseEntity<?> getUserSchedule(@PathVariable("email") String email, @PathVariable("tradeDate") LocalDate tradeDate) {
        User user = userService.findByEmail(email);
        Optional<List<Map<String, Object>>> userScheduleList = userService.getUserScheduleListByUserIdAndDate(user.getUserId(), tradeDate);

        if (userScheduleList.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(userScheduleList.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @Operation(summary = "구매 목록 조회", description = "회원의 구매목록을 조회할 때 사용합니다. ")
    @GetMapping("/{email}/purchaseList")
    public ResponseEntity<?> getUserPurchaseList(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);

        Optional<List<Map<String, Object>>> userPurchaseList = userService.getUserPurchaseListByUserId(user.getUserId());
        if (userPurchaseList.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(userPurchaseList.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    @Operation(summary = "줄서기 목록 조회", description = "회원의 줄서기 목록을 조회할 때 사용합니다. ")
    @GetMapping("/{email}/reservationList")
    public ResponseEntity<?> getUserReservationList(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);
        System.out.println("useId : " + user.getUserId());
        Optional<List<Map<String, Object>>> userReservationList = userService.getUserReservationListByUserId(user.getUserId());

        if (userReservationList.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(userReservationList.get());
            }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @Operation(summary = "라이브 목록 조회", description = "회원의 라이브 목록을 조회할 때 사용합니다. ")
    @GetMapping("/{email}/commerceLive")
    public ResponseEntity<?> getUserCommerceLive(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);
        System.out.println(user);
        Optional<List<Map<String, Object>>> userCommerceLiveList = userService.getUserCommerceLiveListByUserId(user.getUserId());
        if (userCommerceLiveList.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(userCommerceLiveList.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @Operation(summary = "판매 내역 - 라이브 상세", description = "회원이 판매 예정인 라이브 상세 내용을 볼 때 사용합니다. ")
    @GetMapping("/{email}/commerceLive/{liveId}/info")
    public ResponseEntity<?> getCommerceLiveInfo(@PathVariable("email") String email, @PathVariable("liveId") int liveId) {
        try {
            User user = userService.findByEmail(email);
            if(user != null){
                Live liveDetails = userService.getUserCommerLiveDetails(user.getUserId(), liveId);
                return ResponseEntity.status(HttpStatus.OK).body(liveDetails);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "스크랩한 라이브 목록 조회", description = "회원이 스크랩한 라이브 목록을 조회할 때 사용합니다. ")
    @GetMapping("{email}/scrapLive")
    public ResponseEntity<?> getUserScrapLive(@PathVariable("email") String email) {
        try {
            User user = userService.findByEmail(email);

            Optional<List<Map<String, Object>>> userScrapLiveList = userService.getUserScrapLiveByUserId(user.getUserId());
            if (userScrapLiveList.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(userScrapLiveList.get());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "스크랩한 쇼츠 목록 조회", description = "회원이 스크랩한 쇼츠 목록을 조회할 때 사용합니다. ")
    @GetMapping("/{email}/scrapShorts")
    public ResponseEntity<?> getUserScrapShorts(@PathVariable("email") String email) {
        try {
            User user = userService.findByEmail(email);

            Optional<List<Map<String, Object>>> userScrapShortsList = userService.getUserScrapShortsByUserId(user.getUserId());
            if (userScrapShortsList.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(userScrapShortsList.get());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    @Operation(summary = "추가 정보 입력", description = "회원가입 후 추가 정보를 입력할 때 사용합니다. ")
    @PostMapping("/extraInfo")
    public ResponseEntity<?> addExtraInfo(@RequestBody Map<String, Object> extraInfo, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7).trim();
            System.out.println("jwtToken: " + jwtToken);
            try {
                // JWTUtil을 사용하여 토큰에서 이메일 추출
                String email = JWTUtil.getEmail(jwtToken);
                System.out.println("email : " + email);

                // 이메일로 사용자 조회
                User user = userService.findByEmail(email);
                System.out.println("해당 회원 찾음 : " + user);

                if (user != null) {
                    userService.addUserExtraInfo(extraInfo, user.getEmail());
                    return ResponseEntity.status(HttpStatus.OK).body(user);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 없거나 형식이 올바르지 않습니다.");
        }
    }

    @Operation(summary = "초기 선호 지역 추가", description = "회원 가입 후 선호 지역을 추가할 때 사용합니다. ")
    @PostMapping("/region")
    public ResponseEntity<?> addUserRegion(@RequestBody Map<String, Object> region, HttpServletRequest request) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwtToken = authorizationHeader.substring(7).trim();
                String email = JWTUtil.getEmail(jwtToken);
                User user = userService.findByEmail(email);
                if (user != null) {
                    userService.addUserRegion(user.getUserId(), region);
                    return ResponseEntity.status(HttpStatus.OK).body(user);
                }
                else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 없거나 형식이 올바르지 않습니다. ");
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "선호 지역 수정", description = "회원이 선호 지역을 수정할 때 사용합니다. ")
    @PutMapping("/region")
    public ResponseEntity<?> updateUserRegion(@RequestBody Map<String, Object> newRegion,@RequestBody Map<String, Object> deleteRegion, HttpServletRequest request) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwtToken = authorizationHeader.substring(7).trim();
                String email = JWTUtil.getEmail(jwtToken);
                User user = userService.findByEmail(email);
                if (user != null) {
                    userService.updateUserRegion(user.getUserId(), newRegion, deleteRegion);
                    return ResponseEntity.status(HttpStatus.OK).body(user);
                }
                else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 없거나 형식이 올바르지 않습니다. ");
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "스크랩한 라이브 추가", description = "회원이 라이브를 스크랩할 때 사용합니다. ")
    @PostMapping("/liveScrap")
    public ResponseEntity<?> addUserLiveScrap(HttpServletRequest request, @RequestBody int liveId) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwtToken = authorizationHeader.substring(7).trim();
                String email = JWTUtil.getEmail(jwtToken);
                User user = userService.findByEmail(email);
                if (user != null) {
                    userService.addUserLiveScrap(user.getUserId(), liveId);
                    return ResponseEntity.status(HttpStatus.OK).body(user);
                }
                else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }
            }
            else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 없거나 형식이 올바르지 않습니다.");
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "스크랩한 라이브 삭제", description = "회원이 스크랩한 라이브를 삭제할 때 사용합니다. ")
    @DeleteMapping("/liveScrap")
    public ResponseEntity<?> deleteUserLiveScrap(HttpServletRequest request, @RequestBody int liveId) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwtToken = authorizationHeader.substring(7).trim();
                String email = JWTUtil.getEmail(jwtToken);
                User user = userService.findByEmail(email);
                if (user != null) {
                    userService.deleteUserLivewScrap(user.getUserId(), liveId);
                    return ResponseEntity.status(HttpStatus.OK).body(user);
                }
                else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }
            }
            else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 없거나 형식이 올바르지 않습니다.");
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    @Operation(summary = "판매 내역 - 쇼츠 목록", description = "회원이 판매 중인 쇼츠 목록을 조회할 때 사용합니다. ")
    @GetMapping("/{email}/short")
    public ResponseEntity<?> getUserCommerceItem(@PathVariable("email") String email) {
        try {
            User user = userService.findByEmail(email);
            if (user != null) {
                List<Map<String, Object>> userShortsList = userService.getUserShortsListByUserId(user.getUserId());
                return ResponseEntity.status(HttpStatus.OK).body(userShortsList);
            }
            else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "라이브 스크랩한 사용자들 목록 조회", description = "live_id별로 스크랩한 모든 사람들 목록을 조회할 때 사용합니다. ")
    @GetMapping("{liveId}/userInfo")
    public ResponseEntity<?> getLiveScrapUserInfo(@PathVariable("liveId") int liveId) {
        try {
            Optional<List<Map<String, Object>>> liveScrapUserInfo = userService.getUserInfoByLiveId(liveId);
            if (liveScrapUserInfo.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(liveScrapUserInfo.get());
            }
            else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
