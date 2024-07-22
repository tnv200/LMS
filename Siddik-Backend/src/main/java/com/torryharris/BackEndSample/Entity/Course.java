package com.torryharris.BackEndSample.Entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer courseid;

    private String coursename;
    private String coursedescription;

    @ManyToOne
    @JoinColumn(name = "uploaded_by", referencedColumnName = "userid")
    private User uploadedByUser;

    private LocalDate uploadedDate;




	@Override
	public String toString() {
		return "Course{" +
				"courseid=" + courseid +
				", coursename='" + coursename + '\'' +
				", coursedescription='" + coursedescription + '\'' +
				", uploadedByUser=" + uploadedByUser +
				", uploadedDate=" + uploadedDate +
				'}';
	}




// Constructors, getters, setters, and other methods

	public Integer getCourseid() {
		return courseid;
	}

	public Course() {
		super();
	}

	public Course(Integer courseid, String coursename, String coursedescription, User uploadedByUser,
			LocalDate uploadedDate) {
		super();
		this.courseid = courseid;
		this.coursename = coursename;
		this.coursedescription = coursedescription;
		this.uploadedByUser = uploadedByUser;
		this.uploadedDate = uploadedDate;
	}

	public void setCourseid(Integer courseid) {
		this.courseid = courseid;
	}

	public String getCoursename() {
		return coursename;
	}

	public void setCoursename(String coursename) {
		this.coursename = coursename;
	}

	public String getCoursedescription() {
		return coursedescription;
	}

	public void setCoursedescription(String coursedescription) {
		this.coursedescription = coursedescription;
	}

	public LocalDate getUploadedDate() {
		return uploadedDate;
	}

	public void setUploadedDate(LocalDate uploadedDate) {
		this.uploadedDate = uploadedDate;
	}

	// Getter and setter for User
    public User getUploadedByUser() {
        return uploadedByUser;
    }

    public void setUploadedByUser(User uploadedByUser) {
        this.uploadedByUser = uploadedByUser;
    }
}
