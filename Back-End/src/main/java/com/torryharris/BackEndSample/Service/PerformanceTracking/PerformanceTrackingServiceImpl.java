package com.torryharris.BackEndSample.Service.PerformanceTracking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.torryharris.BackEndSample.Entity.PerformanceTracking;
import com.torryharris.BackEndSample.Repository.PerformanceTrackingRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class PerformanceTrackingServiceImpl implements PerformanceTrackingService {

    @Autowired
    private PerformanceTrackingRepository performanceTrackingRepository;

    @Override
    public List<PerformanceTracking> getAllPerformanceTracking() {
        List<PerformanceTracking> performanceTrackings = new ArrayList<>();
        performanceTrackingRepository.findAll().forEach(performanceTrackings::add);
        return performanceTrackings;
    }

    @Override
    public PerformanceTracking getPerformanceTrackingById(Integer performanceId) {
        return performanceTrackingRepository.findById(performanceId).orElse(null);
    }

    @Override
    public void addPerformanceTracking(PerformanceTracking performanceTracking) {
        performanceTrackingRepository.save(performanceTracking);
    }

    @Override
    public void deletePerformanceTrackingById(Integer performanceId) {
        performanceTrackingRepository.deleteById(performanceId);
    }

    @Override
    public void updatePerformanceTracking(Integer performanceId, PerformanceTracking updatedPerformance) {
    	 PerformanceTracking existingPerformanceTracking = performanceTrackingRepository.findById(performanceId).orElse(null);

         if (existingPerformanceTracking != null) {
             // Update only the marks field
             existingPerformanceTracking.setMarks(updatedPerformance.getMarks());

             // Save the updated entity
             performanceTrackingRepository.save(existingPerformanceTracking);
    }}

    @Override
    public PerformanceTracking getPerformanceTracking(Integer userId, Integer assessmentId) {
        return performanceTrackingRepository.findByUserIdAndAssessmentId(userId, assessmentId);
    }
}
