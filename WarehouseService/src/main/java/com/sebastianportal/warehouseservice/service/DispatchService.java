package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.dto.DispatchEndDto;
import com.sebastianportal.warehouseservice.model.*;
import com.sebastianportal.warehouseservice.repository.DispatchDetailRepository;
import com.sebastianportal.warehouseservice.repository.DispatchMasterRepository;
import com.sebastianportal.warehouseservice.repository.PickingOrderRepository;
import com.sebastianportal.warehouseservice.repository.StorageRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class DispatchService {

    @Autowired
    private DispatchMasterRepository dispatchMasterRepository;

    @Autowired
    private DispatchDetailRepository dispatchDetailRepository;

    @Autowired
    private PickingOrderRepository pickingOrderRepository;
    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private StorageService storageService;
    @Autowired
    private PickingOrderService pickingOrderService;

    public DispatchMaster createDispatchMaster(User user, Integer pickingOrderId) {
        PickingOrder pickingOrder = pickingOrderRepository.findById(pickingOrderId)
                .orElseThrow(() -> new RuntimeException("PickingOrder not found with id: " + pickingOrderId));

        DispatchMaster dispatchMaster = new DispatchMaster();
        dispatchMaster.setUser(user);
        dispatchMaster.setPickingOrder(pickingOrder);
        dispatchMaster.setProcessFinished(false);
        dispatchMaster.setCreatedBy(user.getUsername());

        return dispatchMasterRepository.save(dispatchMaster);
    }
    @Transactional
    public void dispatchPickingOrder(Integer pickingOrderId, Integer batchId, Integer locationId, Integer quantity, User user) {
        Storage storage = storageRepository.findByBatch_BatchIdAndLocation_LocationId(batchId, locationId)
                .orElseThrow(() -> new EntityNotFoundException("Storage not found with locationId: " + locationId + " and batchId: " + batchId));

        storageService.updateStorageForDispatch(locationId, batchId, quantity);
        pickingOrderService.updatePickingOrderForDispatch(pickingOrderId, storage.getBatch().getItem().getProductId(), quantity);

        DispatchDetail dispatchDetail = new DispatchDetail();
        dispatchDetail.setDispatchMaster(dispatchMasterRepository.findByPickingOrder_PickingOrderId(pickingOrderId)
                .orElseThrow(() -> new EntityNotFoundException("DispatchMaster not found with pickingOrderId: " + pickingOrderId)));
        dispatchDetail.setBatch(storage.getBatch());
        dispatchDetail.setLocation(storage.getLocation());
        dispatchDetail.setQuantity(quantity);
        dispatchDetail.setCreatedBy(user.getUsername());
        dispatchDetail.setCreatedDateTime(LocalDateTime.now());

        dispatchDetailRepository.save(dispatchDetail);
    }
    @Transactional
    public DispatchMaster endDispatch(Integer dispatchMasterId, DispatchEndDto updateRequest) {
        DispatchMaster dispatchMaster = dispatchMasterRepository.findById(dispatchMasterId)
                .orElseThrow(() -> new RuntimeException("DispatchMaster not found with id: " + dispatchMasterId));

        dispatchMaster.setRemissionGuide(updateRequest.getRemissionGuide());
        dispatchMaster.setDescription(updateRequest.getDescription());
        dispatchMaster.setProcessFinished(true);

        PickingOrder pickingOrder = dispatchMaster.getPickingOrder();
        if (pickingOrder != null) {
            pickingOrder.setDispatched(true);
            pickingOrderRepository.save(pickingOrder);
        }

        return dispatchMasterRepository.save(dispatchMaster);
    }
}
