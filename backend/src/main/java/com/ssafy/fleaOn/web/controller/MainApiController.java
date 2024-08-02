package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.Shorts;
import com.ssafy.fleaOn.web.dto.MainShortsResponse;
import com.ssafy.fleaOn.web.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaon")
public class MainApiController {

    private final MainService mainService;

    @GetMapping("/mainLive")
    public ResponseEntity<?> getMainLive(@RequestParam("liveDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime liveDate) {
        try {
            // 서비스에서 데이터를 가져옵니다.
            Slice<Live> liveSlice = mainService.getMainLiveListByLiveDate(liveDate);

            // 결과가 비어 있는지 확인하고 적절한 상태 코드 반환
            if (liveSlice.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body("No live data found");
            }

            // 성공적인 경우, 데이터를 200 OK 상태 코드와 함께 반환
            return ResponseEntity.status(HttpStatus.OK)
                    .body(liveSlice);
        } catch (Exception e) {
            // 예외 발생 시, 500 INTERNAL SERVER ERROR 상태 코드 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching live data: " + e.getMessage());
        }
    }

    @GetMapping("/mainShorts")
    public ResponseEntity<?> getMainShorts() {
        try {
            Slice<MainShortsResponse> shortsSlice = mainService.getMainShortsListByUploadDate();
            if (shortsSlice.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No short data found");
            }
            return ResponseEntity.status(HttpStatus.OK).body(shortsSlice);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching short data: " + e.getMessage());
        }
    }
    @GetMapping("/mainCategory")
    public ResponseEntity<?> getMaincategory() {
        try {
            Optional<List> categoryList = mainService.getMainCategoryList();
            if (categoryList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No category data found");
            }
            return ResponseEntity.status(HttpStatus.OK).body(categoryList);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching category data: " + e.getMessage());

        }
    }

}
