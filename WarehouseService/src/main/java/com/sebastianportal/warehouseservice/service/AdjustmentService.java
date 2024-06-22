package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.dto.AdjustmentDto;
import com.sebastianportal.warehouseservice.dto.AdjustmentRequestDto;
import com.sebastianportal.warehouseservice.model.Adjustment;
import com.sebastianportal.warehouseservice.model.InventoryComparison;
import com.sebastianportal.warehouseservice.model.Storage;
import com.sebastianportal.warehouseservice.repository.AdjustmentRepository;
import com.sebastianportal.warehouseservice.repository.InventoryComparisonRepository;
import com.sebastianportal.warehouseservice.repository.StorageRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdjustmentService {
    @Autowired
    private AdjustmentRepository adjustmentRepository;

    @Autowired
    private InventoryComparisonRepository inventoryComparisonRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private StorageRepository storageRepository;

    @Transactional
    public void requestAdjustment(AdjustmentRequestDto requestDto, String username) {
        InventoryComparison comparison = inventoryComparisonRepository.findById(requestDto.getComparisonOpId())
                .orElseThrow(() -> new EntityNotFoundException("Comparison not found"));

        Adjustment adjustment = new Adjustment();
        adjustment.setInventoryComparison(comparison);
        adjustment.setApprovalStatus(false); // Pendiente de aprobación
        adjustment.setCreatedBy(username);
        adjustment.setModifiedBy(username);
        adjustment.setReason(requestDto.getReason());
        adjustment.setComment(requestDto.getComment());
        adjustmentRepository.save(adjustment);

        // Crear notificación para el administrador
        notificationService.createNotificationForRole("ADMIN", "New adjustment request needs approval");
    }

    @Transactional
    public void approveAdjustment(AdjustmentRequestDto requestDto, String username) {
        Adjustment adjustment = adjustmentRepository.findById(requestDto.getComparisonOpId())
                .orElseThrow(() -> new EntityNotFoundException("Adjustment not found"));

        if (requestDto.isApprovalStatus()) {
            // Aprobar el ajuste y actualizar los almacenamientos
            InventoryComparison comparison = adjustment.getInventoryComparison();
            List<Storage> storages = storageRepository.findByProductIdAndLocationId(
                    comparison.getProduct().getProductId(),
                    comparison.getLocation().getLocationId()
            );

            for (Storage storage : storages) {
                storage.setStoredQuantity(storage.getStoredQuantity() + comparison.getComparedQuantity());
                storage.setModifiedBy(username);
                storageRepository.save(storage);
            }

            adjustment.setApprovalStatus(true);
        } else {
            // Rechazar el ajuste
            adjustment.setApprovalStatus(false);
        }

        adjustment.setModifiedBy(username);
        adjustmentRepository.save(adjustment);

    }
}
