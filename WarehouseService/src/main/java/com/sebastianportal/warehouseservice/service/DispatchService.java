package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.dto.DispatchEndDto;
import com.sebastianportal.warehouseservice.dto.PickingOrderDetailResponseDto;
import com.sebastianportal.warehouseservice.exception.ProductNotFoundException;
import com.sebastianportal.warehouseservice.model.*;
import com.sebastianportal.warehouseservice.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    private PickingOrderDetailRepository pickingOrderDetailRepository;
    @Autowired
    private StorageService storageService;
    @Autowired
    private PickingOrderService pickingOrderService;
    @Autowired
    private ReceptionMasterService receptionMasterService;
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
    public DispatchMaster endDispatch(Integer dispatchMasterId, DispatchEndDto updateRequest, User user) throws ProductNotFoundException {
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

        if (updateRequest.getLeftoverBatches() != null && !updateRequest.getLeftoverBatches().isEmpty()) {
            String receptionDescription = "Reception created for leftover dispatch items from DispatchMaster ID: " + dispatchMasterId;
            receptionMasterService.createReceptionForLeftovers(user, updateRequest.getLeftoverBatches(), receptionDescription);
        }

        return dispatchMasterRepository.save(dispatchMaster);
    }
    @Transactional(readOnly = true)
    public DispatchMaster findDispatchMasterByPickingOrderId(Integer pickingOrderId) {
        return dispatchMasterRepository.findByPickingOrder_PickingOrderId(pickingOrderId)
                .orElseThrow(() -> new EntityNotFoundException("DispatchMaster not found with pickingOrderId: " + pickingOrderId));
    }

    public List<PickingOrderDetailResponseDto> getPickingOrderDetailsByDispatchMasterId(Integer dispatchMasterId) {
//        DispatchMaster dispatchMaster = dispatchMasterRepository.findById(dispatchMasterId)
//                .orElseThrow(() -> new EntityNotFoundException("DispatchMaster not found with id: " + dispatchMasterId));
//
//        PickingOrder pickingOrder = dispatchMaster.getPickingOrder();
//        if (pickingOrder == null) {
//            throw new EntityNotFoundException("PickingOrder not found for DispatchMaster id: " + dispatchMasterId);
//        }
//
//
//        List<PickingOrderDetail> pickingOrderDetails = pickingOrder.getPickingOrderDetails();
        List<PickingOrderDetail> pickingOrderDetails = pickingOrderDetailRepository.findPickingOrderDetailsByDispatchMasterId(dispatchMasterId);
        return pickingOrderDetails.stream()
                .map(detail -> {
                    PickingOrderDetailResponseDto dto = new PickingOrderDetailResponseDto();
                    dto.setProduct(detail.getProduct());
                    dto.setQuantity(detail.getQuantity());
                    dto.setPickedQuantity(detail.getPickedQuantity());
                    dto.setRemainingQuantity(detail.getRemainingQuantity());
                    dto.setReturnedQuantity(detail.getReturnedQuantity());
                    return dto;
                })
                .toList();
    }
}
