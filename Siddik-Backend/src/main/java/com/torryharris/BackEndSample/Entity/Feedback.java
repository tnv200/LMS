package com.torryharris.BackEndSample.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer feedbackId;

	public Feedback(User recipientUser) {
		this.recipientUser = recipientUser;
	}

	@ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid")
    private User user;


	@ManyToOne
	@JoinColumn(name = "recipient_userid", referencedColumnName = "userid")
	private User recipientUser;

	@Override
	public String toString() {
		return "Feedback{" +
				"feedbackId=" + feedbackId +
				", user=" + user +
				", recipientUser=" + recipientUser +
				", course=" + course +
				", feedbackText='" + feedbackText + '\'' +
				", dateSubmitted=" + dateSubmitted +
				'}';
	}

	public User getRecipientUser() {
		return recipientUser;
	}

	public void setRecipientUser(User recipientUser) {
		this.recipientUser = recipientUser;
	}

	@ManyToOne
    @JoinColumn(name = "course_id", referencedColumnName = "courseid")
    private Course course;

    private String feedbackText;

    private LocalDate dateSubmitted;

	public Integer getFeedbackId() {
		return feedbackId;
	}

	public void setFeedbackId(Integer feedbackId) {
		this.feedbackId = feedbackId;
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

	public String getFeedbackText() {
		return feedbackText;
	}

	public void setFeedbackText(String feedbackText) {
		this.feedbackText = feedbackText;
	}

	public LocalDate getDateSubmitted() {
		return dateSubmitted;
	}

	public void setDateSubmitted(LocalDate dateSubmitted) {
		this.dateSubmitted = dateSubmitted;
	}

	public Feedback(Integer feedbackId, User user, Course course, String feedbackText, LocalDate dateSubmitted) {
		super();
		this.feedbackId = feedbackId;
		this.user = user;
		this.course = course;
		this.feedbackText = feedbackText;
		this.dateSubmitted = dateSubmitted;
	}

	public Feedback() {
		super();
	}

    
}
