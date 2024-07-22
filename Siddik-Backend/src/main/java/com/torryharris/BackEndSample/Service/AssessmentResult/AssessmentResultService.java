package com.torryharris.BackEndSample.Service.AssessmentResult;


import com.torryharris.BackEndSample.Entity.AssessmentResult;

import java.util.List;

public interface AssessmentResultService {
    List<AssessmentResult> getAllAssessmentResults();
    AssessmentResult getAssessmentResultById(Integer resultId);
    AssessmentResult createAssessmentResult(AssessmentResult assessmentResult);

    AssessmentResult getAssessmentResult(Integer userId, Integer assessmentId);
}
