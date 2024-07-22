package com.torryharris.BackEndSample.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "candidate_results")
public class CandidateResults {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resultid")
    private Integer resultId;

    @ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid")
    private User user;

    @ManyToOne
    @JoinColumn(name = "question_id", referencedColumnName = "questionId")
    private AssessmentQuestion question;

    @ManyToOne
    @JoinColumn(name = "assessmentid", referencedColumnName = "assessmentid")
    private Assessment assessment;

    @Column(name = "candidate_answer")
    private String candidateAnswer;

    @Override
    public String toString() {
        return "CandidateResults{" +
                "resultId=" + resultId +
                ", user=" + user +
                ", question=" + question +
                ", assessment=" + assessment +
                ", candidateAnswer='" + candidateAnswer + '\'' +
                '}';
    }

    public Integer getResultId() {
        return resultId;
    }

    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public AssessmentQuestion getQuestion() {
        return question;
    }

    public void setQuestion(AssessmentQuestion question) {
        this.question = question;
    }

    public Assessment getAssessment() {
        return assessment;
    }

    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }

    public String getCandidateAnswer() {
        return candidateAnswer;
    }

    public void setCandidateAnswer(String candidateAnswer) {
        this.candidateAnswer = candidateAnswer;
    }

    public CandidateResults() {
    }

    public CandidateResults(Integer resultId, User user, AssessmentQuestion question, Assessment assessment, String candidateAnswer) {
        this.resultId = resultId;
        this.user = user;
        this.question = question;
        this.assessment = assessment;
        this.candidateAnswer = candidateAnswer;
    }
// Constructors, getters, and setters
}
