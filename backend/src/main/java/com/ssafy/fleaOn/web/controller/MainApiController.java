package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTFilter;
import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.*;
import com.ssafy.fleaOn.web.dto.FirstCategoryNameResponse;
import com.ssafy.fleaOn.web.dto.MainShortsResponse;
import com.ssafy.fleaOn.web.dto.SecondCategoryResponse;
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
import java.util.List;
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

    @Operation(summary = "카테고리 목록 조회", description = "카테고리 목록을 조회할 때 사용합니다. ")
    @GetMapping("/mainCategory")
    public ResponseEntity<?> getMainCategory() {
        try {
            // Optional을 사용하여 카테고리 리스트를 가져옴
            Optional<List<Category>> categoryListOptional = mainService.getMainCategoryList();

            // Optional 내부의 데이터 처리
            if (categoryListOptional.isPresent()) {
                List<Category> categoryList = categoryListOptional.get();

                // 데이터가 비어 있는지 확인
                if (categoryList.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No category data found");
                }

                // 데이터가 존재하면 ResponseEntity에 포함하여 반환
                return ResponseEntity.ok(categoryList);
            } else {
                // Optional이 비어 있을 경우 처리
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No category data found");
            }
        } catch (Exception e) {
            // 예외 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching category data: " + e.getMessage());
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

    @Operation(summary = "첫 번째 카테고리 목록 조회", description = "첫 번째 카테고리 목록만을 조회할 때 사용합니다. ")
    @GetMapping("/firstCategorySearch")
    public ResponseEntity<?> getFirstCategorySearch() {
        try {
            List<FirstCategoryNameResponse> mainFirstCategoryList =  mainService.getMainFirstCategoryList();
            return ResponseEntity.status(HttpStatus.OK).body(mainFirstCategoryList);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "두 번째 카테고리 목록 조회", description = "사용자가 입력한 첫 번째 카테고리를 기반으로 두 번째 카체고리 목록만을 조회할 때 사용합니다. ")
    @GetMapping("/{firstCategoryName}/secondCategorySearch")
    public ResponseEntity<?> getSecondCategorySearch(@PathVariable("firstCategoryName") String firstCategoryName) {
        try {
            List<SecondCategoryResponse> mainSecondCategoryList = mainService.getMainSecondCategoryList(firstCategoryName);
            return ResponseEntity.status(HttpStatus.OK).body(mainSecondCategoryList);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Operation(summary = "카테고리 기반 검색 결과 목록 조회", description = "카테고리로 검색했한 결과 목록을 조회할 때 사용합니다. ")
    @GetMapping("/{firstCategoryName}/{secondCategoryName}/mainCategorySearch")
    public ResponseEntity<?> getSearchResultByCategory(@PathVariable("firstCategoryName") String firstCategoryName, @PathVariable("secondCategoryName") String secondCategoryName, HttpServletRequest request) {
        try {
            String authorizationToken = request.getHeader("Authorization");
            if (authorizationToken.isEmpty() || !authorizationToken.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
            String jwtToken = authorizationToken.substring(7).trim();
            String email = JWTUtil.getEmail(jwtToken);
            Optional<User> user = userRepository.findByEmail(email);
            if(user.isPresent()) {
                Slice<Map<String, Object>> searchResultSlice =  mainService.getSearchResultByCategory(firstCategoryName, secondCategoryName,user.get().getUserId());
                return ResponseEntity.status(HttpStatus.OK).body(searchResultSlice);
            }
            else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("찾을 수 없는 사용자입니다. ");
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
