package com.sebastianportal.warehouseservice.service;

import com.sebastianportal.warehouseservice.exception.ProductLimitException;
import com.sebastianportal.warehouseservice.exception.ProductNotFoundException;
import com.sebastianportal.warehouseservice.model.Product;
import com.sebastianportal.warehouseservice.model.ProductCategory;
import com.sebastianportal.warehouseservice.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryService productCategoryService;
    @Transactional
    public Product createProduct(Product product) throws ProductLimitException {
        if (productRepository.countActiveProducts() >= 300) {
            throw new ProductLimitException("Maximum product limit reached.");
        }

        ProductCategory category = productCategoryService.findOrCreateCategory(product.getCategory());
        product.setCategory(category);

        if (!product.isExpires()) {
            // TODO: handle non-expiring products by creating a unique batch
        }
        product.setActive(true);
        return productRepository.save(product);
    }
    @Transactional
    public Product updateProduct(Integer id, Product productDetails, String username) throws ProductNotFoundException {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        ProductCategory category = productCategoryService.findOrCreateCategory(product.getCategory());
        product.setCategory(category);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setActive(productDetails.isActive());
        product.setCategory(productDetails.getCategory());
        product.setRotation(productDetails.getRotation());
        product.setConsumable(productDetails.isConsumable());
        product.setExpires(productDetails.isExpires());
        product.setModifiedBy(username);

        return productRepository.save(product);
    }

    public void deleteProduct(Integer id, String username) throws ProductNotFoundException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        product.setDeleted(true);
        product.setModifiedBy(username);
        productRepository.save(product);
    }

    public Page<Product> findAllProducts(int page, int size, String search, String sortDirection, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(sortDirection), sort);
        if (search == null || search.trim().isEmpty()) {
            return productRepository.findByDeletedFalse(pageable);
        } else {
            return productRepository.findAllBySearch(search, pageable);
        }
    }

    public Product findProductById(Integer productId) throws ProductNotFoundException {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));
    }

}
