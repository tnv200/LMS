package com.torryharris.BackEndSample.Repository;

import com.torryharris.BackEndSample.Entity.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
	User findByEmailidAndPassword(String emailid, String password);
	boolean existsByEmailidOrUserid(String emailid, Integer userId);
    List<User> findAll();
	User findByEmailid(String email);
	List<User> findAllByUsername(String userName);

	List<User> findByUsertype(String usertype);
}