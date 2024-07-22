package com.torryharris.BackEndSample.Service.User;
import java.util.List;

import com.torryharris.BackEndSample.Entity.User;

public interface UserService {
    User authenticateUser(String emailId, String password);
    // Add other service methods as needed
	void addUser(User user);
	boolean isUserExists(String emailId, Integer userId);
	void editUser(User existingUser);
	void deleteUserById(Integer userId);
    User getUserById(Integer userId);
  
    List<User> getAllUsers();
	void updateUser(Integer userId, User updatedUser);
	User getByUserEmail(String email);
	List<User> getAllByUserName(String userName);
	void saveOrUpdateUser(User user);
	void enableUser(Integer userId);
	void disableUser(Integer userId);
	List<User> getUsersByUserType(String userType);
	
}

