package com.sebastianportal.warehouseservice.dto;

import com.sebastianportal.warehouseservice.model.Location;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StorageDto {
    private Location location;
    private SimpleBatchResponseDto batch;
    private Integer storedQuantity;
}