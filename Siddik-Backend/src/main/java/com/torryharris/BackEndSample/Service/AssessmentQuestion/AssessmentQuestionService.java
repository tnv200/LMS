package com.torryharris.BackEndSample.Service.AssessmentQuestion;

import java.util.List;

import com.torryharris.BackEndSample.Entity.AssessmentQuestion;
import com.torryharris.BackEndSample.Entity.CourseContent;

public interface AssessmentQuestionService {

    List<AssessmentQuestion> getAllAssessmentQuestions();
    AssessmentQuestion getAssessmentQuestionById(Integer questionId);
    void addAssessmentQuestion(AssessmentQuestion assessmentQuestion);
    void deleteAssessmentQuestionById(Integer questionId);
    void updateAssessmentQuestion(Integer questionId, AssessmentQuestion updatedQuestion);
    List<AssessmentQuestion> getAssessmentQuestionsByAssessmentId(Integer assessmentId);
}
