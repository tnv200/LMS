package com.torryharris.BackEndSample.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.torryharris.BackEndSample.Service.Assessment.AssessmentService;
import com.torryharris.BackEndSample.Service.Course.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.torryharris.BackEndSample.Entity.User;
import com.torryharris.BackEndSample.Service.User.UserService;

@RestController
//@CrossOrigin("http://localhost:3000/")
@RequestMapping("/admin")
public class AdminRestController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;

    @Autowired
    private AssessmentService assessmentService;





    @PostMapping("/login")
    public ResponseEntity<String> adminLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("emailid");
        String password = credentials.get("password");
        User user = userService.authenticateUser(email, password);

        if (user != null && user.isEnabled() && "admin".equals(user.getUsertype())) {
            // Admin authenticated successfully
            // Add your authorization logic here if needed
            return ResponseEntity.ok("Admin authenticated successfully");
        } else {
            // Authentication failed or user is not an admin
            return ResponseEntity.status(401).body("Invalid credentials or insufficient privileges");
        }
    }





    @GetMapping("/dashboard")
    public List<User> showAdminDashboard() {
        return userService.getAllUsers();
    }

    @PostMapping("/add-user")
    public ResponseEntity<String> addUser(@RequestBody User user) {
        // Check if the user with the given email or user ID already exists
        if (userService.isUserExists(user.getEmailid(), user.getUserid())) {
            // If user already exists, return an error message
            return ResponseEntity.status(400).body("User with the same email or user ID already exists");
        } else {
            // If user doesn't exist, add the user
            userService.addUser(user);
            // Return a success message
            return ResponseEntity.ok("User added successfully");
        }
    }
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        // Check if the user with the given email already exists
        if (userService.isUserExists(user.getEmailid(), user.getUserid())) {
            // If user already exists, return an error message
            return ResponseEntity.status(400).body("User with the same email already exists");
        } else {
            // If user doesn't exist, add the user
            userService.addUser(user);
            // Return a success message
            return ResponseEntity.ok("Signup successful");
        }
    }

    @PutMapping("/edit-user")
	    public ResponseEntity<String> editUser(@RequestBody User user) {
	        // Fetch the existing user from the database
	        User existingUser = userService.getUserById(user.getUserid());
	
	        if (existingUser != null) {
	            // Update only the fields that are not null in the request
	            if (user.getEmailid() != null) {
	                existingUser.setEmailid(user.getEmailid());
	            }
	            if (user.getPassword() != null) {
	                existingUser.setPassword(user.getPassword());
	            }
	            if (user.getUsername() != null) {
	                existingUser.setUsername(user.getUsername());
	            }
	            if (user.getUsertype() != null) {
	                existingUser.setUsertype(user.getUsertype());
	            }
	
	            // Save the updated user back to the database
	            userService.editUser(existingUser);
	            return ResponseEntity.ok("User edited successfully");
	        } else {
	            // Handle the case where the user with the specified ID doesn't exist
	            return ResponseEntity.status(404).body("User with ID " + user.getUserid() + " not found");
	        }
	    }

    @PostMapping("/delete-user")
    public ResponseEntity<String> deleteUser(@RequestBody Map<String, Integer> requestData) {
        Integer userId = requestData.get("userid");

        // Check if the user with the given ID exists
        User user = userService.getUserById(userId);
        if (user == null) {
            // If the user does not exist, return an error message
            return ResponseEntity.status(404).body("User with ID " + userId + " does not exist");
        } else {
            // If the user exists, delete the user
            userService.deleteUserById(userId);
            // Return a success message
            return ResponseEntity.ok("User deleted successfully");
        }	
    }
    
    @PostMapping("/disable-user")
    public ResponseEntity<String> disableUser(@RequestBody Map<String, Integer> requestData) {
        Integer userId = requestData.get("userid");

        // Check if the user with the given ID exists
        User user = userService.getUserById(userId);
        if (user == null) {
            // If the user does not exist, return an error message
            return ResponseEntity.status(404).body("User with ID " + userId + " does not exist");
        } else {
            // If the user exists, disable the user
            userService.disableUser(userId);
            // Return a success message
            return ResponseEntity.ok("User disabled successfully");
        }
    }
    
    @PostMapping("/enable-user")
    public ResponseEntity<String> enableUser(@RequestBody Map<String, Integer> requestData) {
        Integer userId = requestData.get("userid");

        // Check if the user with the given ID exists
        User user = userService.getUserById(userId);
        if (user == null) {
            // If the user does not exist, return an error message
            return ResponseEntity.status(404).body("User with ID " + userId + " does not exist");
        } else {
            // If the user exists, enable the user
            userService.enableUser(userId);
            // Return a success message
            return ResponseEntity.ok("User enabled successfully");
        }
    }

    }

