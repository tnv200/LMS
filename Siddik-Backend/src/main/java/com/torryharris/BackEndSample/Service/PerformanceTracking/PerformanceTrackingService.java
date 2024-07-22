package com.torryharris.BackEndSample.Service.PerformanceTracking;

import java.util.List;

import com.torryharris.BackEndSample.Entity.PerformanceTracking;

public interface PerformanceTrackingService {

    List<PerformanceTracking> getAllPerformanceTracking();
    PerformanceTracking getPerformanceTrackingById(Integer performanceId);
    void addPerformanceTracking(PerformanceTracking performanceTracking);
    void deletePerformanceTrackingById(Integer performanceId);
    void updatePerformanceTracking(Integer performanceId, PerformanceTracking updatedPerformance);
    PerformanceTracking getPerformanceTracking(Integer userId, Integer assessmentId);
}
