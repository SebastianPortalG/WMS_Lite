package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryMasterRequestEnd {
    private String description;
    private boolean inventoryFinished;
}
