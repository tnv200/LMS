package com.torryharris.BackEndSample.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.torryharris.BackEndSample.Entity.CourseContent;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseContentRepository extends JpaRepository<CourseContent, Integer> {

    List<CourseContent> findByCourse_Courseid(Integer courseId);

}
