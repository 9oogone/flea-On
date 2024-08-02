package com.ssafy.fleaOn.web.consumer;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import com.ssafy.fleaOn.web.service.PurchaseService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PurchaseRequestConsumer {

    private final PurchaseService purchaseService;

    @Autowired
    public PurchaseRequestConsumer(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @RabbitListener(queues = "purchaseQueue")
    @Transactional
    public void handlePurchaseRequest(PurchaseRequest request) {
        purchaseService.processPurchaseRequest(request);
    }
}
