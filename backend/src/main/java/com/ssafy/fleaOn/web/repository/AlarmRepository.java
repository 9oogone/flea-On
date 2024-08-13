package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Integer> {
    List<Alarm> findByUser_UserIdOrderByDateDesc(int userId);
    List<Alarm> findByUser_UserIdAndIsReadFalseOrderByDateDesc(int userId);
}
