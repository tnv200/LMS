package com.torryharris.BackEndSample.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.torryharris.BackEndSample.Entity.PerformanceTracking;
import com.torryharris.BackEndSample.Service.PerformanceTracking.PerformanceTrackingService;

import java.util.List;

@RestController
@RequestMapping("/performancetracking")
public class PerformanceTrackingController {

    @Autowired
    private PerformanceTrackingService performanceTrackingService;


    @GetMapping
    public List<PerformanceTracking> getAllPerformanceTracking() {
        return performanceTrackingService.getAllPerformanceTracking();
    }

    @GetMapping("/{performanceId}")
    public PerformanceTracking getPerformanceTrackingById(@PathVariable Integer performanceId) {
        return performanceTrackingService.getPerformanceTrackingById(performanceId);
    }

    @PostMapping
    public ResponseEntity<String> addPerformanceTracking(@RequestBody PerformanceTracking performanceTracking) {
        performanceTrackingService.addPerformanceTracking(performanceTracking);
        return new ResponseEntity<>("Performance Tracking Successfully added with ID: " + performanceTracking.getPerformanceId(),
                HttpStatus.CREATED);
    }
    
    @PutMapping("/{performanceId}")
    public ResponseEntity<String> updatePerformanceTracking(@PathVariable Integer performanceId, @RequestBody PerformanceTracking updatedPerformanceTracking) {
        performanceTrackingService.updatePerformanceTracking(performanceId, updatedPerformanceTracking);
        return new ResponseEntity<>("Performance Tracking Successfully updated with ID: " + performanceId, HttpStatus.OK);
    }
    @DeleteMapping("/{performanceId}")
    public ResponseEntity<String> deletePerformanceTracking(@PathVariable Integer performanceId) {
        performanceTrackingService.deletePerformanceTrackingById(performanceId);
        return new ResponseEntity<>("Performance Tracking Successfully deleted with ID: " + performanceId, HttpStatus.OK);
    }


    @GetMapping("/{userId}/{assessmentId}")
    public ResponseEntity<PerformanceTracking> getPerformanceTracking(
            @PathVariable Integer userId,
            @PathVariable Integer assessmentId) {
        PerformanceTracking result = performanceTrackingService.getPerformanceTracking(userId, assessmentId);
        return ResponseEntity.ok(result);
    }
}
