package com.torryharris.BackEndSample.controller;

import java.util.List;

import com.torryharris.BackEndSample.Entity.CourseContent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.torryharris.BackEndSample.Entity.AssessmentQuestion;
import com.torryharris.BackEndSample.Service.AssessmentQuestion.AssessmentQuestionService;

import jakarta.persistence.EntityNotFoundException;


@RestController
@RequestMapping("/assessment-question")
public class AssessmentQuestionController {

    @Autowired
    private AssessmentQuestionService assessmentQuestionService;

    @GetMapping
    public List<AssessmentQuestion> getAllAssessmentQuestions() {
        return assessmentQuestionService.getAllAssessmentQuestions();
    }

    @GetMapping("/byAssessment/{assessmentId}")
    public List<AssessmentQuestion> getAssessmentQuestionsByAssessmentId(@PathVariable Integer assessmentId) {
        return assessmentQuestionService.getAssessmentQuestionsByAssessmentId(assessmentId);
    }


    @GetMapping("/{questionId}")
    public AssessmentQuestion getAssessmentQuestionById(@PathVariable Integer questionId) {
        return assessmentQuestionService.getAssessmentQuestionById(questionId);
    }

    @PostMapping
    public ResponseEntity<String> addAssessmentQuestion(@RequestBody AssessmentQuestion assessmentQuestion) {
        assessmentQuestionService.addAssessmentQuestion(assessmentQuestion);
        return new ResponseEntity<>("Assessment Question Successfully added with ID: ",
                HttpStatus.CREATED);
    }


    @PutMapping("/{questionId}")
    public ResponseEntity<String> updateAssessmentQuestion(@PathVariable Integer questionId, @RequestBody AssessmentQuestion updatedQuestion) {
        // Call the service method to update the assessment question
        try {
            assessmentQuestionService.updateAssessmentQuestion(questionId, updatedQuestion);
            return new ResponseEntity<>("Assessment Question Successfully updated with ID: " + questionId, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("Assessment Question not found with id: " + questionId, HttpStatus.NOT_FOUND);
        }
    }


    @DeleteMapping("/{questionId}")
    public ResponseEntity<String> deleteAssessmentQuestion(@PathVariable Integer questionId) {
        assessmentQuestionService.deleteAssessmentQuestionById(questionId);
        return new ResponseEntity<>("Assessment Question Successfully deleted with ID: " + questionId, HttpStatus.OK);
    }
}
