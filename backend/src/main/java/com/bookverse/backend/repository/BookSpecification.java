package com.bookverse.backend.repository;

import com.bookverse.backend.entity.Book;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

public class BookSpecification {

    public static Specification<Book> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) {
                return null;
            }
            String searchPattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), searchPattern),
                    cb.like(cb.lower(root.get("subtitle")), searchPattern),
                    cb.like(cb.lower(root.get("description")), searchPattern),
                    cb.like(cb.lower(root.get("isbn")), searchPattern),
                    cb.like(cb.lower(root.get("author").get("name")), searchPattern),
                    cb.like(cb.lower(root.get("publisher").get("name")), searchPattern),
                    cb.like(cb.lower(root.get("category").get("name")), searchPattern)
            );
        };
    }

    public static Specification<Book> hasCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null ? null : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Book> hasAuthor(Long authorId) {
        return (root, query, cb) -> authorId == null ? null : cb.equal(root.get("author").get("id"), authorId);
    }

    public static Specification<Book> hasPublisher(Long publisherId) {
        return (root, query, cb) -> publisherId == null ? null : cb.equal(root.get("publisher").get("id"), publisherId);
    }

    public static Specification<Book> hasLanguage(String language) {
        return (root, query, cb) -> !StringUtils.hasText(language) ? null : cb.equal(root.get("language"), language);
    }

    public static Specification<Book> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice != null && maxPrice != null) {
                return cb.between(root.get("price"), minPrice, maxPrice);
            } else if (minPrice != null) {
                return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            } else if (maxPrice != null) {
                return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
            }
            return null;
        };
    }

    public static Specification<Book> isAvailable() {
        return (root, query, cb) -> cb.greaterThan(root.get("stock"), 0);
    }

    public static Specification<Book> hasDiscount() {
        return (root, query, cb) -> cb.greaterThan(root.get("discountPercentage"), 0);
    }
}
