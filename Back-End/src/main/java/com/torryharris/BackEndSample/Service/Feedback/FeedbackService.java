package com.torryharris.BackEndSample.Service.Feedback;

import java.util.List;

import com.torryharris.BackEndSample.Entity.Feedback;
import com.torryharris.BackEndSample.Entity.User;

public interface FeedbackService {

    List<Feedback> getAllFeedback();
    Feedback getFeedbackById(Integer feedbackId);
    void addFeedback(Feedback feedback);
    void deleteFeedbackById(Integer feedbackId);
    void updateFeedback(Integer feedbackId, Feedback updatedFeedback);
    List<Feedback> getFeedbacksByUserId(Integer userid);

    List<Feedback> getFeedbacksForAdmin();
    List<Feedback> getFeedbacksByUserType(String userType);
    void sendFeedbackToAllUsers(Feedback feedback);
    
	List<User> getAllUsers();
}
