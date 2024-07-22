package com.torryharris.BackEndSample.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.torryharris.BackEndSample.Entity.Feedback;
import com.torryharris.BackEndSample.Service.Feedback.FeedbackService;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @GetMapping("/{feedbackId}")
    public Feedback getFeedbackById(@PathVariable Integer feedbackId) {
        return feedbackService.getFeedbackById(feedbackId);
    }

    @PostMapping
    public ResponseEntity<String> addFeedback(@RequestBody Feedback feedback) {
        feedbackService.addFeedback(feedback);
        return new ResponseEntity<>("Feedback Successfully added with ID: " + feedback.getFeedbackId(),
                HttpStatus.CREATED);
    }
    @PutMapping("/{feedbackId}")
    public ResponseEntity<String> updateFeedback(@PathVariable Integer feedbackId,
                                                 @RequestBody Feedback updatedFeedback) {
        feedbackService.updateFeedback(feedbackId, updatedFeedback);
        return new ResponseEntity<>("Feedback Successfully updated with ID: " + feedbackId, HttpStatus.OK);
    }

    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<String> deleteFeedback(@PathVariable Integer feedbackId) {
        feedbackService.deleteFeedbackById(feedbackId);
        return new ResponseEntity<>("Feedback Successfully deleted with ID: " + feedbackId, HttpStatus.OK);
    }

    @GetMapping("/user/{userid}")
    public List<Feedback> getFeedbacksByUserId(@PathVariable Integer userid) {
        return feedbackService.getFeedbacksByUserId(userid);
    }

    @GetMapping("/user/usertype/{usertype}")
    public ResponseEntity<List<Feedback>> getFeedbacksByUserType(@PathVariable String usertype) {
        List<Feedback> feedbacks;

        if ("admin".equals(usertype)) {
            feedbacks = feedbackService.getFeedbacksForAdmin();
        } else {
            feedbacks = feedbackService.getFeedbacksByUserType(usertype);
        }

        return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }


}
