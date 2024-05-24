package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class InventoryMasterRequest {
    private String description;
    private LocalDate inventoryDate;

}