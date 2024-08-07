package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.ChattingList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChattingListRepository extends JpaRepository<ChattingList, Integer> {
    Optional<List<ChattingList>> findByChatting_ChattingId(int chattingId);

    void deleteByChatting_ChattingId(int chattingId);
}
