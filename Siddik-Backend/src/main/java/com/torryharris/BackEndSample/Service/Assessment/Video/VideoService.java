package com.torryharris.BackEndSample.Service.Assessment.Video;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.torryharris.BackEndSample.Entity.Video;
import com.torryharris.BackEndSample.Repository.VideoRepository;

@Service
public class VideoService {
	
	@Autowired
	private VideoRepository  videorepo;
	
	public void addrecord(Video vd)
	{
//		if(vd.getUserid()!=null)
//		System.out.println(vd.getDuration());
			
		//else	
		
		vd.setDuration(0);
		videorepo.save(vd);
		
	}
	
	public void updaterecord(Video vd)
	{
		Video newvd=videorepo.findSnoByUseridAndUrl(vd.getUserid(),vd.getUrl());

		if (newvd != null) {
			if (newvd.getDuration() < vd.getDuration()) {
				newvd.setDuration(vd.getDuration());
				videorepo.save(newvd);
			}
		} else {
			videorepo.save(vd);
		}

		
	}
	
	public Map<String, Integer> getDuration(Integer userid){
		List<Video> result = videorepo.findAllByUserid(userid);
		Map<String, Integer> videoData = result.stream()
			    .collect(Collectors.toMap(Video::getUrl, Video::getDuration));
		return videoData;
	}
}
