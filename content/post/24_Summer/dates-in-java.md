---
title: 【Java】Dates and Times
date: 2024-07-12 00:00:00+0000
image: /covers/cover19.png
categories: 
    - nutrition
    - temple
tags:
    - Java
---

## `java.util.Date`
You're right to ask about the Date class. The pre-Java 8 java.util.Date class is indeed still available, but it's generally considered **outdated** for modern Java projects.
### Issues
* Mutable (not **thread-safe**)
* Poorly designed API
* Doesn't handle time zones well
* Only **millisecond** precision
* Confusing method names (e.g., getYear() returns year since 1900)
### Modern alternatives
* Java 8+ java.time package (recommended)
* Third-party libraries like Joda-Time (for pre-Java 8 projects)
### Migration
* java.time provides methods to convert between old and new date/time classes
## `java.time`
`java.time` introduced in Java 8, provides a comprehensive and much-improved API for handling dates, times, and durations.
### LocalDate
Represents a date without time or time zone.
### LocalTime
Represents a time without date or time zone.
### LocalDateTime
Combines date and time, without a time zone.
### ZonedDateTime
Date and time with a time zone.
### ZoneId
represents a time zone
### Instant
Instant represents a point in time on the timeline, typically in UTC (Coordinated Universal Time). It's essentially a **timestamp** with nanosecond precision.
### Period
Represents a **date-based** amount of time.
### Duration
Represents a **time-based** amount of time.
### DateTimeFormatter 
is used for parsing and formatting date-time objects.
## Usage in Database
### Recommended classes
* LocalDate: For date-only fields (e.g., birthdate)
* LocalDateTime: For date and time without time zone
* Instant: For timestamps (e.g., created_at, updated_at)
* ZonedDateTime: If you need to store time zone information
### Considerations
* Instant is often preferred **for timestamps** because it's always in UTC and avoids time zone ambiguities.
* If using an **older version of Hibernate** (pre-5.0), you might need additional configuration or converters.
* Some databases might require specific column definitions. For example, **PostgreSQL might need @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE") for Instant**.
### Database-specific notes
* MySQL: LocalDateTime is typically stored as DATETIME, Instant as TIMESTAMP.
* PostgreSQL: Supports all types well, but ensure your JDBC driver is up to date.
* Oracle: May require additional configuration for LocalDate and LocalDateTime.
### Best practices
* **Use Instant for audit fields** (created_at, updated_at).
* Use LocalDateTime for user-entered date-times if time zone isn't important.
* Always consider time zone implications in your application logic.
You can set the following property to ensure proper handling of JDBC time zones: 
```java
spring.jpa.properties.hibernate.jdbc.time_zone=UTC
```
### example
```java
import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate birthDate;

    private LocalDateTime lastLogin;

    @Column(columnDefinition = "TIMESTAMP")
    private Instant createdAt;

    // getters and setters
}
```
## Instant usage
Use Instant for:
* System-generated timestamps (created_at, updated_at)
* Event occurrences (lastLogin, orderPlacedAt)
* Any time you need to record a specific moment and **might deal with different time zones**
### Audit field
* created_at: When a record was created
* updated_at: When a record was last modified
* sometimes deleted_at: When a record was soft-deleted
### Benifits
Querying
* Easy to query for records created or updated within a specific time range.
  
Sorting
* Straightforward to sort records by creation or update time.
  
Time zone handling
* When displaying to users, you can easily convert Instant to their local time zone.

Potential pitfall to avoid
* Don't use LocalDateTime for audit fields unless you're absolutely sure all your servers and databases will always be in the same time zone.

Converting for display
* When you need to display these times to users
  ```java
  ZoneId userZone = ZoneId.of("America/New_York"); 
  Instant createdAt = entity.getCreatedAt(); 
  ZonedDateTime userTime = ZonedDateTime.ofInstant(createdAt, userZone);
  ```
### Database considerations
* For MySQL: Use TIMESTAMP column type
* For PostgreSQL: Use TIMESTAMP WITH TIME ZONE
### JPA Auditting
 If you want to use Spring Data JPA's automatic auditing features, such as:
* @CreatedDate
* @LastModifiedDate
* @CreatedBy
* @LastModifiedBy
enable JPA Auditing.
### manual Auditting
```java
@Entity
public class MyEntity {
    // other fields

    @Column(updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
```
### example
```java
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.Instant;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class AuditedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    // getters and setters
}

@Configuration 
@EnableJpaAuditing 
public class JpaConfig { 
	// other configurations 
}
```
### Other usage
It's often a good practice to store times as Instant and convert to appropriate local times when presenting to users.

This ensures consistent storage and easier querying, while still allowing flexible display options.

While Instant is great for many scenarios, there are cases where other types might be more appropriate: 
* a) LocalDate: When you only need the date without time (e.g., birthDate, holidayDate). 
* b) LocalDateTime: When you need date and time, but the time zone is implicit or unnecessary. 
* c) ZonedDateTime: When you need to **preserve** the specific time zone information.