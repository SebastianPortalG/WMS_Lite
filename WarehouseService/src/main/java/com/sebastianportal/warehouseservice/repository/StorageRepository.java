package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Storage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StorageRepository extends JpaRepository<Storage, Integer> {

}
