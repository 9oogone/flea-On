
package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.handler.FileHandler;
import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.AddLiveRequest;
import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.dto.LiveDetailResponse;
import com.ssafy.fleaOn.web.dto.UpdateLiveRequest;
import com.ssafy.fleaOn.web.service.LiveService;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaOn/live")
@Tag(name = "Live API", description = "Live 관련 API")
public class LiveApiController {

    private static final Logger log = LoggerFactory.getLogger(PurchaseApiController.class);

    private final LiveService liveService;
    private final UserService userService;
    private final FileHandler fileHandler;

    @PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "라이브 생성", description = "라이브의 정보를 저장하여 새로운 라이브를 생성합니다.")
    public ResponseEntity<?> createLive(HttpServletRequest request,
                                        @RequestPart("photoFile") MultipartFile photoFile,
                                        @RequestPart("data") AddLiveRequest addLiveRequest) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7).trim();
            System.out.println("jwtToken: " + jwtToken);

            try {
                String email = JWTUtil.getEmail(jwtToken);
                User user = userService.findByEmail(email);

                if (user != null) {
                    String thumbnail = null;
                    // 파일 처리 중 예외가 발생할 수 있으므로 try-catch로 감싸서 처리
                    try {
                        thumbnail = fileHandler.parseFileInfo(photoFile);
                    } catch (Exception e) {
                        log.error("파일 처리 중 오류 발생: {}", e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("파일 처리 중 오류가 발생했습니다: " + e.getMessage());
                    }
                    Live savedLive = liveService.saveLive(addLiveRequest, user, thumbnail);
                    System.out.println(thumbnail);
                    return ResponseEntity.status(HttpStatus.CREATED).body(savedLive);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("라이브 생성 실패: 사용자를 찾을 수 없습니다.");
                }
            } catch (Exception ex) {
                ex.printStackTrace();
                log.error("라이브 생성 중 오류 발생: {}", ex.getMessage());
                return new ResponseEntity<>("라이브 생성 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("라이브 생성 실패: 토큰이 없습니다.");
    }


//    @PutMapping("/{liveID}")
//    @Operation(summary = "라이브 정보 변경", description = "특정 라이브의 정보를 변경, 업데이트 합니다.")
//    public ResponseEntity<?> updateLive(@PathVariable int liveID, @RequestBody UpdateLiveRequest request) {
//        try {
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
//            String userEmail = oAuth2User.getEmail(); // 현재 인증된 사용자의 이메일 가져오기
//
//            User user = userService.findByEmail(userEmail); // 이메일로 사용자 정보를 가져옴
//            if (user == null) {
//                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
//            }
//
//            Live updatedLive = liveService.updateLive(liveID, request, user); // 서비스를 통해 Live 정보를 업데이트
//            return ResponseEntity.ok(updatedLive); // 업데이트된 Live 정보 반환
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return new ResponseEntity<>("라이브 정보 변경 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
//        }
//    }

    @DeleteMapping("/{id}/")
    @Operation(summary = "라이브 삭제", description = "특정 라이브를 취소, 삭제합니다.")
    public ResponseEntity<?> deleteLive(@PathVariable int id) {
        try {
            liveService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("삭제할 라이브를 찾을 수 없습니다: " + ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{liveID}/detail")
    @Operation(summary = "라이브 상세 조회", description = "특정 라이브의 상세 정보를 조회합니다.")
    public ResponseEntity<?> findLive(@PathVariable int liveID) {
        try {
            LiveDetailResponse liveDetailResponse = liveService.findLiveWithProducts(liveID);
            return ResponseEntity.ok().body(liveDetailResponse);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("조회할 라이브를 찾을 수 없습니다: " + ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("/{liveID}/on")
    @Operation(summary = "라이브 방송 시작", description = "라이브 방송을 시작합니다.")
    public ResponseEntity<?> onLive(@PathVariable int liveID) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
            String userEmail = oAuth2User.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 사용자 정보를 가져옴
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);
            }

            LiveDetailResponse onLive = liveService.onLive(liveID); // 서비스를 통해 Live 정보를 업데이트
            return ResponseEntity.ok(onLive); // 업데이트된 Live 정보 반환
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("시작할 라이브를 찾을 수 없습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{liveID}/off")
    @Operation(summary = "라이브 방송 종료", description = "라이브 방송을 종료합니다.")
    public ResponseEntity<?> offLive(@PathVariable int liveID) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
            String userEmail = oAuth2User.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 사용자 정보를 가져옴
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);
            }

            LiveDetailResponse offLive = liveService.offLive(liveID); // 서비스를 통해 Live 정보를 업데이트
            return ResponseEntity.ok(offLive); // 업데이트된 Live 정보 반환
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("시작할 라이브를 찾을 수 없습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}