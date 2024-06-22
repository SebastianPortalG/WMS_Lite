package com.sebastianportal.warehouseservice.repository;

import com.sebastianportal.warehouseservice.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {
    @Query("SELECT l FROM Location l WHERE l.zone = :zone AND l.aisle = :aisle AND l.shelf = :shelf")
    Location findByZoneAndAisleAndShelf(@Param("zone") String zone, @Param("aisle") String aisle, @Param("shelf") String shelf);
}
