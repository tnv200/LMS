package com.torryharris.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.torryharris.BackEndSample.Entity.User;
import com.torryharris.BackEndSample.Service.Assessment.AssessmentService;
import com.torryharris.BackEndSample.Service.Course.CourseService;
import com.torryharris.BackEndSample.Service.User.UserService;
import com.torryharris.BackEndSample.controller.AdminRestController;

@ExtendWith(MockitoExtension.class)
public class AdminRestControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private CourseService courseService;

    @Mock
    private AssessmentService assessmentService;

    @InjectMocks
    private AdminRestController adminRestController;

    @Test
    public void testAdminLogin_PositiveCase() {
    
        String email = "admin@example.com";
        String password = "admin123";

        Map<String, String> credentials = new HashMap<>();
        credentials.put("emailid", email);
        credentials.put("password", password);

        User mockAdmin = new User();
        mockAdmin.setEmailid(email);
        mockAdmin.setUsertype("admin");

    
        when(userService.authenticateUser(email, password)).thenReturn(mockAdmin);


        ResponseEntity<String> responseEntity = adminRestController.adminLogin(credentials);


        assertEquals("Admin authenticated successfully", responseEntity.getBody());
    }

    @Test
    public void testAdminLogin_NegativeCase() {
    
        String email = "user@example.com";
        String password = "user123";

        Map<String, String> credentials = new HashMap<>();
        credentials.put("emailid", email);
        credentials.put("password", password);

        
        when(userService.authenticateUser(email, password)).thenReturn(null);

      
        ResponseEntity<String> responseEntity = adminRestController.adminLogin(credentials);

      
        assertEquals("Invalid credentials or insufficient privileges", responseEntity.getBody());
    }

    @Test
    public void testAddUser_PositiveCase() {
       
        User newUser = new User();
        newUser.setEmailid("newuser@example.com");
        newUser.setUsertype("user");

        when(userService.isUserExists(newUser.getEmailid(), newUser.getUserid())).thenReturn(false);

    
        ResponseEntity<String> responseEntity = adminRestController.addUser(newUser);

        assertEquals("User added successfully", responseEntity.getBody());
    }

    @Test
    public void testAddUser_NegativeCase_UserExists() {
   
        User existingUser = new User();
        existingUser.setEmailid("existinguser@example.com");
        existingUser.setUsertype("user");


        when(userService.isUserExists(existingUser.getEmailid(), existingUser.getUserid())).thenReturn(true);

    
        ResponseEntity<String> responseEntity = adminRestController.addUser(existingUser);

        assertEquals("User with the same email or user ID already exists", responseEntity.getBody());
    }

    @Test
    public void testEditUser_PositiveCase() {

        User existingUser = new User();
        existingUser.setUserid(1);
        existingUser.setEmailid("existinguser@example.com");
        existingUser.setUsertype("user");


        when(userService.getUserById(existingUser.getUserid())).thenReturn(existingUser);
        doNothing().when(userService).editUser(existingUser);

        ResponseEntity<String> responseEntity = adminRestController.editUser(existingUser);

        assertEquals("User edited successfully", responseEntity.getBody());
    }

    @Test
    public void testEditUser_NegativeCase_UserNotFound() {
   
        User nonExistingUser = new User();
        nonExistingUser.setUserid(99); 


        when(userService.getUserById(nonExistingUser.getUserid())).thenReturn(null);

        ResponseEntity<String> responseEntity = adminRestController.editUser(nonExistingUser);

        assertEquals("User with ID 99 not found", responseEntity.getBody());
    }

    @Test
    public void testDeleteUser_PositiveCase() {

        Integer userId = 1;
        when(userService.getUserById(userId)).thenReturn(new User());
        doNothing().when(userService).deleteUserById(userId);
        ResponseEntity<String> responseEntity = adminRestController.deleteUser(Map.of("userid", userId));
        assertEquals("User deleted successfully", responseEntity.getBody());
    }

    @Test
    public void testDeleteUser_NegativeCase_UserNotFound() {
        Integer nonExistingUserId = 99; 
        when(userService.getUserById(nonExistingUserId)).thenReturn(null);
        ResponseEntity<String> responseEntity = adminRestController.deleteUser(Map.of("userid", nonExistingUserId));
        assertEquals("User with ID 99 does not exist", responseEntity.getBody());
    }
}
