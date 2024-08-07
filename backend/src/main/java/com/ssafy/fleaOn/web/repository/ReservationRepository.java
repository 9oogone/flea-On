package com.ssafy.fleaOn.web.repository;

import com.ssafy.fleaOn.web.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    Optional<Reservation> findFirstByProduct_ProductIdOrderByReservationTimeAsc(int productId);

    Optional<Reservation> findByProduct_ProductIdAndUser_UserId(int productId, int userId);

    Optional<List<Reservation>> findByUser_userId(int userId);

    void deleteByProduct_ProductId(int productId);
}
