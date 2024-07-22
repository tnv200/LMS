package com.torryharris.Controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.torryharris.BackEndSample.Entity.User;
import com.torryharris.BackEndSample.Service.User.UserService;
import com.torryharris.BackEndSample.controller.CandidateRestController;

@ExtendWith(MockitoExtension.class)
public class CandidateRestControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private CandidateRestController candidateRestController;

    @Test
    public void testCandidateLogin_PositiveCase() {
        String email = "candidate@example.com";
        String password = "candidate123";

        Map<String, String> credentials = new HashMap<>();
        credentials.put("emailid", email);
        credentials.put("password", password);

        User mockCandidate = new User();
        mockCandidate.setEmailid(email);
        mockCandidate.setUsertype("candidate");

        when(userService.authenticateUser(email, password)).thenReturn(mockCandidate);

        ResponseEntity<String> responseEntity = candidateRestController.adminLogin(credentials);

        assertEquals("Candidate authenticated successfully", responseEntity.getBody());
    }

    @Test
    public void testCandidateLogin_NegativeCase() {
        String email = "user@example.com";
        String password = "user123";

        Map<String, String> credentials = new HashMap<>();
        credentials.put("emailid", email);
        credentials.put("password", password);

        when(userService.authenticateUser(email, password)).thenReturn(null);

        ResponseEntity<String> responseEntity = candidateRestController.adminLogin(credentials);

        assertEquals("Invalid credentials or insufficient privileges", responseEntity.getBody());
    }
}

