package com.torryharris.BackEndSample.controller;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.torryharris.BackEndSample.Entity.Video;
import com.torryharris.BackEndSample.Repository.VideoRepository;
import com.torryharris.BackEndSample.Service.Assessment.Video.VideoService;

@RestController
@RequestMapping("/video")
public class VideoController {
	
	@Autowired
	private VideoService videoservice;
	
	@Autowired
	private VideoRepository  videorepo;
	
	@PostMapping("/createrecord")
	public ResponseEntity<String> createrecord(@RequestBody Video vd
			                                   
			                                   )
	{
		
		Optional<Video> vd1=videorepo.findOptionalByUseridAndUrl(vd.getUserid(),vd.getUrl());
		
		Video vd2=vd1.orElse(vd);
		if(vd1.isPresent())
		{
			//videoservice.updaterecord(vd);
			return new ResponseEntity<>("Ok : " + vd2.getDuration(),
		              HttpStatus.CREATED);
		}
	  //vd.setUserid(userid);
	  //vd.setUrl(url);
		else
      videoservice.addrecord(vd);
      //System.out.println("");
      
      return new ResponseEntity<>("Record createdcwith ID: " + vd.getUserid(),
              HttpStatus.CREATED);
		
	}
	
	@PutMapping("/update")
    public ResponseEntity<String> updateAssessment(@RequestBody Video vd) {
		
		videoservice.updaterecord(vd);
        return new ResponseEntity<>("Record updated with ID: " + vd.getUserid(), HttpStatus.OK);
        
    }
	
	@GetMapping("/duration/{userid}")
	public ResponseEntity<?> getDuration(@PathVariable Integer userid){
		return ResponseEntity.ok(videoservice.getDuration(userid));
	}
	
}
