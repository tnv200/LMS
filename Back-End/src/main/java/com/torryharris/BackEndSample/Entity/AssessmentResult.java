package com.torryharris.BackEndSample.Entity;

import jakarta.persistence.*;

@Entity
public class AssessmentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer resultId;

    @ManyToOne
    @JoinColumn(name = "assessment_id", referencedColumnName = "assessmentid")
    private Assessment assessment;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userid")
    private User user;

    private String result; // Change the type to String

    public AssessmentResult(Integer resultId, Assessment assessment, User user, String result) {
        this.resultId = resultId;
        this.assessment = assessment;
        this.user = user;
        this.result = result;
    }

    public AssessmentResult() {
    }

    @Override
    public String toString() {
        return "AssessmentResult{" +
                "resultId=" + resultId +
                ", assessment=" + assessment +
                ", user=" + user +
                ", result='" + result + '\'' +
                '}';
    }

    public Integer getResultId() {
        return resultId;
    }

    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }

    public Assessment getAssessment() {
        return assessment;
    }

    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}