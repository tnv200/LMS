package com.torryharris.BackEndSample.controller;

import com.torryharris.BackEndSample.Entity.CandidateResults;
import com.torryharris.BackEndSample.Service.CandidateResults.CandidateResultsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidate-results")
public class CandidateResultsController {

    private final CandidateResultsService candidateResultsService;

    @Autowired
    public CandidateResultsController(CandidateResultsService candidateResultsService) {
        this.candidateResultsService = candidateResultsService;
    }

    @GetMapping
    public ResponseEntity<List<CandidateResults>> getAllCandidateResults() {
        List<CandidateResults> candidateResultsList = candidateResultsService.getAllCandidateResults();
        return new ResponseEntity<>(candidateResultsList, HttpStatus.OK);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CandidateResults>> getCandidateResultsByUserId(@PathVariable("userId") Integer userId) {
        List<CandidateResults> candidateResultsList = candidateResultsService.getCandidateResultsByUserId(userId);
        if (!candidateResultsList.isEmpty()) {
            return new ResponseEntity<>(candidateResultsList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/{resultId}")
    public ResponseEntity<CandidateResults> getCandidateResultsById(@PathVariable("resultId") Integer resultId) {
        CandidateResults candidateResults = candidateResultsService.getCandidateResultsById(resultId);
        if (candidateResults != null) {
            return new ResponseEntity<>(candidateResults, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<CandidateResults> saveCandidateResults(@RequestBody CandidateResults candidateResults) {
        CandidateResults savedCandidateResults = candidateResultsService.saveCandidateResults(candidateResults);
        return new ResponseEntity<>(savedCandidateResults, HttpStatus.CREATED);
    }

    @PutMapping("/{resultId}")
    public ResponseEntity<CandidateResults> updateCandidateResults(@PathVariable("resultId") Integer resultId,
                                                                   @RequestBody CandidateResults candidateResults) {
        CandidateResults existingCandidateResults = candidateResultsService.getCandidateResultsById(resultId);
        if (existingCandidateResults != null) {
            candidateResults.setResultId(resultId);
            CandidateResults updatedCandidateResults = candidateResultsService.saveCandidateResults(candidateResults);
            return new ResponseEntity<>(updatedCandidateResults, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{resultId}")
    public ResponseEntity<Void> deleteCandidateResults(@PathVariable("resultId") Integer resultId) {
        CandidateResults existingCandidateResults = candidateResultsService.getCandidateResultsById(resultId);
        if (existingCandidateResults != null) {
            candidateResultsService.deleteCandidateResults(resultId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
