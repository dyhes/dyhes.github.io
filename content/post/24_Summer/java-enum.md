---
title: 【Java】Enum
date: 2024-07-14 00:00:00+0000
image: /covers/cover19.png
categories: 
    - nutrition
    - willow
    - temple
tags:
    - Java
    - Spring Data JPA
---


Java enums are a special type of class used to define collections of constants. They provide a way to represent a fixed set of values, which can be useful for categorizing data and ensuring type safety.
## Key Points
* Implicitly final and static: Enum constants are implicitly public, static, and final.
* values() method: Every enum has a static values() method that returns an array of all enum constants.
* valueOf(String) method: This static method returns the **enum constant** with the specified name.
* The name() method returns the name of the enum constant as declared in its enum declaration. It's an instance method available on all enum constants.
* valueOf(String) and name() provide a way to convert between the Enum and String.
* ordinal() method: Returns the **position** of the enum constant (zero-based).
* Constructors, Fields, and Methods: Enums can have constructors, fields, and methods, allowing you to associate data and behavior with each constant.
* Implementing Interfaces: Enums can implement interfaces, providing a way to define behavior for each constant.
* EnumSet and EnumMap: These are specialized Set and Map implementations for use with enum types, offering **better performance** than their general-purpose counterparts.
* Constant-specific method implementation: You can **override methods for specific enum** constants, allowing for different behavior per constant.
* Abstract methods in enums: You can define abstract methods in an enum, forcing each constant to provide its own implementation.
## example
```java
// Basic enum definition
public enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

// Enum with constructor, fields, and methods
public enum Planet {
    MERCURY(3.303e+23, 2.4397e6),
    VENUS(4.869e+24, 6.0518e6),
    EARTH(5.976e+24, 6.37814e6);

    private final double mass;   // in kilograms
    private final double radius; // in meters

    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }

    public double getMass() {
        return mass;
    }

    public double getRadius() {
        return radius;
    }

    // Enum constant-specific method implementation
    public double surfaceGravity() {
        return 6.67300E-11 * mass / (radius * radius);
    }
}

// Usage examples
public class EnumExample {
    public static void main(String[] args) {
        // Basic usage
        Day today = Day.MONDAY;
        System.out.println("Today is " + today);

        // Switch statement with enum
        switch (today) {
            case MONDAY:
                System.out.println("Start of the work week");
                break;
            case FRIDAY:
                System.out.println("TGIF!");
                break;
            default:
                System.out.println("Midweek");
        }

        // Using enum methods
        Planet earth = Planet.EARTH;
        System.out.println("Earth's mass: " + earth.getMass());
        System.out.println("Earth's surface gravity: " + earth.surfaceGravity());

        // Iterating over enum values
        for (Planet planet : Planet.values()) {
            System.out.println(planet.name() + ": " + planet.surfaceGravity());
        }
    }
}
```

## Usage with Pageable
```java
public enum UserSortField {
    ID("id"),
    FIRST_NAME("firstName"),
    LAST_NAME("lastName"),
    EMAIL("email"),
    CREATED_DATE("createdDate");

    private final String fieldName;

    UserSortField(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ID") UserSortField sortBy) {
        
        Page<User> userPage = userService.getAllUsers(page, size, sortBy);

        // ... rest of the method remains the same
    }
}

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Page<User> getAllUsers(int page, int size, UserSortField sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy.getFieldName()));
        return userRepository.findAll(pageable);
    }
}
```
## Usage with Spring Data JPA
```java
public enum Status {
    ACTIVE, INACTIVE, PENDING
}

import javax.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Status status;

    // getters and setters
}
```
The @Enumerated annotation is used to specify how the Enum should be persisted in the database. There are two options:

EnumType.ORDINAL: Stores the Enum as an integer (the ordinal value of the Enum constant).
EnumType.STRING: Stores the Enum as a string (the name of the Enum constant).

### EnumType.ORDINAL

#### Pros

* **Database efficiency**: Stores enums as integers, which typically use less storage space than strings.
* **Potentially faster queries**: Integer comparisons are generally faster than string comparisons.
* **Simpler database representation**: The database column is a simple integer type.
#### Cons
* **Fragility to enum order changes**: If you add, remove, or reorder enum constants, the ordinal values change, which can corrupt existing data.
* **Less readable in raw database queries**: You see numbers instead of meaningful names.
* **Potential for invalid states**: If the database contains an integer that doesn’t correspond to any enum constant, it can lead to runtime errors.
### EnumType.STRING

#### Pros

* **Readability**: The database stores the actual names of the enum constants, making raw database queries more understandable.
* **Resilience to enum order changes**: Adding or reordering enum constants doesn’t affect existing data.
* **Self-documenting**: The database schema itself documents the possible enum values.
* **Safety**: It’s harder to accidentally introduce invalid states, as any string not matching an enum constant will be rejected.
#### Cons

* **Less efficient storage**: Strings typically use more storage space than integers.
* **Potentially slower queries**: String comparisons can be slower than integer comparisons, especially for large datasets.
* **Case sensitivity**: By default, the comparison is case-sensitive, which might lead to issues if not handled carefully.
### Recommendation
In most cases, EnumType.STRING is the safer and more maintainable choice, despite the slight performance trade-off. The benefits of readability, safety, and resilience to changes **usually outweigh** the minor efficiency gains of EnumType.ORDINAL.

However, if you’re dealing with a very large dataset where performance and storage efficiency are critical, and you can guarantee that the enum order will never change, EnumType.ORDINAL might be considered.

### Best Practices

**Default** to EnumType.STRING unless you have a compelling reason not to.
If using EnumType.ORDINAL, document it clearly and warn about the dangers of changing the enum order.
Consider using a **custom UserType** for more complex enum persistence scenarios.
If using EnumType.STRING, be aware of **case sensitivity** in your database queries.
