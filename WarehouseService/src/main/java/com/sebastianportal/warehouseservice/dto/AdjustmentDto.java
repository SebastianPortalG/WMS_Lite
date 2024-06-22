package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AdjustmentDto {
    private Integer comparisonOpId;
    private String reason;
    private String comment;
    private List<StorageDto> storages;
}
