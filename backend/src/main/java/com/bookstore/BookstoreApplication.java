package com.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import java.net.URI;

@SpringBootApplication
@EnableCaching
public class BookstoreApplication {

    public static void main(String[] args) {
        normalizeCloudDatabaseUrl();
        SpringApplication.run(BookstoreApplication.class, args);
    }

    /**
     * Parse and normalize cloud provider database URLs (e.g. Render, Heroku, Railway)
     * where username and password are embedded in postgresql://user:pass@host/dbname URIs.
     * PostgreSQL JDBC driver requires clean jdbc:postgresql://host:port/dbname format with
     * user/password passed separately.
     */
    private static void normalizeCloudDatabaseUrl() {
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            return;
        }

        try {
            // Strip jdbc: prefix if present for URI parsing
            String cleanUriStr = dbUrl;
            if (cleanUriStr.startsWith("jdbc:")) {
                cleanUriStr = cleanUriStr.substring(5);
            }

            if (cleanUriStr.startsWith("postgresql://") || cleanUriStr.startsWith("postgres://")) {
                URI uri = new URI(cleanUriStr);
                String userInfo = uri.getUserInfo();
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();

                String formattedJdbcUrl = String.format("jdbc:postgresql://%s:%d%s", host, port, path);
                System.setProperty("spring.datasource.url", formattedJdbcUrl);

                if (userInfo != null && userInfo.contains(":")) {
                    String[] userParts = userInfo.split(":", 2);
                    System.setProperty("spring.datasource.username", userParts[0]);
                    System.setProperty("spring.datasource.password", userParts[1]);
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not parse SPRING_DATASOURCE_URL URI: " + e.getMessage());
        }
    }
}
