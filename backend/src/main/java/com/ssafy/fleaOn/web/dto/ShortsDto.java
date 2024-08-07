package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Shorts;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;

// ShortsDto.java
@Getter
public class ShortsDto {
    private int shortsId;
    private String shortsThumbnail;
    private LocalTime length;
    private String videoAddress;
    private LocalDateTime uploadDate;

    public ShortsDto(Shorts shorts) {
        this.shortsId = shorts.getShortsId();
        this.shortsThumbnail = shorts.getShortsThumbnail();
        this.length = shorts.getLength();
        this.videoAddress = shorts.getVideoAddress();
        this.uploadDate = shorts.getUploadDate();
    }
}
