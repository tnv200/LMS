// CandidateResultsRepository
package com.torryharris.BackEndSample.Repository;

import com.torryharris.BackEndSample.Entity.CandidateResults;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateResultsRepository extends JpaRepository<CandidateResults, Integer> {
    // Correct method name
    List<CandidateResults> findByUserUserid(Integer userId);
}
