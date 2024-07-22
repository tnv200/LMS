package com.torryharris.BackEndSample.Repository;
import com.torryharris.BackEndSample.Entity.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.torryharris.BackEndSample.Entity.AssessmentQuestion;

import java.util.List;

@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Integer> {

   List<AssessmentQuestion> findByAssessment_Assessmentid(Integer assessmentId);
}
