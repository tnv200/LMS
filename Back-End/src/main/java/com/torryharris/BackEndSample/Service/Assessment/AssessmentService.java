package com.torryharris.BackEndSample.Service.Assessment;

import java.util.List;

import com.torryharris.BackEndSample.Entity.Assessment;

public interface AssessmentService {

    List<Assessment> getAllAssessments();
    Assessment getAssessmentById(Integer assessmentId);
    void addAssessment(Assessment assessment);
    void deleteAssessmentById(Integer assessmentId);
    void updateAssessment(Integer assessmentId, Assessment updatedAssessment);

}
