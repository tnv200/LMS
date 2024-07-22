package com.torryharris.BackEndSample.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.torryharris.BackEndSample.Entity.Feedback;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByUserUserid(Integer userid);

    List<Feedback> findByUserUsertype(String userType);
}
