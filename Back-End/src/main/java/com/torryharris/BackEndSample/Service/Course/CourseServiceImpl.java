package com.torryharris.BackEndSample.Service.Course;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.torryharris.BackEndSample.Entity.Course;
import com.torryharris.BackEndSample.Repository.CourseRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EntityManager entityManager;

    @Override
    public List<Course> getAllCourses() {
        return (List<Course>) courseRepository.findAll();
    }

    @Override
    public Course getCourseById(Integer courseId) {
        return courseRepository.findById(courseId).get();
    }

    @Override
    public void addCourse(Course course) {
        courseRepository.save(course);
    }

    @Override
    public void deleteCourseById(Integer courseId) {
        courseRepository.deleteById(courseId);
    }

    @Override
    public void updateCourse(Integer courseId, Course updatedCourse) {
    	 Course existingCourse = courseRepository.findById(courseId)
                 .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + courseId));

         // Update only non-null fields
         if (updatedCourse.getCoursename() != null) {
             existingCourse.setCoursename(updatedCourse.getCoursename());
         }
         if (updatedCourse.getCoursedescription() != null) {
             existingCourse.setCoursedescription(updatedCourse.getCoursedescription());
         }
         if (updatedCourse.getUploadedByUser() != null) {
             existingCourse.setUploadedByUser(updatedCourse.getUploadedByUser());
         }
         if (updatedCourse.getUploadedDate() != null) {
             existingCourse.setUploadedDate(updatedCourse.getUploadedDate());
         }

         courseRepository.save(existingCourse);
    }


}
