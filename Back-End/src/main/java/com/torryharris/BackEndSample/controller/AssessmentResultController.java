package com.torryharris.BackEndSample.controller;

import com.torryharris.BackEndSample.Entity.AssessmentResult;
import com.torryharris.BackEndSample.Entity.User;
import com.torryharris.BackEndSample.Repository.AssessmentResultRepository;
import com.torryharris.BackEndSample.Service.AssessmentResult.AssessmentResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assessmentResults")
public class AssessmentResultController {

    private final AssessmentResultRepository assessmentResultRepository;
    private final AssessmentResultService assessmentResultService;

    @Autowired
    public AssessmentResultController(AssessmentResultRepository assessmentResultRepository,AssessmentResultService assessmentResultService) {
        this.assessmentResultRepository = assessmentResultRepository;
        this.assessmentResultService = assessmentResultService;
    }

    // Get all assessment results
    @GetMapping
    public ResponseEntity<List<AssessmentResult>> getAllAssessmentResults() {
        List<AssessmentResult> assessmentResults = assessmentResultRepository.findAll();
        return new ResponseEntity<>(assessmentResults, HttpStatus.OK);
    }

    // Get assessment result by ID
    @GetMapping("/{resultId}")
    public ResponseEntity<AssessmentResult> getAssessmentResultById(@PathVariable Integer resultId) {
        return assessmentResultRepository.findById(resultId)
                .map(assessmentResult -> new ResponseEntity<>(assessmentResult, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{userId}/{assessmentId}")
    public ResponseEntity<AssessmentResult> getAssessmentResult(
            @PathVariable Integer userId,
            @PathVariable Integer assessmentId) {
        AssessmentResult result = assessmentResultService.getAssessmentResult(userId, assessmentId);
        return ResponseEntity.ok(result);
    }

    // Create a new assessment result
    @PostMapping
    public ResponseEntity<AssessmentResult> createAssessmentResult(@RequestBody AssessmentResult assessmentResult) {
        AssessmentResult savedResult = assessmentResultRepository.save(assessmentResult);
        return new ResponseEntity<>(savedResult, HttpStatus.CREATED);
    }

    @DeleteMapping("/{resultId}")
    public ResponseEntity<Void> deleteAssessmentResult(@PathVariable Integer resultId) {
        if (assessmentResultRepository.existsById(resultId)) {
            assessmentResultRepository.deleteById(resultId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
