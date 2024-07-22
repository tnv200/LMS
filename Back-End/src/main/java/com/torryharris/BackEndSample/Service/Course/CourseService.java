package com.torryharris.BackEndSample.Service.Course;

import java.util.List;

import com.torryharris.BackEndSample.Entity.Course;

public interface CourseService {



    List<Course> getAllCourses();
    Course getCourseById(Integer courseId);
    void addCourse(Course course);
    void deleteCourseById(Integer courseId);
    void updateCourse(Integer courseId, Course updatedCourse);




}
