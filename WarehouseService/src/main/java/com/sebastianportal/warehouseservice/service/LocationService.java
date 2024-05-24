package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.exception.LocationNotFoundException;
import com.sebastianportal.warehouseservice.model.Location;
import com.sebastianportal.warehouseservice.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LocationService {
    @Autowired
    private LocationRepository locationRepository;

    public Location createLocation(Location location, String username) {
        location.setCreatedBy(username);
        return locationRepository.save(location);
    }

    public Page<Location> findAllLocations(int page, int size, String sortDirection, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(sortDirection), sort);
        return locationRepository.findAll(pageable);
    }

    public Location updateLocation(Integer id, Location locationDetails, String username) throws LocationNotFoundException {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new LocationNotFoundException("Location not found with id: " + id));

        location.setZone(locationDetails.getZone());
        location.setAisle(locationDetails.getAisle());
        location.setShelf(locationDetails.getShelf());
        location.setCapacity(locationDetails.getCapacity());

        location.setModifiedBy(username);
        return locationRepository.save(location);
    }

    public void deleteLocation(Integer id, String username) throws LocationNotFoundException {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new LocationNotFoundException("Location not found with id: " + id));
        location.setModifiedBy(username);
        location.setModifiedDateTime(LocalDateTime.now());

        locationRepository.delete(location);
    }
    public Optional<Location> getLocationById(Integer id) {
        return locationRepository.findById(id);
    }
}
