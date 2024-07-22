package com.torryharris.Controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.torryharris.BackEndSample.Entity.User;
import com.torryharris.BackEndSample.Service.User.UserService;
import com.torryharris.BackEndSample.controller.UserController;
import com.torryharris.BackEndSample.Smtp_Mail;

class UserControllerTest {

    @Test
    void getUserByEmail_ExistingUser_ReturnsUser() {
        UserService userServiceMock = mock(UserService.class);
        User mockUser = new User(); 
        when(userServiceMock.getByUserEmail("test@example.com")).thenReturn(mockUser);

        UserController userController = new UserController();
        userController.userService = userServiceMock;

        ResponseEntity<User> responseEntity = userController.getUserByEmail("test@example.com");

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(mockUser, responseEntity.getBody());
    }

    @Test
    void getUserByEmail_NonExistingUser_ReturnsNotFound() {
        UserService userServiceMock = mock(UserService.class);
        when(userServiceMock.getByUserEmail("nonexistent@example.com")).thenReturn(null);

        UserController userController = new UserController();
        userController.userService = userServiceMock;

        ResponseEntity<User> responseEntity = userController.getUserByEmail("nonexistent@example.com");

        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }

    @Test
    void getUserByEmail_ExceptionThrown_ReturnsInternalServerError() {
        UserService userServiceMock = mock(UserService.class);
        when(userServiceMock.getByUserEmail(any())).thenThrow(new RuntimeException("Simulated exception"));

        UserController userController = new UserController();
        userController.userService = userServiceMock;

        ResponseEntity<User> responseEntity = userController.getUserByEmail("test@example.com");

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }

    @Test
    void updatePassword_ValidRequest_ReturnsSuccessMessage() {
        UserService userServiceMock = mock(UserService.class);
        User mockUser = new User();
        mockUser.setPassword("currentPassword"); // Set a known current password for testing
        when(userServiceMock.getByUserEmail("test@example.com")).thenReturn(mockUser);

        UserController userController = new UserController();
        userController.userService = userServiceMock;

        ResponseEntity<String> responseEntity = userController.updatePassword(
                Map.of("email", "test@example.com", "currentPassword", "currentPassword", "newPassword", "newPassword"));

        // Assert
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Password updated successfully", responseEntity.getBody());
    }

    @Test
    void updatePassword_InvalidPassword_ReturnsBadRequest() {
        UserService userServiceMock = mock(UserService.class);
        User mockUser = new User();
        mockUser.setPassword("currentPassword");
        when(userServiceMock.getByUserEmail("test@example.com")).thenReturn(mockUser);

        UserController userController = new UserController();
        userController.userService = userServiceMock;

        ResponseEntity<String> responseEntity = userController.updatePassword(
                Map.of("email", "test@example.com", "currentPassword", "wrongPassword", "newPassword", "newPassword"));

        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("Invalid email or current password", responseEntity.getBody());
    }

}

