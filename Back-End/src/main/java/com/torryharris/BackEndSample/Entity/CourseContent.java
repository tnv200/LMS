package com.torryharris.BackEndSample.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class CourseContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contentid;

    @ManyToOne
    @JoinColumn(name = "course_id", referencedColumnName = "courseid")
    private Course course;

    private String contenttype;
    private String contentdescription;
    private String contenturl;

    @ManyToOne
    @JoinColumn(name = "uploaded_by", referencedColumnName = "userid")
    private User uploadedByUser;

    private LocalDate uploadedDate;

	public CourseContent() {
		super();
	}

	public Integer getContentid() {
		return contentid;
	}

	public void setContentid(Integer contentid) {
		this.contentid = contentid;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public String getContenttype() {
		return contenttype;
	}

	public void setContenttype(String contenttype) {
		this.contenttype = contenttype;
	}

	public String getContentdescription() {
		return contentdescription;
	}

	public void setContentdescription(String contentdescription) {
		this.contentdescription = contentdescription;
	}

	public String getContenturl() {
		return contenturl;
	}

	public void setContenturl(String contenturl) {
		this.contenturl = contenturl;
	}

	public User getUploadedByUser() {
		return uploadedByUser;
	}

	public void setUploadedByUser(User uploadedByUser) {
		this.uploadedByUser = uploadedByUser;
	}

	public LocalDate getUploadedDate() {
		return uploadedDate;
	}

	public void setUploadedDate(LocalDate uploadedDate) {
		this.uploadedDate = uploadedDate;
	}

	@Override
	public String toString() {
		return "CourseContent [contentid=" + contentid + ", course=" + course + ", contenttype=" + contenttype
				+ ", contentdescription=" + contentdescription + ", contenturl=" + contenturl + ", uploadedByUser="
				+ uploadedByUser + ", uploadedDate=" + uploadedDate + "]";
	}

	public CourseContent(Integer contentid, Course course, String contenttype, String contentdescription,
			String contenturl, User uploadedByUser, LocalDate uploadedDate) {
		super();
		this.contentid = contentid;
		this.course = course;
		this.contenttype = contenttype;
		this.contentdescription = contentdescription;
		this.contenturl = contenturl;
		this.uploadedByUser = uploadedByUser;
		this.uploadedDate = uploadedDate;
	}

    
}
