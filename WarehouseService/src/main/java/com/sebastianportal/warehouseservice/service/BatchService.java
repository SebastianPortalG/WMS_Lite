package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.dto.SimpleBatchResponseDto;
import com.sebastianportal.warehouseservice.model.Batch;
import com.sebastianportal.warehouseservice.repository.BatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    public List<SimpleBatchResponseDto> findAvailableBatchesByReceptionMaster(Integer receptionMasterId) {
        return batchRepository.findByReceptionMaster_ReceptionMasterIdAndAvailableQuantityGreaterThan(receptionMasterId, 0)
                .stream()
                .map(batch -> new SimpleBatchResponseDto(batch.getBatchId(), batch.getCode(), batch.getItem().getName(), batch.getAvailableQuantity(), batch.getExpiryDate()))
                .collect(Collectors.toList());
    }
}