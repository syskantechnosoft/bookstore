package com.bookstore.service;

import com.bookstore.dto.AuthRequest;
import com.bookstore.dto.AuthResponse;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.entity.Role;
import com.bookstore.entity.User;
import com.bookstore.repository.RoleRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private Role userRole;
    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        userRole = Role.builder().id(3L).name("ROLE_USER").build();

        sampleUser = User.builder()
                .id(100L)
                .username("sivaos")
                .email("sivaos@gmail.com")
                .password("encoded_pass")
                .fullName("Sivakumar OS")
                .roles(Set.of(userRole))
                .build();

        registerRequest = RegisterRequest.builder()
                .username("sivaos")
                .email("sivaos@gmail.com")
                .password("sivaos@123")
                .fullName("Sivakumar OS")
                .roles(Set.of("USER"))
                .build();
    }

    @Test
    void testRegister_Success() {
        when(userRepository.existsByUsername("sivaos")).thenReturn(false);
        when(userRepository.existsByEmail("sivaos@gmail.com")).thenReturn(false);
        when(roleRepository.findByName("ROLE_USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode("sivaos@123")).thenReturn("encoded_pass");

        String result = authService.register(registerRequest);

        assertEquals("User registered successfully!", result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegister_DuplicateUsername_ThrowsException() {
        when(userRepository.existsByUsername("sivaos")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegister_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByUsername("sivaos")).thenReturn(false);
        when(userRepository.existsByEmail("sivaos@gmail.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }
}
