package com.sebastianportal.warehouseservice.dto;

import com.sebastianportal.warehouseservice.model.Location;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class StorageDto {
    private Location location;
    private SimpleBatchResponseDto batch;
    private Integer storedQuantity;
}