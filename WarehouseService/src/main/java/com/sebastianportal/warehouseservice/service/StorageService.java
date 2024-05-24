package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.dto.*;
import com.sebastianportal.warehouseservice.model.*;
import com.sebastianportal.warehouseservice.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
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
    @Autowired
    private DispatchDetailRepository dispatchDetailRepository;

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
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new EntityNotFoundException("Batch not found with id: " + batchId));
        if (storage.getStoredQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stored quantity.");
        }

        batch.setDispatchedQuantity(batch.getDispatchedQuantity() + quantity);
        batch.setStoredQuantity(batch.getStoredQuantity() - quantity);
        batchRepository.save(batch);
        storage.setStoredQuantity(storage.getStoredQuantity() - quantity);
        if (storage.getStoredQuantity() == 0) {
            storageRepository.delete(storage);
        } else {
            storageRepository.save(storage);
        }
    }
    public List<StorageListDto> searchStorages(String code, String product, String status, String classification, String groupBy, boolean orderByExpiryDate) {
        List<Storage> storages = storageRepository.searchStorages(code, product, status, classification, orderByExpiryDate);
        return storages.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<KardexDto> getKardexByProductId(int productId) {
        List<Batch> batches = batchRepository.findByItem_ProductId(productId);
        List<Integer> batchIds = batches.stream().map(Batch::getBatchId).toList();
        List<ReceptionMaster> receptions = receptionMasterRepository.findByBatches_BatchIdIn(batchIds);
        List<DispatchDetail> dispatchDetails = dispatchDetailRepository.findByBatch_BatchIdIn(batchIds);
        List<Storage> storages = storageRepository.findByProductIdOrderByExpiryDate(productId);

        // Aggregate data
        return aggregateKardexData(storages, receptions, dispatchDetails, productId);
    }
    public List<KardexDto> getKardexForWarehouse() {
        List<Storage> storages = storageRepository.findAll();
        List<ReceptionMaster> receptions = receptionMasterRepository.findAll();
        List<DispatchDetail> dispatchDetails = dispatchDetailRepository.findAll();

        // Aggregate data
        return aggregateKardexData(storages, receptions, dispatchDetails, 0);
    }


    private StorageListDto convertToDto(Storage storage) {
        LocationDto locationDto = new LocationDto();
        locationDto.setLocationId(storage.getLocation().getLocationId());
        locationDto.setZone(storage.getLocation().getZone());
        locationDto.setAisle(storage.getLocation().getAisle());
        locationDto.setShelf(storage.getLocation().getShelf());

        ProductDto productDto = new ProductDto();
        productDto.setProductId(storage.getBatch().getItem().getProductId());
        productDto.setName(storage.getBatch().getItem().getName());
        productDto.setDescription(storage.getBatch().getItem().getDescription());
        productDto.setActive(storage.getBatch().getItem().isActive());
        productDto.setCategory(storage.getBatch().getItem().getCategory().getName());
        productDto.setExpires(storage.getBatch().getItem().isExpires());
        productDto.setConsumable(storage.getBatch().getItem().isConsumable());
        productDto.setRotation(storage.getBatch().getItem().getRotation().getRotacion());

        BatchDto batchDto = new BatchDto();
        batchDto.setCode(storage.getBatch().getCode());
        batchDto.setExpiryDate(storage.getBatch().getExpiryDate());

        StorageListDto storageListDto = new StorageListDto();
        storageListDto.setStorageId(storage.getStorageId());
        storageListDto.setLocation(locationDto);
        storageListDto.setProduct(productDto);
        storageListDto.setBatch(batchDto);
        storageListDto.setStoredQuantity(storage.getStoredQuantity());
        storageListDto.setStoredDateTime(storage.getStoredDateTime());

        return storageListDto;
    }
    private List<KardexDto> aggregateKardexData(List<Storage> storages, List<ReceptionMaster> receptions, List<DispatchDetail> dispatchDetails, int productId) {
        List<KardexDto> kardexList = new ArrayList<>();
        int totalQuantityStored = storages.stream().mapToInt(Storage::getStoredQuantity).sum();

        // Add total quantity stored entry
        KardexDto totalDto = new KardexDto();
        totalDto.setType("Total");
        totalDto.setQuantity(totalQuantityStored);


        for (ReceptionMaster reception : receptions) {
            for (Batch batch : reception.getBatches()) {
                if (productId == 0 || batch.getItem().getProductId() == productId) {
                    KardexDto dto = new KardexDto();
                    dto.setType("Recepcion");
                    dto.setCode(batch.getCode());
                    dto.setDate(reception.getReceptionDate().toString());
                    dto.setQuantity(batch.getQuantity());
                    dto.setExpiryDate(batch.getExpiryDate().toString());
                    kardexList.add(dto);
                }
            }
        }

        for (DispatchDetail dispatchDetail : dispatchDetails) {
            if (productId == 0 || dispatchDetail.getBatch().getItem().getProductId() == productId) {
                KardexDto dto = new KardexDto();
                dto.setType("Despacho");
                dto.setCode(dispatchDetail.getBatch().getCode());
                dto.setDate(dispatchDetail.getDispatchMaster().getCreatedDateTime().toString());
                dto.setQuantity(-dispatchDetail.getQuantity());
                dto.setExpiryDate(dispatchDetail.getBatch().getExpiryDate().toString());
                kardexList.add(dto);
            }
        }
        kardexList.sort(Comparator.comparing(KardexDto::getDate));
        kardexList.add(totalDto);
        return kardexList;
    }

}