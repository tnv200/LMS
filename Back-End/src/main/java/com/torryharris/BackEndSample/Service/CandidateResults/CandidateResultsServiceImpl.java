// CandidateResultsServiceImpl
package com.torryharris.BackEndSample.Service.CandidateResults;

import com.torryharris.BackEndSample.Entity.CandidateResults;
import com.torryharris.BackEndSample.Repository.CandidateResultsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateResultsServiceImpl implements CandidateResultsService {

    private final CandidateResultsRepository candidateResultsRepository;

    @Autowired
    public CandidateResultsServiceImpl(CandidateResultsRepository candidateResultsRepository) {
        this.candidateResultsRepository = candidateResultsRepository;
    }

    @Override
    public List<CandidateResults> getAllCandidateResults() {
        return candidateResultsRepository.findAll();
    }

    @Override
    public CandidateResults getCandidateResultsById(Integer resultId) {
        Optional<CandidateResults> candidateResultsOptional = candidateResultsRepository.findById(resultId);
        return candidateResultsOptional.orElse(null);
    }

    @Override
    public CandidateResults saveCandidateResults(CandidateResults candidateResults) {
        return candidateResultsRepository.save(candidateResults);
    }

    @Override
    public void deleteCandidateResults(Integer resultId) {
        candidateResultsRepository.deleteById(resultId);
    }

    @Override
    public List<CandidateResults> getCandidateResultsByUserId(Integer userId) {
        // Correct method name
        return candidateResultsRepository.findByUserUserid(userId);
    }
}
