package com.sebastianportal.warehouseservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InventoryRequest{
    private int inventoryMasterId;
    private int locationId;
    private List<ProductQuantity> products;

    @Getter
    @Setter
    public static class ProductQuantity {
        private int productId;
        private int quantity;
    }
}
