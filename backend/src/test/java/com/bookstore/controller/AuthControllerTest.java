package com.bookstore.controller;

import com.bookstore.dto.AuthRequest;
import com.bookstore.dto.AuthResponse;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private AuthRequest loginRequest;
    private RegisterRequest registerRequest;
    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        loginRequest = AuthRequest.builder()
                .username("admin")
                .password("Admin@123")
                .build();

        registerRequest = RegisterRequest.builder()
                .username("sivaos")
                .email("sivaos@gmail.com")
                .password("sivaos@123")
                .fullName("Sivakumar OS")
                .roles(Set.of("USER"))
                .build();

        authResponse = AuthResponse.builder()
                .token("mocked-jwt-token")
                .type("Bearer")
                .id(100L)
                .username("admin")
                .email("admin@bookstore.com")
                .fullName("System Administrator")
                .roles(List.of("ROLE_ADMIN"))
                .build();
    }

    @Test
    void testLogin_Success() throws Exception {
        when(authService.login(any(AuthRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked-jwt-token"))
                .andExpect(jsonPath("$.username").value("admin"));
    }

    @Test
    void testLogin_BadCredentials() throws Exception {
        when(authService.login(any(AuthRequest.class)))
                .thenThrow(new BadCredentialsException("Invalid username or password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    void testRegister_Success() throws Exception {
        when(authService.register(any(RegisterRequest.class))).thenReturn("User registered successfully!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    void testRegister_DuplicateUsername() throws Exception {
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Error: Username is already taken!"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Username is already taken!"));
    }
}
