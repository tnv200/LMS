package com.torryharris.BackEndSample.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.torryharris.BackEndSample.Entity.PerformanceTracking;

@Repository
public interface PerformanceTrackingRepository extends JpaRepository<PerformanceTracking, Integer> {

    @Query("SELECT pt FROM PerformanceTracking pt WHERE pt.user.userid = :userId AND pt.assessment.assessmentid = :assessmentId")
    PerformanceTracking findByUserIdAndAssessmentId(
            @Param("userId") Integer userId,
            @Param("assessmentId") Integer assessmentId
    );
}
