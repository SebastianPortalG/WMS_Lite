package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DispatchEndDto {
    private String remissionGuide;
    private String description;
    private List<BatchCreationDto> leftoverBatches;
}