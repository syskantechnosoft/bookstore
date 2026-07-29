package com.bookstore.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class BookDto {

    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Author is required")
    @Size(max = 255, message = "Author cannot exceed 255 characters")
    private String author;

    @NotBlank(message = "ISBN is required")
    @Pattern(regexp = "^(?:97[89][- ]?)?\\d{1,5}[- ]?\\d{1,7}[- ]?\\d{1,7}[- ]?[0-9X]$", message = "Invalid ISBN format")
    private String isbn;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    private BigDecimal price;

    @NotNull(message = "Published year is required")
    @Min(value = 1000, message = "Published year must be a valid year")
    @Max(value = 2100, message = "Published year cannot be in the far future")
    private Integer publishedYear;

    @NotBlank(message = "Genre is required")
    @Size(max = 100, message = "Genre cannot exceed 100 characters")
    private String genre;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock must be non-negative")
    private Integer stock;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    public BookDto() {}

    public BookDto(Long id, String title, String author, String isbn, BigDecimal price, Integer publishedYear, String genre, Integer stock, String description) {
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

    public static BookDtoBuilder builder() {
        return new BookDtoBuilder();
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

    public static class BookDtoBuilder {
        private Long id;
        private String title;
        private String author;
        private String isbn;
        private BigDecimal price;
        private Integer publishedYear;
        private String genre;
        private Integer stock;
        private String description;

        public BookDtoBuilder id(Long id) { this.id = id; return this; }
        public BookDtoBuilder title(String title) { this.title = title; return this; }
        public BookDtoBuilder author(String author) { this.author = author; return this; }
        public BookDtoBuilder isbn(String isbn) { this.isbn = isbn; return this; }
        public BookDtoBuilder price(BigDecimal price) { this.price = price; return this; }
        public BookDtoBuilder publishedYear(Integer publishedYear) { this.publishedYear = publishedYear; return this; }
        public BookDtoBuilder genre(String genre) { this.genre = genre; return this; }
        public BookDtoBuilder stock(Integer stock) { this.stock = stock; return this; }
        public BookDtoBuilder description(String description) { this.description = description; return this; }

        public BookDto build() {
            return new BookDto(id, title, author, isbn, price, publishedYear, genre, stock, description);
        }
    }
}
