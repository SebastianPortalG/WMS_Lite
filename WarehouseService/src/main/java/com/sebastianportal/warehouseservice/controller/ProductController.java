package com.sebastianportal.warehouseservice.controller;

import com.sebastianportal.warehouseservice.config.JwtTokenProvider;
import com.sebastianportal.warehouseservice.dto.ProductDto;
import com.sebastianportal.warehouseservice.exception.ProductLimitException;
import com.sebastianportal.warehouseservice.exception.ProductNotFoundException;
import com.sebastianportal.warehouseservice.model.Product;
import com.sebastianportal.warehouseservice.repository.ProductRepository;
import com.sebastianportal.warehouseservice.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            String username = tokenProvider.getUserIdFromJWT(token);
            product.setCreatedBy(username);

            Product createdProduct = productService.createProduct(product);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (ProductLimitException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", defaultValue = "") String search,
            @RequestParam(value = "sortDirection", defaultValue = "ASC") String sortDirection,
            @RequestParam(value = "sort", defaultValue = "name") String sort) {

        Page<Product> productPage = productService.findAllProducts(page, size, search, sortDirection, sort);
        return new ResponseEntity<>(productPage, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody Product productDetails, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            String username = tokenProvider.getUserIdFromJWT(token);

            Product updatedProduct = productService.updateProduct(id, productDetails, username);
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        } catch (ProductNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            String username = tokenProvider.getUserIdFromJWT(token);

            productService.deleteProduct(id, username);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ProductNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred during the deletion process", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable int productId) throws ProductNotFoundException {
        Product product = productService.findProductById(productId);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
