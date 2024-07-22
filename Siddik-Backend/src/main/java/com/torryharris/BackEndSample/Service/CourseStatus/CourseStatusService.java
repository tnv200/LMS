package com.torryharris.BackEndSample.Service.CourseStatus;

import com.torryharris.BackEndSample.Entity.CourseStatus;

import java.util.List;

public interface CourseStatusService {
    List<CourseStatus> getAllCourseStatus();

    CourseStatus getCourseStatusById(Integer statusId);

    CourseStatus createCourseStatus(CourseStatus courseStatus);

    CourseStatus updateCourseStatus(Integer statusId, CourseStatus courseStatus);

    void deleteCourseStatus(Integer statusId);

    CourseStatus getCourseStatus(Integer userId, Integer courseId);
}
