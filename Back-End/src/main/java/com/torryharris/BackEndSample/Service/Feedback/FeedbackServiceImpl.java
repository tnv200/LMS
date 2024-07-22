package com.torryharris.BackEndSample.Service.Feedback;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.torryharris.BackEndSample.Entity.Feedback;
import com.torryharris.BackEndSample.Entity.User;
import com.torryharris.BackEndSample.Repository.FeedbackRepository;
import com.torryharris.BackEndSample.Service.User.UserService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private UserService userService;

    @Override
    public List<Feedback> getAllFeedback() {
        List<Feedback> feedbackList = new ArrayList<>();
        feedbackRepository.findAll().forEach(feedbackList::add);
        return feedbackList;
    }

    @Override
    public Feedback getFeedbackById(Integer feedbackId) {
        return feedbackRepository.findById(feedbackId).orElse(null);
    }

    @Override
    public void addFeedback(Feedback feedback) {
        feedbackRepository.save(feedback);
    }

    @Override
    public void deleteFeedbackById(Integer feedbackId) {
        feedbackRepository.deleteById(feedbackId);
    }

    @Override
    public void updateFeedback(Integer feedbackId, Feedback updatedFeedback) {
    	Feedback existingFeedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found with id: " + feedbackId));

        // Update only non-null fields
        if (updatedFeedback.getUser() != null) {
            existingFeedback.setUser(updatedFeedback.getUser());
        }
        if (updatedFeedback.getCourse() != null) {
            existingFeedback.setCourse(updatedFeedback.getCourse());
        }
        if (updatedFeedback.getFeedbackText() != null) {
            existingFeedback.setFeedbackText(updatedFeedback.getFeedbackText());
        }
        if (updatedFeedback.getDateSubmitted() != null) {
            existingFeedback.setDateSubmitted(updatedFeedback.getDateSubmitted());
        }

        feedbackRepository.save(existingFeedback);
    }
    @Override
    public List<Feedback> getFeedbacksByUserId(Integer userid) {
        // Fetch feedbacks where either user or recipientUser has the specified user ID
        return feedbackRepository.findByUserUserid(userid);
    }

    @Override
    public List<Feedback> getFeedbacksForAdmin() {
        return feedbackRepository.findByUserUsertype("admin");
    }

    @Override
    public List<Feedback> getFeedbacksByUserType(String userType) {
        return feedbackRepository.findByUserUsertype(userType);
    }
    
    @Override
    public List<User> getAllUsers() {
        // Implement the method to get all users from your UserRepository
        return userService.getAllUsers();
    }

    @Override
    public void sendFeedbackToAllUsers(Feedback feedback) {
        List<User> allUsers = getAllUsers();
        
        List<Feedback> userFeedbacks = new ArrayList<>();
        for (User user : allUsers) {
            // Customize feedback for each user if needed
            Feedback userFeedback = new Feedback();
            userFeedback.setUser(feedback.getUser());
            userFeedback.setCourse(feedback.getCourse());
            userFeedback.setDateSubmitted(feedback.getDateSubmitted());
            userFeedback.setFeedbackText(feedback.getFeedbackText());
            userFeedback.setRecipientUser(user);
            feedbackRepository.save(userFeedback);
            userFeedbacks.add(userFeedback);
        }  
    }
}
