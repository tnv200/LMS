package com.torryharris.BackEndSample.Entity;

import jakarta.persistence.*;

@Entity
public class CourseStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer statusId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userid")
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id", referencedColumnName = "courseid")
    private Course course;

    public CourseStatus() {
    }

    public Integer getStatusId() {
        return statusId;
    }

    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "CourseStatus{" +
                "statusId=" + statusId +
                ", user=" + user +
                ", course=" + course +
                ", status='" + status + '\'' +
                '}';
    }

    public CourseStatus(Integer statusId, User user, Course course, String status) {
        this.statusId = statusId;
        this.user = user;
        this.course = course;
        this.status = status;
    }

    @Column(name = "status")
    private String status;


}

