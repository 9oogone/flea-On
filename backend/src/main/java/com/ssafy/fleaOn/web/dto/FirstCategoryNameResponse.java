package com.ssafy.fleaOn.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FirstCategoryNameResponse {

    @JsonProperty("first_category_name")
    private String firstCategoryName;
}
