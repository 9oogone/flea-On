package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.AddLiveRequest;
import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.dto.UpdateLiveRequest;
import com.ssafy.fleaOn.web.service.LiveService;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaOn/live")
@Tag(name = "Live API", description = "Live 관련 API")
public class LiveApiController {

    private final LiveService liveService;
    private final UserService userService;

    @PostMapping("/")
    @Operation(summary = "라이브 생성", description = "라이브의 정보를 저장하여 새로운 라이브를 생성합니다.")
    public ResponseEntity<?> createLive(@RequestBody AddLiveRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
            String userEmail = oAuth2User.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            Live savedLive = liveService.saveLive(request, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedLive);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("라이브 생성 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{liveID}")
    @Operation(summary = "라이브 정보 변경", description = "특정 라이브의 정보를 변경, 업데이트 합니다.")
    public ResponseEntity<?> updateLive(@PathVariable int liveID, @RequestBody UpdateLiveRequest request) {
        try {
            LocalDateTime parsedDate = LocalDateTime.parse(request.getLive_date());
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
            String userEmail = oAuth2User.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 사용자 정보를 가져옴
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            Live updatedLive = liveService.updateLive(liveID, request, user); // 서비스를 통해 Live 정보를 업데이트
            return ResponseEntity.ok(updatedLive); // 업데이트된 Live 정보 반환
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("라이브 정보 변경 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

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
            Live live = liveService.findById(liveID);
            return ResponseEntity.ok().body(live);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("조회할 라이브를 찾을 수 없습니다: " + ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
