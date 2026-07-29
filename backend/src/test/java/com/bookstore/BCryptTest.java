package com.bookstore;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptTest {

    @Test
    void generateHashes() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String adminHash = encoder.encode("Admin@123");
        String librarianHash = encoder.encode("Librarian@123");
        String userHash = encoder.encode("User@123");

        System.out.println("ADMIN_HASH: " + adminHash);
        System.out.println("LIBRARIAN_HASH: " + librarianHash);
        System.out.println("USER_HASH: " + userHash);

        org.junit.jupiter.api.Assertions.assertTrue(encoder.matches("Admin@123", adminHash));
        org.junit.jupiter.api.Assertions.assertTrue(encoder.matches("Librarian@123", librarianHash));
        org.junit.jupiter.api.Assertions.assertTrue(encoder.matches("User@123", userHash));
    }
}
