package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.exception.LocationNotFoundException;
import com.sebastianportal.warehouseservice.model.Location;
import com.sebastianportal.warehouseservice.service.LocationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location, HttpServletRequest request) {
        String username = tokenProvider.getUserIdFromJWT(request.getHeader("Authorization").substring(7));
        Location createdLocation = locationService.createLocation(location, username);
        return new ResponseEntity<>(createdLocation, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<Location>> getAllLocations(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortDirection", defaultValue = "ASC") String sortDirection,
            @RequestParam(value = "sort", defaultValue = "locationId") String sort) {

        Page<Location> locations = locationService.findAllLocations(page, size, sortDirection, sort);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable Integer id, @RequestBody Location location, HttpServletRequest request) {
        String username = tokenProvider.getUserIdFromJWT(request.getHeader("Authorization").substring(7));
        try {
            Location updatedLocation = locationService.updateLocation(id, location, username);
            return new ResponseEntity<>(updatedLocation, HttpStatus.OK);
        } catch (LocationNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteLocation(@PathVariable Integer id, HttpServletRequest request) {
        String username = tokenProvider.getUserIdFromJWT(request.getHeader("Authorization").substring(7));
        try {
            locationService.deleteLocation(id, username);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (LocationNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Integer id) {
        return locationService.getLocationById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
