package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.RegionInfo;
import com.ssafy.fleaOn.web.domain.User;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddLiveRequest {
    private String title;
    private String liveDate;

    @Parameter(description = "Thumbnail file", schema = @Schema(type = "string", format = "binary"))
    private MultipartFile liveThumbnail;
    private String tradePlace;
    private String regionCode;
    private List<AddProductRequest> product;
    private List<AddLiveTradeRequest> liveTradeTime;

    public Live toEntity(User user, RegionInfo regionInfo, String thumbnail) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime parsedDate = LocalDateTime.parse(liveDate, formatter);
        return Live.builder()
                .title(title)
                .liveDate(parsedDate)
                .tradePlace(tradePlace)
                .liveThumbnail(thumbnail)
                .seller(user)
                .regionInfo(regionInfo)
                .build();
    }
}
