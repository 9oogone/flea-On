package com.ssafy.fleaOn.web.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class AlarmDTO {
    private int alarmId;
    private String content;
    private Timestamp date;
    private String profilePic;
    private boolean isRead;
}
