package com.torryharris.BackEndSample.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.torryharris.BackEndSample.Entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

}
