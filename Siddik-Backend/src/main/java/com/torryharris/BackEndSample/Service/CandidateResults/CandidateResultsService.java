// CandidateResultsService
package com.torryharris.BackEndSample.Service.CandidateResults;

import com.torryharris.BackEndSample.Entity.CandidateResults;

import java.util.List;

public interface CandidateResultsService {
    List<CandidateResults> getAllCandidateResults();
    CandidateResults getCandidateResultsById(Integer resultId);
    CandidateResults saveCandidateResults(CandidateResults candidateResults);
    void deleteCandidateResults(Integer resultId);

    // Correct method name
    List<CandidateResults> getCandidateResultsByUserId(Integer userId);
}
