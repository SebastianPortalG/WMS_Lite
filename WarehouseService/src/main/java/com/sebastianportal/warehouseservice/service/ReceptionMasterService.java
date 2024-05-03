package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.dto.BatchCreationDto;
import com.sebastianportal.warehouseservice.exception.ProductNotFoundException;
import com.sebastianportal.warehouseservice.exception.ReceptionNotFoundException;
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
import java.util.*;

@Service
public class ReceptionMasterService {

    @Autowired
    private ReceptionMasterRepository receptionMasterRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private ProductService productService;

    public void finishReceptionProcess(Integer receptionMasterId) {
        ReceptionMaster receptionMaster = receptionMasterRepository.findById(receptionMasterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reception not found"));
        receptionMaster.setProcessFinished(true);
        receptionMasterRepository.save(receptionMaster);
    }

    public ReceptionMaster findById(Integer receptionMasterId) throws ReceptionNotFoundException {
        return receptionMasterRepository.findById(receptionMasterId)
                .orElseThrow(() -> new ReceptionNotFoundException("ReceptionMaster not found with id: " + receptionMasterId));
    }

    public boolean getReceptionMastersByProcessFinished(boolean processFinished) {
        var list = receptionMasterRepository.findByProcessFinished(processFinished);
        return !list.isEmpty();
    }

    @Transactional
    public ReceptionMaster startReceptionWithBatches(User user, List<BatchCreationDto> batchCreationDtos, LocalDateTime receptionDate) throws ProductNotFoundException {
        ReceptionMaster receptionMaster = new ReceptionMaster();
        receptionMaster.setUser(user);
        receptionMaster.setReceptionDate(receptionDate);
        receptionMaster.setProcessFinished(false);
        receptionMaster = receptionMasterRepository.save(receptionMaster);
        Set<Batch> batches = new HashSet<>();
        for (BatchCreationDto dto : batchCreationDtos) {
            Product product = productService.findProductById(dto.getProductId());
            Batch batch = new Batch(product, receptionMaster, user, dto.getQuantity());
            if(product.isExpires()) {
                batch.setExpiryDate(dto.getExpiryDate());
                batch.generateBatchCode();
            } else {
                Optional<Batch> existingBatch = batchRepository.findTopByItemAndItemExpiresIsFalse(product);
                if (existingBatch.isPresent()) {
                    batch = existingBatch.get();
                    batch.setQuantity(batch.getQuantity() + dto.getQuantity());
                    batch.setAvailableQuantity(batch.getAvailableQuantity() + dto.getQuantity());
                }
            }
            batches.add(batch);
        }

        batchRepository.saveAll(batches);

        return receptionMaster;
    }


    public List<ReceptionMaster> findActiveReceptions() {
        return receptionMasterRepository.findByProcessFinished(false);
    }
}