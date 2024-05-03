package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.model.Role;
import com.sebastianportal.warehouseservice.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}