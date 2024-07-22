package com.torryharris.BackEndSample.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.torryharris.BackEndSample.Entity.CourseContent;
import com.torryharris.BackEndSample.Service.CourseContent.CourseContentService;

@RestController
@RequestMapping("/coursecontent")
public class CourseContentController {

    @Autowired
    private CourseContentService courseContentService;

    @GetMapping
    public List<CourseContent> getAllCourseContents() {
        return courseContentService.getAllCourseContents();
    }

    @GetMapping("/{contentId}")
    public CourseContent getCourseContentById(@PathVariable Integer contentId) {
        return courseContentService.getCourseContentById(contentId);
    }
    // CourseContentController.java

    @GetMapping("/byCourse/{courseId}")
    public List<CourseContent> getCourseContentByCourseId(@PathVariable Integer courseId) {
        return courseContentService.getCourseContentByCourseId(courseId);
    }



    @PostMapping
    public ResponseEntity<String> addCourseContent(@RequestBody CourseContent courseContent) {
        courseContentService.addCourseContent(courseContent);
        return new ResponseEntity<>("CourseContent Successfully added with ID: " + courseContent.getContentid(),
                HttpStatus.CREATED);
    }
    @PutMapping("/{contentId}")
    public ResponseEntity<String> updateCourseContent(@PathVariable Integer contentId,
                                                      @RequestBody CourseContent updatedCourseContent) {
        courseContentService.updateCourseContent(contentId, updatedCourseContent);
        return new ResponseEntity<>("CourseContent Successfully updated with ID: " + contentId, HttpStatus.OK);
    }

    @DeleteMapping("/{contentId}")
    public ResponseEntity<String> deleteCourseContent(@PathVariable Integer contentId) {
        courseContentService.deleteCourseContentById(contentId);
        return new ResponseEntity<>("CourseContent Successfully deleted with ID: " + contentId, HttpStatus.OK);
    }
}
