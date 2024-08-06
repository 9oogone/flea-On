package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.MainShortsResponse;
import com.ssafy.fleaOn.web.repository.UserRepository;
import com.ssafy.fleaOn.web.service.MainService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaon")
@Tag(name = "main API", description = "main 관련 API입니다. ")
public class MainApiController {

    private final MainService mainService;
    private final UserRepository userRepository;

    @Operation(summary = "실시간 방송 목록 조회", description = "라이브 방송 목록을 조회할 때 사용합니다. ")
    @GetMapping("/mainLive")
    public ResponseEntity<?> getMainLive(@RequestParam("liveDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime liveDate) {
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

    @Operation(summary = "쇼츠 목록 조회", description = "쇼츠 목록을 조회할 때 사용합니다. ")
    @GetMapping("/mainShorts")
    public ResponseEntity<?> getMainShorts() {
        try {
            Slice<MainShortsResponse> shortsSlice = mainService.getMainShortsListByUploadDate();
            if (shortsSlice.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No short data found");
            }
            return ResponseEntity.status(HttpStatus.OK).body(shortsSlice);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching short data: " + e.getMessage());
        }
    }

    @Operation(summary = "물품 이름으로 검색 목록 조회", description = "물품이름으로 검색한 검색 목록을 조회할 때 사용합니다. ")
    @GetMapping("/searchResult")
    public ResponseEntity<?> getSearchResult(@RequestParam(value = "name", required = false) String name, HttpServletRequest request) {
        String authorizationToken = request.getHeader("Authorization");
        System.out.println(authorizationToken);
        if(authorizationToken.isEmpty() || !authorizationToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        else {
            String jwtToken = authorizationToken.substring(7).trim();
            String email = JWTUtil.getEmail(jwtToken);
            Optional<User> user = userRepository.findByEmail(email);
            if(user.isPresent()) {
                try {
                    Slice<Map<String, Object>> searchResultSlice = mainService.getSearchResultByName(name, user.get().getUserId());
                    if (searchResultSlice.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No result data found");
                    }
                    return ResponseEntity.status(HttpStatus.OK).body(searchResultSlice);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching search result data: " + e.getMessage());
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
    }
}
