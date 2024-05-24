package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class StorageListDto {
    private Integer storageId;
    private LocationDto location;
    private ProductDto product;
    private BatchDto batch;
    private Integer storedQuantity;
    private LocalDateTime storedDateTime;
}
