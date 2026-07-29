package com.bookstore.service;

import com.bookstore.dto.BookDto;
import com.bookstore.entity.Book;
import com.bookstore.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public Page<BookDto> getAllBooks(String query, String genre, Pageable pageable) {
        return bookRepository.searchBooks(query, genre, pageable).map(this::mapToDto);
    }

    @Cacheable(value = "books", key = "#id")
    @Transactional(readOnly = true)
    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return mapToDto(book);
    }

    @CacheEvict(value = "books", allEntries = true)
    @Transactional
    public BookDto createBook(BookDto dto) {
        if (bookRepository.existsByIsbn(dto.getIsbn())) {
            throw new RuntimeException("Book with ISBN " + dto.getIsbn() + " already exists");
        }

        Book book = mapToEntity(dto);
        Book savedBook = bookRepository.save(book);
        return mapToDto(savedBook);
    }

    @CacheEvict(value = "books", key = "#id", allEntries = true)
    @Transactional
    public BookDto updateBook(Long id, BookDto dto) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        if (bookRepository.existsByIsbnAndIdNot(dto.getIsbn(), id)) {
            throw new RuntimeException("Another book with ISBN " + dto.getIsbn() + " already exists");
        }

        existingBook.setTitle(dto.getTitle());
        existingBook.setAuthor(dto.getAuthor());
        existingBook.setIsbn(dto.getIsbn());
        existingBook.setPrice(dto.getPrice());
        existingBook.setPublishedYear(dto.getPublishedYear());
        existingBook.setGenre(dto.getGenre());
        existingBook.setStock(dto.getStock());
        existingBook.setDescription(dto.getDescription());

        Book updatedBook = bookRepository.save(existingBook);
        return mapToDto(updatedBook);
    }

    @CacheEvict(value = "books", key = "#id", allEntries = true)
    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    private BookDto mapToDto(Book book) {
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .price(book.getPrice())
                .publishedYear(book.getPublishedYear())
                .genre(book.getGenre())
                .stock(book.getStock())
                .description(book.getDescription())
                .build();
    }

    private Book mapToEntity(BookDto dto) {
        return Book.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .isbn(dto.getIsbn())
                .price(dto.getPrice())
                .publishedYear(dto.getPublishedYear())
                .genre(dto.getGenre())
                .stock(dto.getStock())
                .description(dto.getDescription())
                .build();
    }
}
