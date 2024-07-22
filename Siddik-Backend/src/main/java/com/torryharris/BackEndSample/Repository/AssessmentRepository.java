package com.torryharris.BackEndSample.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.torryharris.BackEndSample.Entity.Assessment;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {

}
