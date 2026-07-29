package com.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class BookstoreApplication {

    public static void main(String[] args) {
        // Double-protection: Ensure JDBC URL starts with "jdbc:" if passed without it by cloud providers
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl != null && dbUrl.startsWith("postgresql://")) {
            System.setProperty("spring.datasource.url", "jdbc:" + dbUrl);
        }
        
        SpringApplication.run(BookstoreApplication.class, args);
    }
}
