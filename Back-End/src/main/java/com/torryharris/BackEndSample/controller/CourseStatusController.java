package com.torryharris.BackEndSample.controller;

import com.torryharris.BackEndSample.Entity.CourseStatus;
import com.torryharris.BackEndSample.Service.CourseStatus.CourseStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course-status")
public class CourseStatusController {

    @Autowired
    private CourseStatusService courseStatusService;

    @GetMapping
    public List<CourseStatus> getAllCourseStatus() {
        return courseStatusService.getAllCourseStatus();
    }

    @GetMapping("/{statusId}")
    public ResponseEntity<CourseStatus> getCourseStatusById(@PathVariable Integer statusId) {
        CourseStatus courseStatus = courseStatusService.getCourseStatusById(statusId);
        if (courseStatus != null) {
            return new ResponseEntity<>(courseStatus, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/{userId}/{courseId}")
    public ResponseEntity<CourseStatus> getCourseStatus(
            @PathVariable Integer userId,
            @PathVariable Integer courseId) {
        CourseStatus courseStatus = courseStatusService.getCourseStatus(userId, courseId);
        return ResponseEntity.ok(courseStatus);
    }

    @PostMapping
    public ResponseEntity<CourseStatus> createCourseStatus(@RequestBody CourseStatus courseStatus) {
        CourseStatus createdCourseStatus = courseStatusService.createCourseStatus(courseStatus);
        return new ResponseEntity<>(createdCourseStatus, HttpStatus.CREATED);
    }

    @PutMapping("/{statusId}")
    public ResponseEntity<CourseStatus> updateCourseStatus(@PathVariable Integer statusId,
                                                           @RequestBody CourseStatus updatedCourseStatus) {
        CourseStatus updatedStatus = courseStatusService.updateCourseStatus(statusId, updatedCourseStatus);
        if (updatedStatus != null) {
            return new ResponseEntity<>(updatedStatus, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{statusId}")
    public ResponseEntity<Void> deleteCourseStatus(@PathVariable Integer statusId) {
        courseStatusService.deleteCourseStatus(statusId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
