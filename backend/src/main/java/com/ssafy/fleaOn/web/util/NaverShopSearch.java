package com.ssafy.fleaOn.web.util;

import com.ssafy.fleaOn.web.domain.Category;
import com.ssafy.fleaOn.web.dto.CategoryIdResponse;
import com.ssafy.fleaOn.web.dto.ItemDto;
import com.ssafy.fleaOn.web.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class NaverShopSearch {
    private final CategoryRepository categoryRepository;
    @Value("${NAVER_CLIENT_ID}")
    private String NAVER_CLIENT_ID;

    @Value("${NAVER_CLINET_SECRET}")
    private String NAVER_CLINET_SECRET;

    public NaverShopSearch(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public String search(String query) {
        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Naver-Client-Id", NAVER_CLIENT_ID);
        headers.add("X-Naver-Client-Secret", NAVER_CLINET_SECRET);
        String body = "";

//        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);

        HttpEntity<String> requestEntity = new HttpEntity<String>(body, headers);
        ResponseEntity<String> responseEntity = rest.exchange("https://openapi.naver.com/v1/search/shop.json?query=" + query, HttpMethod.GET, requestEntity, String.class);
        HttpStatus httpStatus = (HttpStatus) responseEntity.getStatusCode();
        int status = httpStatus.value();
        String response = responseEntity.getBody();
        System.out.println("Response status: " + status);
        System.out.println(response);
        return response;
    }

    public CategoryIdResponse fromJSONtoItems(String result) {
        // 문자열 정보를 JSONObject로 바꾸기
        JSONObject rjson = new JSONObject(result);
        System.out.println(rjson);
        // JSONObject에서 items 배열 꺼내기
        // JSON 배열이기 때문에 보통 배열이랑 다르게 활용해야한다.
        JSONArray items = rjson.getJSONArray("items");
        JSONObject itemJson = (JSONObject) items.get(0);
        ItemDto itemDto = new ItemDto(itemJson);
        Optional<Category> category = categoryRepository.findAllByFirstCategoryNameAndSecondCategoryName(itemDto.getCategory1(), itemDto.getCategory2());
        if (category.isPresent()) {
            CategoryIdResponse categoryIdResponse = CategoryIdResponse.builder()
                    .firstCategoryId(category.get().getFirstCategoryId())
                    .secondCategoryId(category.get().getSecondCategoryId())
                    .build();

            return categoryIdResponse;
        }
        return null;
    }
}
