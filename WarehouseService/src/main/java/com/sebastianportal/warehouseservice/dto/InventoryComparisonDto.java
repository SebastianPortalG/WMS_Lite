package com.sebastianportal.warehouseservice.dto;

import com.sebastianportal.warehouseservice.model.InventoryComparison;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryComparisonDto {
    private Integer inventoryOpId;
    private String productCode;
    private String location;
    private Integer inventoryQuantity;
    private Integer storageQuantity;
    private Integer difference;
    private List<StorageDto> storages;
}