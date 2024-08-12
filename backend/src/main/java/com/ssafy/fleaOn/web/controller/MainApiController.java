package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.*;
import com.ssafy.fleaOn.web.repository.UserRepository;
import com.ssafy.fleaOn.web.service.MainService;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Slice;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaon")
@Tag(name = "main API", description = "main 관련 API입니다. ")
public class MainApiController {

    private static final Logger log = LoggerFactory.getLogger(MainApiController.class);
    private final MainService mainService;
    private final UserService userService;

    @GetMapping("/mainLive")
    public ResponseEntity<?> getMainLive(HttpServletRequest request) {
        try {
            String authorizationToken = request.getHeader("Authorization");
            if (authorizationToken.isEmpty() || !authorizationToken.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
            String token = authorizationToken.substring(7);
            String email = JWTUtil.getEmail(token);
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 사용자가 없습니다.");
            }

            List<UserRegion> findUerRegionList = mainService.getUserRegionByUserId(user.getUserId());
            Slice<MainLiveResponse> mainLiveResponses = mainService.getMainLiveListByRegionCode(user.getUserId(), findUerRegionList);

            return ResponseEntity.status(HttpStatus.OK).body(mainLiveResponses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @Operation(summary = "쇼츠 목록 조회", description = "쇼츠 목록을 조회할 때 사용합니다. ")
    @GetMapping("/mainShorts")
    public ResponseEntity<?> getMainShorts(HttpServletRequest request) {
        try {
            String authorizationToken = request.getHeader("Authorization");
            if (authorizationToken.isEmpty() || !authorizationToken.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
            String token = authorizationToken.substring(7);
            String email = JWTUtil.getEmail(token);
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 사용자를 찾을 수 없습니다 .");
            }
            Slice<MainShortsResponse> shortsSlice = mainService.getMainShortsListByUploadDate();
            if (shortsSlice.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No short data found");
            }
            return ResponseEntity.status(HttpStatus.OK).body(shortsSlice);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching short data: " + e.getMessage());
        }
    }

    @Operation(summary = "물품 이름으로 검색 목록 조회", description = "물품이름으로 검색한 검색 목록을 조회할 때 사용합니다. ")
    @GetMapping("/searchResult")
    public ResponseEntity<?> getSearchResult(@RequestParam(value = "name", required = false) String name, HttpServletRequest request) {
        String authorizationToken = request.getHeader("Authorization");
        System.out.println(authorizationToken);
        if (authorizationToken.isEmpty() || !authorizationToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        } else {
            String jwtToken = authorizationToken.substring(7).trim();
            String email = JWTUtil.getEmail(jwtToken);
            User user = userService.findByEmail(email);
            if (user != null) {
                try {
                    Slice<Map<String, Object>> searchResultSlice = mainService.getSearchResultByName(name, user.getUserId());
                    if (searchResultSlice.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No result data found");
                    }
                    return ResponseEntity.status(HttpStatus.OK).body(searchResultSlice.getContent());
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching search result data: " + e.getMessage());
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
    }

    @Operation(summary = "시/도 이름 검색", description = "시/도 목록을 조회할 때 사용합니다. ")
    @GetMapping("/sidoName")
    public ResponseEntity<?> getSidoName(HttpServletRequest request) {
        try {
            String authorizationToken = request.getHeader("Authorization");
            if (authorizationToken.isEmpty() || !authorizationToken.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
            String jwtToken = authorizationToken.substring(7).trim();
            String email = JWTUtil.getEmail(jwtToken);
            User user = userService.findByEmail(email);
            if (user != null) {
                List<SidoNameResponse> sidoNameResponses = mainService.getSidoNameList();
                return ResponseEntity.status(HttpStatus.OK).body(sidoNameResponses);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 사용자를 못찾았습니다. ");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Operation(summary = "구/군 이름 검색", description = "선택한 시/도에 따른 구/군 이름을 조회할 때 사용합니다. ")
    @GetMapping("/{sidoName}/gugun")
    public ResponseEntity<?> getGugunName(@PathVariable("sidoName") String sidoName, HttpServletRequest request) {
        try {
            String authorizationToken = request.getHeader("Authorization");
            if (authorizationToken.isEmpty() || !authorizationToken.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
            String jwtToken = authorizationToken.substring(7).trim();
            String email = JWTUtil.getEmail(jwtToken);
            User user = userService.findByEmail(email);
            if (user != null) {
                List<GugunNameResponse> gugunNameResponses = mainService.getGugunNameBySidoName(sidoName);
                return ResponseEntity.status(HttpStatus.OK).body(gugunNameResponses);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Operation(summary = "동/읍/면 이름 검색", description = "사용자가 선택한 시/도, 구/군에 따른 동/읍/면 이름을 조회할 때 사용합니다. ")
    @GetMapping("/{sidoName}/{gugunName}/eupmyeon")
    public ResponseEntity getEupmyeonName(@PathVariable("sidoName") String sidoName, @PathVariable("gugunName") String gugunName, HttpServletRequest request) {
        try {
            String authorizationToken = request.getHeader("Authorization");
            if (authorizationToken.isEmpty() || !authorizationToken.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
            String jwtToken = authorizationToken.substring(7).trim();
            String email = JWTUtil.getEmail(jwtToken);
            User user = userService.findByEmail(email);
            if (user != null) {
                List<EupmyeonNameResponse> eupmyeonNameResponses = mainService.getEupmyeonNameAndRegionCodeBySidoNameAndGugunName(sidoName, gugunName);
                return ResponseEntity.status(HttpStatus.OK).body(eupmyeonNameResponses);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
