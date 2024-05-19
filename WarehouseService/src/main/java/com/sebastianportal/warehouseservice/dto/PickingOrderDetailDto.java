package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PickingOrderDetailDto {
    private Integer productId;
    private Integer quantity;
}
