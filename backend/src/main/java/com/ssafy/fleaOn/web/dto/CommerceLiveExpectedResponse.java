package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommerceLiveExpectedResponse {

    private int liveId;
    private boolean isExist;
    private String title;
}
