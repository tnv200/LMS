package com.torryharris.BackEndSample.Entity;

import jakarta.persistence.*;

@Entity
public class Assessment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer assessmentid;

	@ManyToOne
	@JoinColumn(name = "course_id", referencedColumnName = "courseid")
	private Course course;

	private String assessmentTitle;
	private Integer maximumMarks;
	private Integer passingMarks;

	private String status;
	private Integer Time;

	public Assessment(Integer assessmentid, Course course, String assessmentTitle, Integer maximumMarks, Integer passingMarks, String status, Integer time) {
		this.assessmentid = assessmentid;
		this.course = course;
		this.assessmentTitle = assessmentTitle;
		this.maximumMarks = maximumMarks;
		this.passingMarks = passingMarks;
		this.status = status;
		Time = time;
	}

	public Assessment() {
		super();
	}

	public Integer getAssessmentid() {
		return assessmentid;
	}

	public void setAssessmentid(Integer assessmentid) {
		this.assessmentid = assessmentid;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public String getAssessmentTitle() {
		return assessmentTitle;
	}

	public void setAssessmentTitle(String assessmentTitle) {
		this.assessmentTitle = assessmentTitle;
	}

	public Integer getMaximumMarks() {
		return maximumMarks;
	}

	public void setMaximumMarks(Integer maximumMarks) {
		this.maximumMarks = maximumMarks;
	}

	public Integer getPassingMarks() {
		return passingMarks;
	}

	public void setPassingMarks(Integer passingMarks) {
		this.passingMarks = passingMarks;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Integer getTime() {
		return Time;
	}

	public void setTime(Integer time) {
		Time = time;
	}

	@Override
	public String toString() {
		return "Assessment{" +
				"assessmentid=" + assessmentid +
				", course=" + course +
				", assessmentTitle='" + assessmentTitle + '\'' +
				", maximumMarks=" + maximumMarks +
				", passingMarks=" + passingMarks +
				", status='" + status + '\'' +
				", Time=" + Time +
				'}';
	}
}