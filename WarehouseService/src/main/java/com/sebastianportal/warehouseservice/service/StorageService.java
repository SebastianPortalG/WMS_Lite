package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.model.*;
import com.sebastianportal.warehouseservice.repository.BatchRepository;
import com.sebastianportal.warehouseservice.repository.LocationRepository;
import com.sebastianportal.warehouseservice.repository.ReceptionMasterRepository;
import com.sebastianportal.warehouseservice.repository.StorageRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class StorageService {

    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ReceptionMasterRepository receptionMasterRepository;

    @Transactional
    public Storage storeBatchInLocationReception(Integer batchId, Integer locationId, Integer quantity, User user) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new EntityNotFoundException("Batch not found with id: " + batchId));
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + locationId));

        if (batch.getAvailableQuantity() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient available quantity for batch.");
        }

        batch.setAvailableQuantity(batch.getAvailableQuantity() - quantity);
        batch.setStoredQuantity(batch.getStoredQuantity() + quantity);
        batchRepository.save(batch);

        Storage storage = new Storage();
        storage.setBatch(batch);
        storage.setLocation(location);
        storage.setStoredQuantity(quantity);
        storage.setStoredDateTime(LocalDateTime.now());
        storage.setCreatedBy(user.getUsername());
        storage=storageRepository.save(storage);
        updateReceptionMasterIfFinished(batch.getReceptionMaster());

        return storage;
    }
    private void updateReceptionMasterIfFinished(ReceptionMaster receptionMaster) {
        boolean allStored = receptionMaster.getBatches().stream()
                .allMatch(batch -> batch.getAvailableQuantity() == 0);

        if (allStored) {
            receptionMaster.setProcessFinished(true);
            receptionMasterRepository.save(receptionMaster);
        }
    }
}