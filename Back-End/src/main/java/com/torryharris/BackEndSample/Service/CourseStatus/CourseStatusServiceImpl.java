package com.torryharris.BackEndSample.Service.CourseStatus;

import com.torryharris.BackEndSample.Entity.CourseStatus;
import com.torryharris.BackEndSample.Repository.CourseStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseStatusServiceImpl implements CourseStatusService {

    @Autowired
    private CourseStatusRepository courseStatusRepository;

    @Override
    public List<CourseStatus> getAllCourseStatus() {
        return courseStatusRepository.findAll();
    }

    @Override
    public CourseStatus getCourseStatusById(Integer statusId) {
        Optional<CourseStatus> optionalCourseStatus = courseStatusRepository.findById(statusId);
        return optionalCourseStatus.orElse(null);
    }

    @Override
    public CourseStatus createCourseStatus(CourseStatus courseStatus) {
        return courseStatusRepository.save(courseStatus);
    }

    @Override
    public CourseStatus updateCourseStatus(Integer statusId, CourseStatus updatedCourseStatus) {
        if (courseStatusRepository.existsById(statusId)) {
            updatedCourseStatus.setStatusId(statusId);
            return courseStatusRepository.save(updatedCourseStatus);
        }
        return null; // Handle not found scenario
    }

    @Override
    public void deleteCourseStatus(Integer statusId) {
        courseStatusRepository.deleteById(statusId);
    }

    @Override
    public CourseStatus getCourseStatus(Integer userId, Integer courseId) {
        return courseStatusRepository.findByUserIdAndCourseId(userId, courseId);
    }
}
