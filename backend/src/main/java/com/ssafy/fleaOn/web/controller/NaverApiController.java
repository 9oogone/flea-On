package com.ssafy.fleaOn.web.controller;

import com.ssafy.fleaOn.web.dto.ItemDto;
import com.ssafy.fleaOn.web.util.NaverShopSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor // final 로 선언된 클래스를 자동으로 생성합니다.
@RestController // JSON으로 응답함을 선언합니다.
@RequestMapping("/fleaon/naver")
@Tag(name = "Naver shopping API", description = "Naver shopping API 관련 API")
public class NaverApiController {

    private final NaverShopSearch naverShopSearch;

    @Operation(summary = "네이버 검색 API", description = "사용자가 물품을 검색하고 해당 카테고리를 조회할 때 사용합니다. ")
    @GetMapping("/api/search")
    public ResponseEntity<?> getItems(@RequestParam("query") String query) {
        // ? 뒤에 오는 넘을 쓰고 싶다면 @RequestParam 필수
        String resultString = naverShopSearch.search(query);
        return ResponseEntity.status(HttpStatus.OK).body(naverShopSearch.fromJSONtoItems(resultString));
    }
}