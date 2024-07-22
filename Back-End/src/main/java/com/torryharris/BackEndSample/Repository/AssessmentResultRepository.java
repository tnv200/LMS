package com.torryharris.BackEndSample.Repository;

import com.torryharris.BackEndSample.Entity.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Integer> {
    @Query("SELECT ar FROM AssessmentResult ar WHERE ar.user.userid = :userId AND ar.assessment.assessmentid = :assessmentId")
    AssessmentResult findByUserIdAndAssessmentId(
            @Param("userId") Integer userId,
            @Param("assessmentId") Integer assessmentId
    );
}
