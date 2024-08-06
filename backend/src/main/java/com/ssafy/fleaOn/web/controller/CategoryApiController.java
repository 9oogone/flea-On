package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.config.jwt.JWTUtil;
import com.ssafy.fleaOn.web.domain.Category;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.SecondCategoryResponse;
import com.ssafy.fleaOn.web.service.CategoryService;
import com.ssafy.fleaOn.web.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fleaon/category")
@Tag(name = "category API", description = "category 관련 API")
public class CategoryApiController {

    private final CategoryService categoryService;
    private final UserService userService;


    @Operation(summary = "첫 번째 카테고리 선택 후 목록 조회", description = "첫 번째 카테고리를 선택한 후 목록을 조회할 때 사용합니다. ")
    @GetMapping("/{firstCategoryId}")
    public ResponseEntity<?> getFirstCategorySearch(@PathVariable("firstCategoryId") int firstCategoryId) {
        try {
            List<SecondCategoryResponse> mainFirstCategoryList =  categoryService.getMainFirstCategoryList(firstCategoryId);
            return ResponseEntity.status(HttpStatus.OK).body(mainFirstCategoryList);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

//    @Operation(summary = "두 번째 카테고리선택 후 목록 조회", description = "사용자가 첫 번째, 두 번째 카테고리를 선택한 후 결과 목록을 조회할 때 사용합니다. ")
//    @GetMapping("/{firstCategoryId}/{secondCategoryId}}")
//    public ResponseEntity<?> getSecondCategorySearch(@PathVariable(") {
//        try {
//            List<SecondCategoryResponse> mainSecondCategoryList = categoryService.getMainSecondCategoryList(firstCategoryName);
//            return ResponseEntity.status(HttpStatus.OK).body(mainSecondCategoryList);
//        }
//        catch (Exception e){
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }

    @Operation(summary = "카테고리 기반 검색 결과 목록 조회", description = "카테고리로 검색한 결과 목록을 조회할 때 사용합니다. ")
    @GetMapping("/{firstCategoryId}/{secondCategoryId}")
    public ResponseEntity<?> getSearchResultByCategory(@PathVariable("firstCategoryId") int firstCategoryId, @PathVariable("secondCategoryId") int secondCategoryId, HttpServletRequest request) {
        try {
            String authorizationToken = request.getHeader("Authorization");
            if (authorizationToken.isEmpty() || !authorizationToken.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
            String jwtToken = authorizationToken.substring(7).trim();
            String email = JWTUtil.getEmail(jwtToken);
            User user = userService.findByEmail(email);
            if(user != null) {
                Slice<Map<String, Object>> searchResultSlice =  categoryService.getSearchResultByCategory(firstCategoryId, secondCategoryId,user.getUserId());
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

    @Operation(summary = "카테고리 목록 조회", description = "카테고리 목록을 조회할 때 사용합니다. ")
    @GetMapping("/")
    public ResponseEntity<?> getMainCategory() {
        try {
            // Optional을 사용하여 카테고리 리스트를 가져옴
            Optional<List<Category>> categoryListOptional = categoryService.getMainCategoryList();

            // Optional 내부의 데이터 처리
            if (categoryListOptional.isPresent()) {
                List<Category> categoryList = categoryListOptional.get();

                // 데이터가 비어 있는지 확인
                if (categoryList.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No category data found");
                }

                // 데이터가 존재하면 ResponseEntity에 포함하여 반환
                return ResponseEntity.status(HttpStatus.OK).body(categoryList);
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
}
