package com.torryharris.BackEndSample.controller;

import java.util.List;

import com.torryharris.BackEndSample.Entity.AssessmentQuestion;
import com.torryharris.BackEndSample.Service.AssessmentQuestion.AssessmentQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.torryharris.BackEndSample.Entity.Assessment;
import com.torryharris.BackEndSample.Service.Assessment.AssessmentService;

@RestController
@RequestMapping("/assessment")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private AssessmentQuestionService assessmentQuestionService;

    @GetMapping
    public List<Assessment> getAllAssessments() {
        return assessmentService.getAllAssessments();
    }

    @GetMapping("/{assessmentId}")
    public Assessment getAssessmentById(@PathVariable Integer assessmentId) {
        return assessmentService.getAssessmentById(assessmentId);
    }

    @PostMapping
    public ResponseEntity<String> addAssessment(@RequestBody Assessment assessment) {
        assessmentService.addAssessment(assessment);
        return new ResponseEntity<>("Assessment Successfully added with ID: " + assessment.getAssessmentid(),
                HttpStatus.CREATED);
    }
    @PutMapping("/{assessmentId}")
    public ResponseEntity<String> updateAssessment(@PathVariable Integer assessmentId, @RequestBody Assessment updatedAssessment) {
        assessmentService.updateAssessment(assessmentId, updatedAssessment);
        return new ResponseEntity<>("Assessment Successfully updated with ID: " + assessmentId, HttpStatus.OK);
    }

    @DeleteMapping("/{assessmentId}")
    public ResponseEntity<String> deleteAssessment(@PathVariable Integer assessmentId) {
        assessmentService.deleteAssessmentById(assessmentId);
        return new ResponseEntity<>("Assessment Successfully deleted with ID: " + assessmentId, HttpStatus.OK);
    }


    // New method to get all questions for a specific assessment
    @GetMapping("/{assessmentId}/questions")
    public List<AssessmentQuestion> getAssessmentQuestionsByAssessmentId(@PathVariable Integer assessmentId) {
        return assessmentQuestionService.getAssessmentQuestionsByAssessmentId(assessmentId);
    }
}
