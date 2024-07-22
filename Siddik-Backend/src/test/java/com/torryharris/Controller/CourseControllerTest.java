package com.torryharris.Controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import com.torryharris.BackEndSample.Entity.Course;
import com.torryharris.BackEndSample.Service.Course.CourseService;
import com.torryharris.BackEndSample.controller.CourseController;

@ExtendWith(MockitoExtension.class)
public class CourseControllerTest {

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CourseController courseController;

    @Test
    public void testGetAllCourses_PositiveCase() {
        List<Course> mockCourses = new ArrayList<>();
        mockCourses.add(new Course(1, "Java Programming", "Learn Java programming basics", null, null));
        mockCourses.add(new Course(2, "Spring Framework", "Introduction to Spring framework", null, null));
        when(courseService.getAllCourses()).thenReturn(mockCourses);
        List<Course> result = courseController.getAllCourses();
        assertEquals(mockCourses, result);
    }

    @Test
    public void testGetCourseById_PositiveCase() {
        int courseId = 1;
        Course mockCourse = new Course(courseId, "Java Programming", "Learn Java programming basics", null, null);
        when(courseService.getCourseById(courseId)).thenReturn(mockCourse);
        Course result = courseController.getCourseById(courseId);
        assertEquals(mockCourse, result);
    }

    @Test
    public void testAddCourse_PositiveCase() {
        Course newCourse = new Course(3, "Python Programming", "Introduction to Python programming", null, null);
        doNothing().when(courseService).addCourse(newCourse);

        ResponseEntity<String> responseEntity = courseController.addCourse(newCourse);

        assertEquals("Course Successfully added with ID: 3", responseEntity.getBody());
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
    }

    @Test
    public void testUpdateCourse_PositiveCase() {
        int courseId = 1;
        Course updatedCourse = new Course(courseId, "Java Programming Advanced", "Advanced Java programming concepts", null, null);

        doNothing().when(courseService).updateCourse(courseId, updatedCourse);

        ResponseEntity<String> responseEntity = courseController.updateCourse(courseId, updatedCourse);

        assertEquals("Course Successfully updated with ID: 1", responseEntity.getBody());
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

    @Test
    public void testDeleteCourse_PositiveCase() {
        int courseId = 1;

        doNothing().when(courseService).deleteCourseById(courseId);

        ResponseEntity<String> responseEntity = courseController.deleteCourse(courseId);

        assertEquals("Course Successfully deleted with ID: 1", responseEntity.getBody());
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

    @Test
    public void testGetCourseById_NegativeCase_CourseNotFound() {
        int courseId = 99;

        when(courseService.getCourseById(courseId)).thenReturn(null);

        Course result = courseController.getCourseById(courseId);

        assertNull(result);
    }


}

