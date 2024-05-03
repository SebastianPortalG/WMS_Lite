package com.sebastianportal.warehouseservice.service;


import com.sebastianportal.warehouseservice.dto.RegistrationRequest;
import com.sebastianportal.warehouseservice.model.Role;
import com.sebastianportal.warehouseservice.model.User;
import com.sebastianportal.warehouseservice.repository.RoleRepository;
import com.sebastianportal.warehouseservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    public User registerNewUser(RegistrationRequest registrationRequest) {
        User newUser = new User();
        newUser.setUsername(registrationRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        Role userRole = roleRepository.findByRoleName(registrationRequest.getRoleName())
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        newUser.setRole(userRole);
        return userRepository.save(newUser);
    }

    public User findByUsername(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
}