---
title: 【Spring Boot】Uploaded Image Processing
date: 2024-07-13 00:00:00+0000
categories: 
    - nutrition
    - willow
tags:
    - Spring Boot
---

## example
```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final String AVATAR_UPLOAD_DIR = "uploads/avatars/";

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestPart("userInfo") UserRegistrationDto userInfo,
            @RequestParam(value = "avatar", required = false) MultipartFile avatarFile) {
        
        // Generate a unique user ID
        String userId = UUID.randomUUID().toString();

        // Process user information
        System.out.println("Registering user: " + userInfo.getUsername());
        System.out.println("Email: " + userInfo.getEmail());
        // Here you would typically save the user information to a database

        // Process avatar if provided
        String avatarUrl = null;
        if (avatarFile != null && !avatarFile.isEmpty()) {
            avatarUrl = saveAvatar(avatarFile, userId);
        }

        // Construct response
        String response = "User registered successfully. " +
                "Username: " + userInfo.getUsername() +
                ", Email: " + userInfo.getEmail();
        if (avatarUrl != null) {
            response += ", Avatar URL: " + avatarUrl;
        }

        return ResponseEntity.ok(response);
    }

    private String saveAvatar(MultipartFile file, String userId) {
        try {
            String fileName = userId + "_" + file.getOriginalFilename();
            Path path = Paths.get(AVATAR_UPLOAD_DIR + fileName);
            Files.write(path, file.getBytes());
            return "/avatars/" + fileName; // Return the relative URL
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}

class UserRegistrationDto {
    private String username;
    private String email;
    private String password; // Note: In a real application, never store passwords in plain text

    // Getters and setters
}
```
We use `@RequestPart` for userInfo because it's a complex object (JSON data) that needs to be deserialized into a `UserRegistrationDto` object.
We use `@RequestParam` for avatarFile because it's a simple file upload. While we could use `@RequestPart` here **as well**, `@RequestParam` is sufficient and clearly indicates that it's an optional parameter.
## @RequestPart

## @RequestParam
Typically used for simple values like strings, numbers, or booleans.
By default, parameters are required. You can make them optional by setting **required = false**.
* For GET requests, it looks at **query parameters**.
* For requests with application/x-www-form-urlencoded, it looks at the **form data** in the request body.
* For requests with multipart/form-data, it can look at **both** the URL and the parts of the multipart request.
* It can even extract data from the **query string for POST requests**, which is occasionally useful.
### compare with @PathVariable
#### @PathVariable
* Used to handle **template variables** in the request URI.
* **Part of the path** itself, not a query string.
* Typically used for **mandatory** parameters that identify a resource.
* Cannot have default values (if the value is not in the URL, the route won't match).
```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    // Implementation
}
```
## @Request Body
For application/json or application/xml
## `application/x-www-form-urlencoded` and `multipart/form-data`
### `application/x-www-form-urlencoded` 
This is the default content type for HTML form submissions and is widely used for sending simple data.
#### Key characteristics
* Data is encoded in **key-value** pairs
* Keys and values are **URL-encoded** (spaces become '+' or '%20', special characters are percent-encoded)
* Pairs are separated by '**&**'
#### Pros
* Simple and widely supported
* Efficient for small amounts of text data
* Easy to generate and parse
#### ⠀Cons
* Not suitable for sending large amounts of data
* Not efficient for sending binary data (like files)
* Can become unwieldy with complex data structures
### `multipart/form-data`
This content type is used when the form includes **files, non-ASCII data**, or when you need to send **binary data**.
#### Key characteristics
* The body is divided into **separate parts**, each representing a form field or file
* Each part can have **its own content type**
* Parts are separated **by a boundary delimiter**
#### example
```http
--boundary
Content-Disposition: form-data; name="name"

John Doe
--boundary
Content-Disposition: form-data; name="file"; filename="example.txt"
Content-Type: text/plain

[File content goes here]
--boundary--
```
#### Pros
* Can handle file uploads **efficiently**
* Supports **mixed data types** (text fields and files) in a single request
* Better for sending large amounts of data or binary data
* Each part can have its own content type
#### ⠀Cons
* More complex to parse and generate
* Slightly larger overhead due to boundaries and headers
## Get Method
### HTTP Specification
According to the HTTP/1.1 specification (RFC 7231), a GET request **can have a body**. However, the specification also states that a GET request with a body **has no defined semantics, meaning servers are not required to process or even acknowledge the body**.
### Real-world Practice
In practice, while it's **technically possible** to send a body with a GET request, it's generally **discouraged** and often not supported for several reasons:
* Many servers, clients, and proxies **ignore** the body of a GET request. 
* Some implementations might **reject** GET requests with a body.
* It goes against the **intended** use of GET as defined in the HTTP specification.
### RESTful API Design
In RESTful API design, GET requests are meant to be **safe and idempotent**. They should retrieve resources without modifying server state. Including a body in a GET request could imply that the request is intended to modify something, which contradicts these principles.