package com.torryharris.BackEndSample.Repository;

import com.torryharris.BackEndSample.Entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseStatusRepository extends JpaRepository<CourseStatus, Integer> {
    @Query("SELECT cs FROM CourseStatus cs WHERE cs.user.userid = :userId AND cs.course.courseid = :courseId")
    CourseStatus findByUserIdAndCourseId(
            @Param("userId") Integer userId,
            @Param("courseId") Integer courseId
    );
}
