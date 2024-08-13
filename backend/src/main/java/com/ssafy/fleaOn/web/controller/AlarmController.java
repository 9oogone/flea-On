package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.AlarmDTO;
import com.ssafy.fleaOn.web.service.AlarmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fleaon/alarms")
@RequiredArgsConstructor
@Tag(name = "Alarm API", description = "알람 관련 API")
public class AlarmController {

    private final AlarmService alarmService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "전체 알림 조회", description = "사용자의 모든 알림을 조회합니다.")
    public ResponseEntity<List<AlarmDTO>> getUserAlarms(@PathVariable int userId) {
        List<AlarmDTO> alarms = alarmService.getUserAlarms(userId);
        return ResponseEntity.ok(alarms);
    }

    @GetMapping("/user/{userId}/unread")
    @Operation(summary = "읽지 않은 알림", description = "사용자의 읽지 않은 알림을 조회합니다.")
    public ResponseEntity<List<AlarmDTO>> getUnreadAlarms(@PathVariable int userId) {
        List<AlarmDTO> alarms = alarmService.getUnreadAlarms(userId);
        return ResponseEntity.ok(alarms);
    }

    @PutMapping("/{alarmId}/read")
    @Operation(summary = "알림 읽음", description = "특정 알림을 읽음 상태로 표시합니다.")
    public ResponseEntity<Void> markAlarmAsRead(@PathVariable int alarmId) {
        alarmService.markAlarmAsRead(alarmId);
        return ResponseEntity.ok().build();
    }
}
