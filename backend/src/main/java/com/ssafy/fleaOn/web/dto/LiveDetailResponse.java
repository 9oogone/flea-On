package com.ssafy.fleaOn.web.dto;

import com.ssafy.fleaOn.web.domain.*;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class LiveDetailResponse {
    private final int liveId;
    private final User user;
    private final String title;
    private final String liveDate;
    private final String liveThumbnail;
    private final String tradePlace;
    private final int isLive;
    private final int viewCount;
    private final List<ProductResponse> products;
    private final List<LiveTradeResponse> liveTradeTimes;


    public LiveDetailResponse(Live live, List<ProductDetailsResponse> products, List<LiveTradeTime> liveTradeTimes, User user) {
        this.liveId = live.getLiveId();
        this.title = live.getTitle();
        this.liveDate = live.getLiveDate().toString();
        this.liveThumbnail = live.getLiveThumbnail();
        this.tradePlace = live.getTradePlace();
        this.isLive = live.getIsLive();
        this.user = user;
        this.products = products.stream().map(ProductResponse::new).collect(Collectors.toList());
        this.liveTradeTimes = liveTradeTimes.stream().map(LiveTradeResponse::new).collect(Collectors.toList());
        this.viewCount = live.getViewCount();
    }

    @Getter
    public static class ProductResponse {
        private final int productId;
        private final String name;
        private final int price;
        private final int firstCategoryId;
        private final int secondCategoryId;
        private final int sellStatus;
        private final int buyStatus;
        private final int shortsId;

        public ProductResponse(ProductDetailsResponse productDetailsResponse) {
            Product product = productDetailsResponse.getProduct();
            int sellStatus; // 0: 방송 전 , 1: 방송 중, 2: 방송 후
            int buyStatus; // 0: 구매 가능, 1: 예약 가능, 2: 둘다 불가능

            if ((product.isStart() && product.isEnd())) {
                sellStatus = 2;
            } else if (product.isStart()) {
                sellStatus = 1;
            } else sellStatus = 0;

            if (product.getCurrentBuyerId()==0)
                buyStatus = 0;
            else if (product.getReservationCount()<5)
                buyStatus = 1;
            else buyStatus = 2;

            this.productId = product.getProductId();
            this.name = product.getName();
            this.price = product.getPrice();
            this.firstCategoryId = product.getFirstCategoryId();
            this.secondCategoryId = product.getSecondCategoryId();
            this.sellStatus = sellStatus;
            this.buyStatus = buyStatus;
            this.shortsId = productDetailsResponse.getShortsId();
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
