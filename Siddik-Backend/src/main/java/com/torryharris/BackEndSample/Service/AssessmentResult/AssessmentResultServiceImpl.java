package com.torryharris.BackEndSample.Service.AssessmentResult;


import com.torryharris.BackEndSample.Entity.AssessmentResult;
import com.torryharris.BackEndSample.Entity.User;
import com.torryharris.BackEndSample.Repository.AssessmentResultRepository;
import com.torryharris.BackEndSample.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AssessmentResultServiceImpl implements AssessmentResultService {

    private final AssessmentResultRepository assessmentResultRepository;
    private final UserRepository userRepository;


    @Autowired
    public AssessmentResultServiceImpl(AssessmentResultRepository assessmentResultRepository, UserRepository userRepository) {
        this.assessmentResultRepository = assessmentResultRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<AssessmentResult> getAllAssessmentResults() {
        return assessmentResultRepository.findAll();
    }

    @Override
    public AssessmentResult getAssessmentResultById(Integer resultId) {
        return assessmentResultRepository.findById(resultId).orElse(null);
    }

    @Override
    public AssessmentResult createAssessmentResult(AssessmentResult assessmentResult) {
        return assessmentResultRepository.save(assessmentResult);
    }

    @Override
    public AssessmentResult getAssessmentResult(Integer userId, Integer assessmentId) {
        return assessmentResultRepository.findByUserIdAndAssessmentId(userId, assessmentId);
    }
}
