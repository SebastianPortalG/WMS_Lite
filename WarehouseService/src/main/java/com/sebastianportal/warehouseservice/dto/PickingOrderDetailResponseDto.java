package com.sebastianportal.warehouseservice.dto;

import com.sebastianportal.warehouseservice.model.Product;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PickingOrderDetailResponseDto {

    private Product product;
    private Integer quantity;
    private Integer pickedQuantity;
    private Integer remainingQuantity;
}
