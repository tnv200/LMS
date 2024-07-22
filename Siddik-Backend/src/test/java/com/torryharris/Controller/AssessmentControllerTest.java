package com.torryharris.Controller;

import com.torryharris.BackEndSample.Entity.Assessment;
import com.torryharris.BackEndSample.Entity.AssessmentQuestion;
import com.torryharris.BackEndSample.Service.Assessment.AssessmentService;
import com.torryharris.BackEndSample.Service.AssessmentQuestion.AssessmentQuestionService;
import com.torryharris.BackEndSample.controller.AssessmentController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AssessmentControllerTest {

    @Mock
    private AssessmentService assessmentService;

    @Mock
    private AssessmentQuestionService assessmentQuestionService;

    @InjectMocks
    private AssessmentController assessmentController;

    @Test
    public void testGetAllAssessments_PositiveCase() {
        List<Assessment> mockAssessments = new ArrayList<>();
        mockAssessments.add(new Assessment(1, null, "Java Assessment", null, null, "Assessment for Java programming", null));

        when(assessmentService.getAllAssessments()).thenReturn(mockAssessments);

        List<Assessment> result = assessmentController.getAllAssessments();

        assertEquals(mockAssessments, result);
    }

    @Test
    public void testGetAssessmentById_PositiveCase() {
        int assessmentId = 1;
        Assessment mockAssessment = new Assessment(assessmentId, null, "Java Assessment", assessmentId, assessmentId, "Assessment for Java programming", assessmentId);

        when(assessmentService.getAssessmentById(assessmentId)).thenReturn(mockAssessment);

        Assessment result = assessmentController.getAssessmentById(assessmentId);

        assertEquals(mockAssessment, result);
    }

    @Test
    public void testAddAssessment_PositiveCase() {
        Assessment newAssessment = new Assessment(2, null, "Spring Assessment", null, null, "Assessment for Spring framework", null);

        doNothing().when(assessmentService).addAssessment(newAssessment);

        ResponseEntity<String> responseEntity = assessmentController.addAssessment(newAssessment);

        assertEquals("Assessment Successfully added with ID: 2", responseEntity.getBody());
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
    }



    @Test
    public void testDeleteAssessment_PositiveCase() {
        int assessmentId = 1;

        doNothing().when(assessmentService).deleteAssessmentById(assessmentId);

        ResponseEntity<String> responseEntity = assessmentController.deleteAssessment(assessmentId);

        assertEquals("Assessment Successfully deleted with ID: 1", responseEntity.getBody());
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

    @Test
    public void testGetAssessmentQuestionsByAssessmentId_PositiveCase() {
        int assessmentId = 1;
        List<AssessmentQuestion> mockQuestions = new ArrayList<>();
        mockQuestions.add(new AssessmentQuestion());

        when(assessmentQuestionService.getAssessmentQuestionsByAssessmentId(assessmentId)).thenReturn(mockQuestions);

        List<AssessmentQuestion> result = assessmentController.getAssessmentQuestionsByAssessmentId(assessmentId);

        assertEquals(mockQuestions, result);
    }
    @Test
    public void testGetAssessmentById_NegativeCase_AssessmentNotFound() {
        int assessmentId = 99; 

        when(assessmentService.getAssessmentById(assessmentId)).thenReturn(null);

        Assessment result = assessmentController.getAssessmentById(assessmentId);

        assertNull(result);
    }


    @Test
    public void testGetAssessmentQuestionsByAssessmentId_NegativeCase_AssessmentNotFound() {
        int assessmentId = 99; 
        when(assessmentQuestionService.getAssessmentQuestionsByAssessmentId(assessmentId)).thenReturn(new ArrayList<>());
        List<AssessmentQuestion> result = assessmentController.getAssessmentQuestionsByAssessmentId(assessmentId);

        assertTrue(result.isEmpty());
    }

}

