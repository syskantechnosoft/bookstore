package com.bookstore.repository;

import com.bookstore.entity.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("h2")
public class RoleRepositoryTest {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void testFindByName_SeedRolesExist() {
        Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN");
        assertTrue(adminRole.isPresent());

        Optional<Role> librarianRole = roleRepository.findByName("ROLE_LIBRARIAN");
        assertTrue(librarianRole.isPresent());

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER");
        assertTrue(userRole.isPresent());
    }
}
