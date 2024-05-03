package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {

}
