package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.ReceptionMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceptionMasterRepository extends JpaRepository<ReceptionMaster, Integer> {
    List<ReceptionMaster> findByProcessFinished(boolean processFinished);

}
