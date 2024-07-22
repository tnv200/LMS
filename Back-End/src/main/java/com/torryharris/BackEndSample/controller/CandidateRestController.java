package com.torryharris.BackEndSample.controller;

import java.util.List;
import java.util.Map;

import com.torryharris.BackEndSample.Entity.User;
import com.torryharris.BackEndSample.Service.User.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/candidate")
public class CandidateRestController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> adminLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("emailid");
        String password = credentials.get("password");

        User user = userService.authenticateUser(email, password);

        if (user != null && user.isEnabled() && "candidate".equals(user.getUsertype())) {
            // Admin authenticated successfully
            // Add your authorization logic here if needed
            return ResponseEntity.ok("Candidate authenticated successfully");
        } else {
            // Authentication failed or user is not an admin
            return ResponseEntity.status(401).body("Invalid credentials or insufficient privileges");
        }
    }

    }

