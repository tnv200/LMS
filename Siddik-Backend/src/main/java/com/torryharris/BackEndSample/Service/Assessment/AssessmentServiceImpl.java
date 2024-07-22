package com.torryharris.BackEndSample.Service.Assessment;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.torryharris.BackEndSample.Entity.Assessment;
import com.torryharris.BackEndSample.Repository.AssessmentRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private EntityManager entityManager;
    @Override
    public List<Assessment> getAllAssessments() {
        return (List<Assessment>) assessmentRepository.findAll();
    }

    @Override
    public Assessment getAssessmentById(Integer assessmentId) {
        return assessmentRepository.findById(assessmentId).get();
    }

    @Override
    public void addAssessment(Assessment assessment) {
        assessmentRepository.save(assessment);
    }

    @Override
    public void deleteAssessmentById(Integer assessmentId) {
        assessmentRepository.deleteById(assessmentId);
    }

    @Override
    public void updateAssessment(Integer assessmentId, Assessment updatedAssessment) {
    	 Assessment existingAssessment = assessmentRepository.findById(assessmentId)
                 .orElseThrow(() -> new EntityNotFoundException("Assessment not found with id: " + assessmentId));

         // Update only non-null fields
         if (updatedAssessment.getAssessmentTitle() != null) {
             existingAssessment.setAssessmentTitle(updatedAssessment.getAssessmentTitle());
         }
         if (updatedAssessment.getMaximumMarks() != null) {
             existingAssessment.setMaximumMarks(updatedAssessment.getMaximumMarks());
         }
         if (updatedAssessment.getPassingMarks() != null) {
             existingAssessment.setPassingMarks(updatedAssessment.getPassingMarks());
         }
        if (updatedAssessment.getStatus() != null) {
            existingAssessment.setStatus(updatedAssessment.getStatus());
        }
        if (updatedAssessment.getTime() != null) {
            existingAssessment.setTime(updatedAssessment.getTime());
        }

         assessmentRepository.save(existingAssessment);
    }


}
