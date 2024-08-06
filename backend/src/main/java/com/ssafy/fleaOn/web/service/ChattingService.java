package com.ssafy.fleaOn.web.service;

import com.ssafy.fleaOn.web.domain.Chatting;
import com.ssafy.fleaOn.web.domain.ChattingList;
import com.ssafy.fleaOn.web.domain.User;
import com.ssafy.fleaOn.web.dto.ChattingResponse;
import com.ssafy.fleaOn.web.dto.MessageResponse;
import com.ssafy.fleaOn.web.repository.ChattingListRepository;
import com.ssafy.fleaOn.web.repository.ChattingRepository;
import com.ssafy.fleaOn.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChattingService {

    private final ChattingRepository chattingRepository;
    private final ChattingListRepository chattingListRepository;
    private final UserRepository userRepository;

    public List<ChattingResponse> getChattingByUserId(int userId) {
        List<Chatting> chatList = chattingRepository.findChattingByBuyerOrSellerWithView(userId);
        List<ChattingResponse> responses = new ArrayList<>();

        for (Chatting chat : chatList) {
            List<ChattingList> messages = chattingListRepository.findByChatting_ChattingId(chat.getChattingId()).orElseThrow(() -> new RuntimeException("Chatting not found"));
            ChattingList recentMessage = messages.isEmpty() ? null : messages.get(messages.size() - 1);
            User otherUser;
            if (chat.getSeller().getUserId()==userId) {
                otherUser = userRepository.findByEmail(chat.getBuyer().getEmail()).orElseThrow(() -> new IllegalArgumentException("no user found for id: " + userId));
            } else {
                otherUser = userRepository.findByEmail(chat.getSeller().getEmail()).orElseThrow(() -> new IllegalArgumentException("no user found for id: " + userId));
            }
            responses.add(new ChattingResponse(
                    chat,
                    otherUser.getNickname(), // Assuming User entity has a nickname field
                    otherUser.getProfilePicture(), // Assuming User entity has a profile field
                    recentMessage,
                    chat.getView()  // 추가된 view 필드를 반영
            ));
        }
        // 리스트를 recentMessageTime에 따라 정렬
        responses.sort(Comparator.comparing(ChattingResponse::getRecentMessageTime).reversed());

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
                .isBot(false)  // 기본값으로 isBot을 false로 설정
                .build();
        return chattingListRepository.save(message);
    }

}
