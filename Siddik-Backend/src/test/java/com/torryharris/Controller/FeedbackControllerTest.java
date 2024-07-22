package com.torryharris.Controller;

import com.torryharris.BackEndSample.Entity.Feedback;
import com.torryharris.BackEndSample.Service.Feedback.FeedbackService;
import com.torryharris.BackEndSample.controller.FeedbackController;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class FeedbackControllerTest {

    @Mock
    private FeedbackService feedbackService;

    @InjectMocks
    private FeedbackController feedbackController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testGetAllFeedback() {
        List<Feedback> feedbackList = new ArrayList<>();
        when(feedbackService.getAllFeedback()).thenReturn(feedbackList);
        List<Feedback> result = feedbackController.getAllFeedback();
        assertEquals(feedbackList, result);
        verify(feedbackService, times(1)).getAllFeedback();
    }

    @Test
    void testGetFeedbackById() {
        int feedbackId = 1;
        Feedback feedback = new Feedback();

        when(feedbackService.getFeedbackById(feedbackId)).thenReturn(feedback);

        Feedback result = feedbackController.getFeedbackById(feedbackId);

        assertEquals(feedback, result);
        verify(feedbackService, times(1)).getFeedbackById(feedbackId);
    }

    @Test
    void testAddFeedback() {
        int feedbackId = 1;
        Feedback addFeedback = new Feedback();
        ResponseEntity<String> expectedResponse = new ResponseEntity<>("Feedback Successfully updated with ID: 1", HttpStatus.OK);
        doNothing().when(feedbackService).updateFeedback(feedbackId, addFeedback);

        ResponseEntity<String> result = feedbackController.updateFeedback(feedbackId, addFeedback);

        assertEquals(expectedResponse, result);
        verify(feedbackService, times(1)).updateFeedback(feedbackId, addFeedback);
    }

    @Test
    void testGetFeedbacksByUserId() {
        int userId = 1;
        List<Feedback> feedbackList = new ArrayList<>();
        when(feedbackService.getFeedbacksByUserId(userId)).thenReturn(feedbackList);

        List<Feedback> result = feedbackController.getFeedbacksByUserId(userId);

        assertEquals(feedbackList, result);
        verify(feedbackService, times(1)).getFeedbacksByUserId(userId);
    }

    @Test
    void testGetFeedbacksByUserTypeForAdmin() {
        String userType = "admin";
        List<Feedback> feedbackList = new ArrayList<>();
        when(feedbackService.getFeedbacksForAdmin()).thenReturn(feedbackList);

        ResponseEntity<List<Feedback>> result = feedbackController.getFeedbacksByUserType(userType);

        assertEquals(feedbackList, result.getBody());
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(feedbackService, times(1)).getFeedbacksForAdmin();
    }

    @Test
    void testGetFeedbacksByUserTypeForUser() {
        String userType = "user";
        List<Feedback> feedbackList = new ArrayList<>();
        when(feedbackService.getFeedbacksByUserType(userType)).thenReturn(feedbackList);

        ResponseEntity<List<Feedback>> result = feedbackController.getFeedbacksByUserType(userType);

        assertEquals(feedbackList, result.getBody());
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(feedbackService, times(1)).getFeedbacksByUserType(userType);
    }
}
