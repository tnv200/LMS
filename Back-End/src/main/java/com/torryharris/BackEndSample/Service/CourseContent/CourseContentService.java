package com.torryharris.BackEndSample.Service.CourseContent;

import java.util.List;
import com.torryharris.BackEndSample.Entity.CourseContent;

public interface CourseContentService {

    List<CourseContent> getAllCourseContents();
    CourseContent getCourseContentById(Integer contentId);
    void addCourseContent(CourseContent courseContent);
    void deleteCourseContentById(Integer contentId);
    void updateCourseContent(Integer contentId, CourseContent updatedCourseContent);


    List<CourseContent> getCourseContentByCourseId(Integer courseId);
}
