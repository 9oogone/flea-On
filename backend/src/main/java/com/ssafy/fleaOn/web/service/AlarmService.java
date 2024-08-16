package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Alarm;
import com.ssafy.fleaOn.web.dto.AlarmDTO;
import com.ssafy.fleaOn.web.repository.AlarmRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlarmService {

    private final AlarmRepository alarmRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AlarmDTO> getUserAlarms(int userId) {
        List<Alarm> alarms = alarmRepository.findByUser_UserIdOrderByDateDesc(userId);
        return alarms.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlarmDTO> getUnreadAlarms(int userId) {
        List<Alarm> alarms = alarmRepository.findByUser_UserIdAndIsReadFalseOrderByDateDesc(userId);
        return alarms.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAlarmAsRead(int userId) {
        List<Alarm> unreadAlarms = alarmRepository.findByUser_UserIdAndIsReadFalseOrderByDateDesc(userId);
        for (Alarm alarm : unreadAlarms) {
            alarm.setRead(true);
            alarmRepository.save(alarm);
        }
    }

    private AlarmDTO convertToDTO(Alarm alarm) {
        return AlarmDTO.builder()
                .alarmId(alarm.getAlarmId())
                .content(alarm.getContent())
                .date(alarm.getDate())
                .profilePic(alarm.getProfilePic())
                .isRead(alarm.isRead())
                .type(alarm.getType())
                .liveId(alarm.getLiveId())
                .productId(alarm.getProductId())
                .build();
    }
}
