package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Trade;
import com.ssafy.fleaOn.web.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CalenderService {

    private final TradeRepository tradeRepository;

    public List<Trade> getUserDayTradeList(LocalDate tradeDate, int userId) {
        Optional<List<Trade>> findTradeList = tradeRepository.findAllByTradeDateAndBuyerIdOrSellerId(tradeDate, userId, userId);
        return findTradeList.get();
    }

    public Trade getUserDayTrade(LocalDate tradeDate, int userId) {
        Optional<Trade> findTrade = tradeRepository.findByTradeDateAndBuyerIdOrSellerId(tradeDate, userId, userId);
        return findTrade.get();
    }

}
