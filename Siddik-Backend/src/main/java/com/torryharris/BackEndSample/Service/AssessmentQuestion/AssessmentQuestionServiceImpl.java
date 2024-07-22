package com.torryharris.BackEndSample.Service.AssessmentQuestion;

import java.util.List;

import com.torryharris.BackEndSample.Entity.CourseContent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.torryharris.BackEndSample.Entity.AssessmentQuestion;
import com.torryharris.BackEndSample.Repository.AssessmentQuestionRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AssessmentQuestionServiceImpl implements AssessmentQuestionService {

    @Autowired
    private AssessmentQuestionRepository assessmentQuestionRepository;


    @Override
    public List<AssessmentQuestion> getAllAssessmentQuestions() {
        return (List<AssessmentQuestion>) assessmentQuestionRepository.findAll();
    }

    @Override
    public AssessmentQuestion getAssessmentQuestionById(Integer questionId) {
        return assessmentQuestionRepository.findById(questionId).get();
    }

    @Override
    public void addAssessmentQuestion(AssessmentQuestion assessmentQuestion) {
        assessmentQuestionRepository.save(assessmentQuestion);
    }

    @Override
    public void deleteAssessmentQuestionById(Integer questionId) {
        assessmentQuestionRepository.deleteById(questionId);
    }

    @Override
    public void updateAssessmentQuestion(Integer questionId, AssessmentQuestion updatedQuestion) {
        AssessmentQuestion existingQuestion = assessmentQuestionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Assessment Question not found with id: " + questionId));


        // Update only non-null fields
        if (updatedQuestion.getQuestionText() != null) {
            existingQuestion.setQuestionText(updatedQuestion.getQuestionText());
        }
        if (updatedQuestion.getOptionA() != null) {
            existingQuestion.setOptionA(updatedQuestion.getOptionA());
        }
        if (updatedQuestion.getOptionB() != null) {
            existingQuestion.setOptionB(updatedQuestion.getOptionB());
        }
        if (updatedQuestion.getOptionC() != null) {
            existingQuestion.setOptionC(updatedQuestion.getOptionC());
        }
        if (updatedQuestion.getOptionD() != null) {
            existingQuestion.setOptionD(updatedQuestion.getOptionD());
        }
        if (updatedQuestion.getCorrectAnswer() != null) {
            existingQuestion.setCorrectAnswer(updatedQuestion.getCorrectAnswer());
        }

        assessmentQuestionRepository.save(existingQuestion);
    }


    @Override
    public List<AssessmentQuestion> getAssessmentQuestionsByAssessmentId(Integer assessmentId) {
        return assessmentQuestionRepository.findByAssessment_Assessmentid(assessmentId);
    }


}
