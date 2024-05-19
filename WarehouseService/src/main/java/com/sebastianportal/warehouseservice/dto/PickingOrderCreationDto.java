package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class PickingOrderCreationDto {
    private String description;
    public List<PickingOrderDetailDto> details;
}

