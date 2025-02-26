---
title: One-One Relationship
date: 2024-07-11 00:00:00+0000
image: /covers/cover21.jpg
categories: 
    - nutrition
    - willow
tags:
    - Spring Data JPA
    - Spring Boot
---
A one-to-one relationship means that each instance of an entity is associated with precisely one instance of another entity. This relationship is bidirectional or unidirectional:
* **Unidirectional One-to-One**: One entity has a reference to another entity, but not vice versa.
* **Bidirectional One-to-One**: Both entities have references to each other.
In the context of object-relational mapping (ORM) in Java, specifically when using Java Persistence API (JPA) or Hibernate, the @OneToOne annotation is used to define a one-to-one relationship between two entities.

```java
// unidirectional 
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private UserProfile userProfile;

    // Getters and setters
}

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    // Getters and setters
}

//bidirectional
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
    private UserProfile userProfile;

    // Getters and setters
}

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
}
```