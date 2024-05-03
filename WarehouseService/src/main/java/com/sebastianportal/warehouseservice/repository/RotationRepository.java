package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Rotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RotationRepository extends JpaRepository<Rotation, Integer> {
}