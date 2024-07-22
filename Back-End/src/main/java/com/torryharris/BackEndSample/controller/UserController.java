package com.torryharris.BackEndSample.controller;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.torryharris.BackEndSample.Smtp_Mail;
import com.torryharris.BackEndSample.Entity.User;
import com.torryharris.BackEndSample.Service.User.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

        private final Map<String, String> emailToOtpMap = new HashMap<>();

        @Autowired
        private Smtp_Mail smtpMail;

        @Autowired
		public UserService userService;

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        try {
            User user = userService.getByUserEmail(email);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/updatePassword")
        public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> requestBody) {
            try {
                String email = requestBody.get("email");
                String currentPassword = requestBody.get("currentPassword");
                String newPassword = requestBody.get("newPassword");

                User user = userService.getByUserEmail(email);

                if (user != null && user.getPassword().equals(currentPassword)) {
                    // Update user password in the database
                    user.setPassword(newPassword);
                    userService.saveOrUpdateUser(user);

                    return ResponseEntity.ok("Password updated successfully");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email or current password");
                }
            } catch (Exception e) {
                // Log the exception
                e.printStackTrace(); // or use a logging framework like SLF4J
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
            }
        }
    @GetMapping("/usertype/{usertype}")
    public ResponseEntity<List<User>> getUsersByUserType(@PathVariable String usertype) {
        List<User> users = userService.getUsersByUserType(usertype);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
            @GetMapping("/otp/{email}")
            public ResponseEntity<String> sendEmail(@PathVariable String email) {
                try {
                    // Generate OTP regardless of whether the user exists
                    String generatedOTP = smtpMail.sendOTPService(email);

                    // Store the OTP in a map with the email as the key
                    emailToOtpMap.put(email, generatedOTP);

                    return ResponseEntity.ok("OTP sent successfully");
                } catch (Exception e) {
                    // Log the exception
                    e.printStackTrace(); // or use a logging framework like SLF4J
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
                }
            }

    @PostMapping("/verifyOtp/{email}")
        public ResponseEntity<String> verifyOtp(@PathVariable String email, @RequestBody Map<String, String> requestBody) {
            try {
                User user = userService.getByUserEmail(email);

                if (user != null) {
                    // Retrieve the stored OTP from the map
                    String storedOtp = emailToOtpMap.get(email);

                    // Log the values for troubleshooting
                    System.out.println("Stored OTP: " + storedOtp);
                    System.out.println("Received OTP: " + requestBody.get("otp"));

                    if (storedOtp != null && storedOtp.equals(requestBody.get("otp"))) {
                        // OTP is valid, generate a new password
                        String newPassword = generateRandomPassword();
                        smtpMail.sendNewPasswordService(email, newPassword);

                        // Update user password in the database
                        user.setPassword(newPassword);
                        userService.saveOrUpdateUser(user);

                        // Remove the OTP from the map after successful verification
                        emailToOtpMap.remove(email);

                        return ResponseEntity.ok("Password updated successfully");
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with this email does not exist");
                }
            } catch (Exception e) {
                // Log the exception
                e.printStackTrace(); // or use a logging framework like SLF4J
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
            }
        }

        private String generateRandomPassword() {
            // Generate a random password logic (similar to the previous example)
            SecureRandom random = new SecureRandom();
            String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
            StringBuilder newPassword = new StringBuilder(12);

            for (int i = 0; i < 6; i++) {
                newPassword.append(characters.charAt(random.nextInt(characters.length())));
            }

            return newPassword.toString();
        }
        
        @PostMapping("/sendCredentials")
        public ResponseEntity<String> sendCredentials(@RequestBody Map<String, Integer> requestData) {
        	
            try {
            	Integer userId = requestData.get("userId");
                User user = userService.getUserById(userId);
                if (user == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }	
                
                smtpMail.sendPasswordService(user.getEmailid(), user.getPassword());

                return ResponseEntity.ok("Credentials sent successfully to: " + user.getEmailid());
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
            }
        }

        @PostMapping("/sendCredentialsToCandidates")
        public ResponseEntity<String> sendCredentialsToCandidates() {
            try {
                List<User> candidateUsers = userService.getUsersByUserType("candidate");
                
                for (User user : candidateUsers) {
                    smtpMail.sendPasswordService(user.getEmailid(), user.getPassword());
                }

                return ResponseEntity.ok("Credentials sent to all candidate users");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
            }
        }
    }

// Create a class for OTP verification request
class OTPVerificationRequest {
    private String email;
    private String otp;
    private Integer userid;

    public OTPVerificationRequest(Integer userid) {
		super();
		this.userid = userid;
	}

	public Integer getUserid() {	
		return userid;
	}

	public void setUserid(Integer userid) {
		this.userid = userid;
	}

	public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    @Override
    public String toString() {
        return "OTPVerificationRequest [userid =" + userid + "email=" + email + ", otp=" + otp + "]";
    }

    public OTPVerificationRequest(String email, String otp) {
        super();
        this.email = email;
        this.otp = otp;
    }

    public OTPVerificationRequest() {
        super();
    }

    // Getters and setters...
}
