package com.torryharris.BackEndSample.Service.CourseContent;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.torryharris.BackEndSample.Entity.CourseContent;
import com.torryharris.BackEndSample.Repository.CourseContentRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CourseContentServiceImpl implements CourseContentService {

    @Autowired
    private CourseContentRepository courseContentRepository;

    @Override
    public List<CourseContent> getCourseContentByCourseId(Integer courseId) {
        return courseContentRepository.findByCourse_Courseid(courseId);
    }
    @Override
    public List<CourseContent> getAllCourseContents() {
        return (List<CourseContent>) courseContentRepository.findAll();
    }

    @Override
    public CourseContent getCourseContentById(Integer contentId) {
        return courseContentRepository.findById(contentId).get();
    }

    @Override
    public void addCourseContent(CourseContent courseContent) {
        courseContentRepository.save(courseContent);
    }

    @Override
    public void deleteCourseContentById(Integer contentId) {
        courseContentRepository.deleteById(contentId);
    }

    @Override
    public void updateCourseContent(Integer contentId, CourseContent updatedCourseContent) {
    	CourseContent existingCourseContent = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new EntityNotFoundException("CourseContent not found with id: " + contentId));

        // Update only non-null fields
        if (updatedCourseContent.getCourse() != null) {
            existingCourseContent.setCourse(updatedCourseContent.getCourse());
        }
        if (updatedCourseContent.getContenttype() != null) {
            existingCourseContent.setContenttype(updatedCourseContent.getContenttype());
        }
        if (updatedCourseContent.getContentdescription() != null) {
            existingCourseContent.setContentdescription(updatedCourseContent.getContentdescription());
        }
        if (updatedCourseContent.getContenturl() != null) {
            existingCourseContent.setContenturl(updatedCourseContent.getContenturl());
        }
        if (updatedCourseContent.getUploadedByUser() != null) {
            existingCourseContent.setUploadedByUser(updatedCourseContent.getUploadedByUser());
        }
        if (updatedCourseContent.getUploadedDate() != null) {
            existingCourseContent.setUploadedDate(updatedCourseContent.getUploadedDate());
        }

        courseContentRepository.save(existingCourseContent);
    }




}
