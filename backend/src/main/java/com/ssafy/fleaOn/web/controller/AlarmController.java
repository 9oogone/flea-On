package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.AlarmDTO;
import com.ssafy.fleaOn.web.dto.ChattingResponse;
import com.ssafy.fleaOn.web.dto.CustomOAuth2User;
import com.ssafy.fleaOn.web.service.AlarmService;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fleaon/alarms")
@RequiredArgsConstructor
@Tag(name = "Alarm API", description = "알람 관련 API")
public class AlarmController {

    private final AlarmService alarmService;
    private final UserService userService;

    @GetMapping("/")
    @Operation(summary = "전체 알림 조회", description = "사용자의 모든 알림을 조회합니다.")
    public ResponseEntity<?> getUserAlarms(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) {
            return new ResponseEntity<>("인증된 사용자가 없습니다.", HttpStatus.UNAUTHORIZED);
        }
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);
            }

            List<AlarmDTO> alarms = alarmService.getUserAlarms(user.getUserId());
            if (!alarms.isEmpty()) {
                return ResponseEntity.ok(alarms);
            } else {
                return new ResponseEntity<>("알람이 없습니다.", HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            return new ResponseEntity<>("알람목록을 불러오는 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/unread")
    @Operation(summary = "읽지 않은 알림", description = "사용자의 읽지 않은 알림을 조회합니다.")
    public ResponseEntity<?> getUnreadAlarms(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) {
            return new ResponseEntity<>("인증된 사용자가 없습니다.", HttpStatus.UNAUTHORIZED);
        }
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);
            }

            List<AlarmDTO> alarms = alarmService.getUnreadAlarms(user.getUserId());
            if (!alarms.isEmpty()) {
                return ResponseEntity.ok(alarms);
            } else {
                return new ResponseEntity<>("알람이 없습니다.", HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            return new ResponseEntity<>("알람목록을 불러오는 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/read")
    @Operation(summary = "알림 읽음", description = "특정 알림을 읽음 상태로 표시합니다.")
    public ResponseEntity<?> markAlarmAsRead(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) {
            return new ResponseEntity<>("인증된 사용자가 없습니다.", HttpStatus.UNAUTHORIZED);
        }
        try {
            String userEmail = principal.getEmail(); // 현재 인증된 사용자의 이메일 가져오기

            User user = userService.findByEmail(userEmail); // 이메일로 userId 가져오기
            if (user == null) {
                return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);
            }

            alarmService.markAlarmAsRead(user.getUserId());
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return new ResponseEntity<>("알람목록을 불러오는 중 오류가 발생하였습니다: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
