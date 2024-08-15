package com.ssafy.fleaOn.web.dto;

import jakarta.persistence.Column;
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
    private int type;
    private int productId;
    private int liveId;
}
