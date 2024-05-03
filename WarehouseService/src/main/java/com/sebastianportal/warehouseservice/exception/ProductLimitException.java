package com.sebastianportal.warehouseservice.exception;

public class ProductLimitException extends Exception {
    public ProductLimitException(String message) {
        super(message);
    }
}