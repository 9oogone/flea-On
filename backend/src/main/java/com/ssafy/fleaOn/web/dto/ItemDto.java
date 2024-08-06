package com.ssafy.fleaOn.web.dto;

import lombok.Getter;
import org.json.JSONObject;

@Getter
public class ItemDto {
    private String category1;
    private String category2;

    public ItemDto(JSONObject itemJson) {
        this.category1 = itemJson.getString("category1");
        this.category2 = itemJson.getString("category2");
    }
}
