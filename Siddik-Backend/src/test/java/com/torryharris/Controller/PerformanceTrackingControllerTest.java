package com.torryharris.Controller;

import com.torryharris.BackEndSample.Entity.PerformanceTracking;
import com.torryharris.BackEndSample.Service.PerformanceTracking.PerformanceTrackingService;
import com.torryharris.BackEndSample.controller.PerformanceTrackingController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

class PerformanceTrackingControllerTest {

    @Mock
    private PerformanceTrackingService performanceTrackingService;

    @InjectMocks
    private PerformanceTrackingController performanceTrackingController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }


    @Test
    void testGetAllPerformanceTracking_PositiveCase() {
        when(performanceTrackingService.getAllPerformanceTracking()).thenReturn(Collections.emptyList());

        List<PerformanceTracking> result = performanceTrackingController.getAllPerformanceTracking();

        assertEquals(Collections.emptyList(), result);
    }

    @Test
    void testGetPerformanceTracking_PositiveCase() {
        int userId = 1;
        int assessmentId = 2;
        when(performanceTrackingService.getPerformanceTracking(userId, assessmentId)).thenReturn(null);

        ResponseEntity<PerformanceTracking> result = performanceTrackingController.getPerformanceTracking(userId, assessmentId);

        assertEquals(HttpStatus.OK, result.getStatusCode());
    }


    @Test
    void testGetPerformanceTracking_NegativeCase_PerformanceTrackingNotFound() {
        int userId = 99;
        int assessmentId = 99; 

        when(performanceTrackingService.getPerformanceTracking(userId, assessmentId))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Performance Tracking not found"));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> performanceTrackingController.getPerformanceTracking(userId, assessmentId));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Performance Tracking not found", exception.getReason());
    }
}
