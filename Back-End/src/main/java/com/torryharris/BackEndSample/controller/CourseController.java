package com.torryharris.BackEndSample.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.torryharris.BackEndSample.Entity.Course;
import com.torryharris.BackEndSample.Service.Course.CourseService;

@RestController
@RequestMapping("/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{courseId}")
    public Course getCourseById(@PathVariable Integer courseId) {
        return courseService.getCourseById(courseId);
    }

    @PostMapping
    public ResponseEntity<String> addCourse(@RequestBody Course course) {
        courseService.addCourse(course);
        return new ResponseEntity<>("Course Successfully added with ID: " + course.getCourseid(), HttpStatus.CREATED);
    }
    
    @PutMapping("/{courseId}")
    public ResponseEntity<String> updateCourse(@PathVariable Integer courseId, @RequestBody Course updatedCourse) {
        courseService.updateCourse(courseId, updatedCourse);
        return new ResponseEntity<>("Course Successfully updated with ID: " + courseId, HttpStatus.OK);
    }
    @DeleteMapping("/{courseId}")
    public ResponseEntity<String> deleteCourse(@PathVariable Integer courseId) {
        courseService.deleteCourseById(courseId);
        return new ResponseEntity<>("Course Successfully deleted with ID: " + courseId, HttpStatus.OK);
    }



}
