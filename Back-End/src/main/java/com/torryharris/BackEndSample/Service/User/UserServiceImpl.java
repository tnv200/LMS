package com.torryharris.BackEndSample.Service.User;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.torryharris.BackEndSample.Service.User.UserService;
import com.torryharris.BackEndSample.Entity.User; // Import the correct User class
import com.torryharris.BackEndSample.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    @Override
    public User authenticateUser(String emailid, String password) {
        return userRepository.findByEmailidAndPassword( emailid, password);
    }

    @Override
    public void addUser(User user) {
        userRepository.save(user);
    }

    @Override
    public boolean isUserExists(String emailid, Integer userId) {
        return userRepository.existsByEmailidOrUserid(emailid, userId);
    }


	@Override
	public void editUser(User existingUser) {
		userRepository.save(existingUser);
		
	}

	@Override
	public User getUserById(Integer userId) {
		return userRepository.findById(userId).orElse(null);
	}

	@Override
    public void deleteUserById(Integer userId) {
        userRepository.deleteById(userId);
    }

	@Override
	public List<User> getAllUsers() {
		 return userRepository.findAll();
	}
	@Override
	public void updateUser(Integer userId, User updatedUser) {
		User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        // Update only non-null fields
        if (updatedUser.getEmailid() != null) {
            existingUser.setEmailid(updatedUser.getEmailid());
        }
        if (updatedUser.getPassword() != null) {
            existingUser.setPassword(updatedUser.getPassword());
        }
        if (updatedUser.getUsername() != null) {
            existingUser.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getUsertype() != null) {
            existingUser.setUsertype(updatedUser.getUsertype());
        }

        userRepository.save(existingUser);
		
	}

	@Override
	public User getByUserEmail(String email) {
	    return userRepository.findByEmailid(email);
	}

	@Override
	public List<User> getAllByUserName(String userName) {
	    return userRepository.findAllByUsername(userName);
	}

	@Override
    public void saveOrUpdateUser(User user) {
        userRepository.save(user);
    }

    @Override
    public List<User> getUsersByUserType(String userType) {
        return userRepository.findByUsertype(userType);
    }
    

    @Override
    public void disableUser(Integer userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEnabled(false);
            userRepository.save(user);
        }
    }
    
    @Override
    public void enableUser(Integer userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEnabled(true);
            userRepository.save(user);
        }
    }

}

