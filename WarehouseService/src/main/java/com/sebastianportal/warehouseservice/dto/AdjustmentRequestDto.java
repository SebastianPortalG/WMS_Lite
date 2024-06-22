package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdjustmentRequestDto {
    private Integer comparisonOpId;
    private boolean approvalStatus;
    private String reason;
    private String comment;
}