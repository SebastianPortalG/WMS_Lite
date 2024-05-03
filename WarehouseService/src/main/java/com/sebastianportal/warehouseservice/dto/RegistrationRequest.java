package com.sebastianportal.warehouseservice.dto;

import com.sebastianportal.warehouseservice.model.Role;
import lombok.Data;

@Data
public class RegistrationRequest {
    private String username;
    private String password;
    private String roleName;
}