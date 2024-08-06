package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Chatting;
import com.ssafy.fleaOn.web.domain.ChattingList;
import com.ssafy.fleaOn.web.dto.ChattingResponse;
import com.ssafy.fleaOn.web.dto.MessageResponse;
import com.ssafy.fleaOn.web.repository.ChattingListRepository;
import com.ssafy.fleaOn.web.repository.ChattingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChattingService {

    private final ChattingRepository chattingRepository;
    private final ChattingListRepository chattingListRepository;

    public List<ChattingResponse> getChattingByUserId(int userId) {
        List<Chatting> chatList = chattingRepository.findByBuyer_UserIdOrSeller_UserId(userId, userId);
        List<ChattingResponse> responses = new ArrayList<>();

        for (Chatting chat : chatList) {
            List<ChattingList> messages = chattingListRepository.findByChatting_ChattingId(chat.getChattingId()).orElseThrow(() -> new RuntimeException("Chatting not found"));
            if (!messages.isEmpty()) {
                ChattingList recentMessage = messages.get(messages.size() - 1);
                responses.add(new ChattingResponse(
                        chat.getChattingId(),
                        chat.getSeller().getNickname(), // Assuming User entity has a nickname field
                        chat.getSeller().getProfilePicture(), // Assuming User entity has a profile field
                        recentMessage,
                        chat.isView()  // 추가된 view 필드를 반영
                ));
            }
        }
        return responses;
    }

    public Chatting getChatByChattingId(int chattingId) {
        return chattingRepository.findById(chattingId).orElseThrow(() -> new RuntimeException("Chatting not found"));
    }

    public List<MessageResponse> getMessagesByChattingId(int chattingId) {
        Optional<List<ChattingList>> chattingLists = chattingListRepository.findByChatting_ChattingId(chattingId);
        List<MessageResponse> responses = new ArrayList<>();
        if (chattingLists.isPresent()) {
            for (ChattingList chattingList : chattingLists.get()) {
                responses.add(new MessageResponse(chattingList));
            }
        }
        return responses;
    }

    public ChattingList createMessage(Chatting chatting, int writerId, String chatContent) {
        ChattingList message = ChattingList.builder()
                .chatting(chatting)
                .writerId(writerId)
                .chatContent(chatContent)
                .chatTime(LocalDateTime.now())
                .build();
        return chattingListRepository.save(message);
    }

}
