package com.ssafy.fleaOn.web.producer;

import com.ssafy.fleaOn.web.dto.PurchaseRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PurchaseRequestProducer {
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public PurchaseRequestProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendPurchaseRequest(PurchaseRequest request) {
        rabbitTemplate.convertAndSend("purchase-exchange", "purchase.request", request);
    }
}
