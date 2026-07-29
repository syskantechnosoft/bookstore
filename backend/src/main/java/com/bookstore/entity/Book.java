package com.bookstore.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Author is required")
    @Size(max = 255, message = "Author cannot exceed 255 characters")
    @Column(nullable = false)
    private String author;

    @NotBlank(message = "ISBN is required")
    @Size(max = 20, message = "ISBN cannot exceed 20 characters")
    @Column(nullable = false, unique = true, length = 20)
    private String isbn;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be non-negative")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Published year is required")
    @Column(name = "published_year", nullable = false)
    private Integer publishedYear;

    @NotBlank(message = "Genre is required")
    @Size(max = 100, message = "Genre cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String genre;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock must be non-negative")
    @Column(nullable = false)
    private Integer stock;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(length = 1000)
    private String description;

    public Book() {}

    public Book(Long id, String title, String author, String isbn, BigDecimal price, Integer publishedYear, String genre, Integer stock, String description) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.price = price;
        this.publishedYear = publishedYear;
        this.genre = genre;
        this.stock = stock;
        this.description = description;
    }

    public static BookBuilder builder() {
        return new BookBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getPublishedYear() { return publishedYear; }
    public void setPublishedYear(Integer publishedYear) { this.publishedYear = publishedYear; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static class BookBuilder {
        private Long id;
        private String title;
        private String author;
        private String isbn;
        private BigDecimal price;
        private Integer publishedYear;
        private String genre;
        private Integer stock;
        private String description;

        public BookBuilder id(Long id) { this.id = id; return this; }
        public BookBuilder title(String title) { this.title = title; return this; }
        public BookBuilder author(String author) { this.author = author; return this; }
        public BookBuilder isbn(String isbn) { this.isbn = isbn; return this; }
        public BookBuilder price(BigDecimal price) { this.price = price; return this; }
        public BookBuilder publishedYear(Integer publishedYear) { this.publishedYear = publishedYear; return this; }
        public BookBuilder genre(String genre) { this.genre = genre; return this; }
        public BookBuilder stock(Integer stock) { this.stock = stock; return this; }
        public BookBuilder description(String description) { this.description = description; return this; }

        public Book build() {
            return new Book(id, title, author, isbn, price, publishedYear, genre, stock, description);
        }
    }
}
