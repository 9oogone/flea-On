package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.ChattingList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChattingListRepository extends JpaRepository<ChattingList, Integer> {
    Optional<List<ChattingList>> findByChatting_ChattingId(int chattingId);

    void deleteByChatting_ChattingId(int chattingId);

    @Modifying
    @Transactional  // 트랜잭션 추가
    @Query(value = "INSERT INTO chatting_list (chatting_id, writer_id, chat_content, is_bot) VALUES (:chattingId, :writerId, :chatContent, :isBot)", nativeQuery = true)
    void saveWithoutTime(@Param("chattingId") int chattingId, @Param("writerId") int writerId, @Param("chatContent") String chatContent, @Param("isBot") boolean isBot);
}
