package com.torryharris.BackEndSample.Entity;

import jakarta.persistence.*;

@Entity
public class PerformanceTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer performanceId;

    @ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid")
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id", referencedColumnName = "courseid")
    private Course course;

    

    @ManyToOne
    @JoinColumn(name = "assessmentid", referencedColumnName = "assessmentid")
    private Assessment assessment;

    private Integer marks;

	public Integer getPerformanceId() {
		return performanceId;
	}

	public void setPerformanceId(Integer performanceId) {
		this.performanceId = performanceId;
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

	public Assessment getAssessment() {
		return assessment;
	}

	public void setAssessment(Assessment assessment) {
		this.assessment = assessment;
	}

	public Integer getMarks() {
		return marks;
	}

	public void setMarks(Integer marks) {
		this.marks = marks;
	}

	@Override
	public String toString() {
		return "PerformanceTracking [performanceId=" + performanceId + ", user=" + user + ", course=" + course
				+ ", assessment=" + assessment + ", marks=" + marks + "]";
	}

	public PerformanceTracking(Integer performanceId, User user, Course course, Assessment assessment, Integer marks) {
		super();
		this.performanceId = performanceId;
		this.user = user;
		this.course = course;
		this.assessment = assessment;
		this.marks = marks;
	}

	public PerformanceTracking() {
		super();
	}

}
