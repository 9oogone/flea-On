package com.ssafy.fleaOn.web.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public class CustomUserRepositoryImpl implements CustomUserRepository{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void deleteMember(String email) {
        entityManager.createNativeQuery("DELETE FROM userentity WHERE email = ?")
                .setParameter(1, email)
                .executeUpdate();
    }

}
