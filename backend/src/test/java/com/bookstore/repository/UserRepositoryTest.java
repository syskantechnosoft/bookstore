package com.bookstore.repository;

import com.bookstore.entity.Role;
import com.bookstore.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("h2")
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void testSaveAndFindByUsername() {
        Role role = roleRepository.findByName("ROLE_USER").orElseGet(() ->
            roleRepository.save(Role.builder().name("ROLE_USER").build())
        );

        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("hashedpass")
                .fullName("Test User")
                .roles(Set.of(role))
                .build();

        userRepository.save(user);

        Optional<User> found = userRepository.findByUsername("testuser");
        assertTrue(found.isPresent());
        assertEquals("test@example.com", found.get().getEmail());
        assertTrue(userRepository.existsByUsername("testuser"));
        assertTrue(userRepository.existsByEmail("test@example.com"));
    }
}
