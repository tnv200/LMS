package com.torryharris.BackEndSample.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.torryharris.BackEndSample.Entity.Video;

public interface VideoRepository extends JpaRepository<Video, Integer>{
	
	Video findByUserid(int userid);
	Video findSnoByUseridAndUrl(int userid, String url);
	Optional<Video> findOptionalByUseridAndUrl(int userid, String url);
	List<Video> findAllByUserid(int userid);
}
