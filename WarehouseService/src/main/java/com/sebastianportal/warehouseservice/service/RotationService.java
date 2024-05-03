package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.model.Rotation;
import com.sebastianportal.warehouseservice.repository.RotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RotationService {

    @Autowired
    private RotationRepository rotationRepository;

    public List<Rotation> getAllRotations() {
        return rotationRepository.findAll();
    }
}