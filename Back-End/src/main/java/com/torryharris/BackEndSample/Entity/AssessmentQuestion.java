package com.torryharris.BackEndSample.Entity;

import jakarta.persistence.*;

@Entity
public class AssessmentQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionId;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;

	@ManyToOne
	@JoinColumn(name = "assessment_id", referencedColumnName = "assessmentid")
	private Assessment assessment; // Add this field

    @ManyToOne
    @JoinColumn(name = "tag_id", referencedColumnName = "tag_id")
    private Tag tag;

	public AssessmentQuestion(Integer questionId, String questionText, String optionA, String optionB, String optionC, String optionD, String correctAnswer, Assessment assessment, Tag tag) {
		this.questionId = questionId;
		this.questionText = questionText;
		this.optionA = optionA;
		this.optionB = optionB;
		this.optionC = optionC;
		this.optionD = optionD;
		this.correctAnswer = correctAnswer;
		this.assessment = assessment;
		this.tag = tag;
	}


	public AssessmentQuestion() {
		super();
	}

	@Override
	public String toString() {
		return "AssessmentQuestion{" +
				"questionId=" + questionId +
				", questionText='" + questionText + '\'' +
				", optionA='" + optionA + '\'' +
				", optionB='" + optionB + '\'' +
				", optionC='" + optionC + '\'' +
				", optionD='" + optionD + '\'' +
				", correctAnswer='" + correctAnswer + '\'' +
				", assessment=" + assessment +
				", tag=" + tag +
				'}';
	}

	public Integer getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}

	public String getQuestionText() {
		return questionText;
	}

	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}

	public String getOptionA() {
		return optionA;
	}

	public void setOptionA(String optionA) {
		this.optionA = optionA;
	}

	public String getOptionB() {
		return optionB;
	}

	public void setOptionB(String optionB) {
		this.optionB = optionB;
	}

	public String getOptionC() {
		return optionC;
	}

	public void setOptionC(String optionC) {
		this.optionC = optionC;
	}

	public String getOptionD() {
		return optionD;
	}

	public void setOptionD(String optionD) {
		this.optionD = optionD;
	}

	public String getCorrectAnswer() {
		return correctAnswer;
	}

	public void setCorrectAnswer(String correctAnswer) {
		this.correctAnswer = correctAnswer;
	}

	public Assessment getAssessment() {
		return assessment;
	}

	public void setAssessment(Assessment assessment) {
		this.assessment = assessment;
	}

	public Tag getTag() {
		return tag;
	}

	public void setTag(Tag tag) {
		this.tag = tag;
	}
}
