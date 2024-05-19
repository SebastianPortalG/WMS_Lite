package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.dto.SimpleBatchResponseDto;
import com.sebastianportal.warehouseservice.dto.StorageDto;
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
import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional
    public Storage moveBatch(Integer batchId, Integer sourceLocationId, Integer targetLocationId, Integer quantity, User user) {
        Storage sourceStorage = storageRepository.findByBatch_BatchIdAndLocation_LocationId(batchId, sourceLocationId)
                .orElseThrow(() -> new EntityNotFoundException("Storage not found for specified batch and location"));

        Location location = locationRepository.findById(targetLocationId)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + targetLocationId));

        if (sourceStorage.getStoredQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient quantity available for movement.");
        }
        //TODO: partir en dos endpoints xd
        sourceStorage.setStoredQuantity(sourceStorage.getStoredQuantity() - quantity);
        storageRepository.save(sourceStorage);

        Storage targetStorage = storageRepository.findByBatch_BatchIdAndLocation_LocationId(batchId, targetLocationId)
                .orElseGet(() -> {
                    Storage newStorage = new Storage();
                    newStorage.setBatch(batchRepository.findById(batchId).get());
                    newStorage.setLocation(location); // This assumes Location entity setup to handle this.
                    newStorage.setStoredQuantity(0); // Initially zero, will be set below
                    return newStorage;
                });

        targetStorage.setStoredQuantity(targetStorage.getStoredQuantity() + quantity);
        targetStorage.setStoredDateTime(LocalDateTime.now());
        targetStorage.setCreatedBy(user.getUsername());
        storageRepository.save(targetStorage);

        // If the source storage is now empty, remove it.
        if (sourceStorage.getStoredQuantity() == 0) {
            storageRepository.delete(sourceStorage);
        }

        return targetStorage;
    }

    public List<SimpleBatchResponseDto> getBatchesByLocation(Integer locationId) {
        return storageRepository.findByLocation_LocationId_OrderByBatch_ExpiryDate(locationId).stream()
                .map(storage -> new SimpleBatchResponseDto(
                        storage.getBatch().getBatchId(),
                        storage.getBatch().getCode(),
                        storage.getBatch().getItem().getName(),
                        storage.getStoredQuantity(),
                        storage.getBatch().getExpiryDate()
                ))
                .collect(Collectors.toList());
    }

    private void updateReceptionMasterIfFinished(ReceptionMaster receptionMaster) {
        boolean allStored = receptionMaster.getBatches().stream()
                .allMatch(batch -> batch.getAvailableQuantity() == 0);

        if (allStored) {
            receptionMaster.setProcessFinished(true);
            receptionMasterRepository.save(receptionMaster);
        }
    }
    public List<StorageDto> findStoragesByProductId(Integer productId) {
        List<Storage> storages = storageRepository.findByProductIdOrderByExpiryDate(productId);

        return storages.stream().map(storage -> {
            SimpleBatchResponseDto batchDto = new SimpleBatchResponseDto(
                    storage.getBatch().getBatchId(),
                    storage.getBatch().getCode(),
                    storage.getBatch().getItem().getName(),
                    storage.getBatch().getAvailableQuantity(),
                    storage.getBatch().getExpiryDate()
            );
            StorageDto dto = new StorageDto();
            dto.setLocation(storage.getLocation());
            dto.setBatch(batchDto);
            dto.setStoredQuantity(storage.getStoredQuantity());
            return dto;
        }).collect(Collectors.toList());
    }
    @Transactional
    public void updateStorageForDispatch(Integer locationId, Integer batchId, Integer quantity) {
        Storage storage = storageRepository.findByBatch_BatchIdAndLocation_LocationId(batchId, locationId)
                .orElseThrow(() -> new EntityNotFoundException("Storage not found with locationId: " + locationId + " and batchId: " + batchId));

        if (storage.getStoredQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stored quantity.");
        }

        storage.setStoredQuantity(storage.getStoredQuantity() - quantity);
        if (storage.getStoredQuantity() == 0) {
            storageRepository.delete(storage);
        } else {
            storageRepository.save(storage);
        }
    }
}