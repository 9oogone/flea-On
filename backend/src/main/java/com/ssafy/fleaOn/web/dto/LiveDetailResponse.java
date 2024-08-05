package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.Live;
import com.ssafy.fleaOn.web.domain.LiveTradeTime;
import com.ssafy.fleaOn.web.domain.Product;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class LiveDetailResponse {
    private final int liveId;
    private final String title;
    private final String liveDate;
    private final String liveThumbnail;
    private final String tradePlace;
    private final boolean isLive;
    private final List<ProductResponse> products;
    private final List<LiveTradeResponse> liveTradeTimes;


    public LiveDetailResponse(Live live, List<Product> products, List<LiveTradeTime> liveTradeTimes) {
        this.liveId = live.getLiveId();
        this.title = live.getTitle();
        this.liveDate = live.getLiveDate().toString();
        this.liveThumbnail = live.getLiveThumbnail();
        this.tradePlace = live.getTradePlace();
        this.isLive = live.getIsLive();
        this.products = products.stream().map(ProductResponse::new).collect(Collectors.toList());
        this.liveTradeTimes = liveTradeTimes.stream().map(LiveTradeResponse::new).collect(Collectors.toList());
    }

    @Getter
    public static class ProductResponse {
        private final int productId;
        private final String name;
        private final int price;
        private final int firstCategoryId;
        private final int secondCategoryId;

        public ProductResponse(Product product) {
            this.productId = product.getProductId();
            this.name = product.getName();
            this.price = product.getPrice();
            this.firstCategoryId = product.getFirstCategoryId();
            this.secondCategoryId = product.getSecondCategoryId();
        }
    }

    @Getter
    public static class LiveTradeResponse {
        private final int timeId;
        private final LocalTime tradeStart;
        private final LocalTime tradeEnd;
        private final LocalDate date;

        public LiveTradeResponse (LiveTradeTime liveTradeTime){
            this.timeId = liveTradeTime.getTimeId();
            this.tradeStart = liveTradeTime.getTradeStart();
            this.tradeEnd = liveTradeTime.getTradeEnd();
            this.date = liveTradeTime.getDate();
        }
    }
}
