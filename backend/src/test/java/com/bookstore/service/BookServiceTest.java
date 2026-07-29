package com.bookstore.service;

import com.bookstore.dto.BookDto;
import com.bookstore.entity.Book;
import com.bookstore.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    private Book sampleBook;
    private BookDto sampleDto;

    @BeforeEach
    void setUp() {
        sampleBook = Book.builder()
                .id(1L)
                .title("Effective Java")
                .author("Joshua Bloch")
                .isbn("978-0134685991")
                .price(new BigDecimal("45.00"))
                .publishedYear(2018)
                .genre("Technology")
                .stock(15)
                .description("Java programming best practices")
                .build();

        sampleDto = BookDto.builder()
                .id(1L)
                .title("Effective Java")
                .author("Joshua Bloch")
                .isbn("978-0134685991")
                .price(new BigDecimal("45.00"))
                .publishedYear(2018)
                .genre("Technology")
                .stock(15)
                .description("Java programming best practices")
                .build();
    }

    @Test
    void testGetBookById_Success() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(sampleBook));

        BookDto result = bookService.getBookById(1L);

        assertNotNull(result);
        assertEquals("Effective Java", result.getTitle());
        assertEquals("Joshua Bloch", result.getAuthor());
    }

    @Test
    void testCreateBook_Success() {
        when(bookRepository.existsByIsbn("978-0134685991")).thenReturn(false);
        when(bookRepository.save(any(Book.class))).thenReturn(sampleBook);

        BookDto created = bookService.createBook(sampleDto);

        assertNotNull(created);
        assertEquals("Effective Java", created.getTitle());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void testCreateBook_DuplicateIsbn_ThrowsException() {
        when(bookRepository.existsByIsbn("978-0134685991")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> bookService.createBook(sampleDto));
        verify(bookRepository, never()).save(any(Book.class));
    }
}
