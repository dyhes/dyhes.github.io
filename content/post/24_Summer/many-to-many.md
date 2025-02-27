---
title: Many-Many Relationship
date: 2024-07-10 00:00:00+0000
image: /covers/cover20.jpg
categories: 
    - nutrition
    - willow
tags:
    - Spring Data JPA
    - Spring Boot
---
## @ManyToMany
The @ManyToMany annotation is used in Java persistence frameworks, particularly in Java Persistence API (JPA) and Object-Relational Mapping (ORM) tools like Hibernate. It’s used to define a **many-to-many relationship** between two entities.

* Relationship: It represents a relationship where multiple instances of one entity can be associated with multiple instances of another entity.
* Database representation: In a relational database, this is typically implemented using a join table that contains foreign keys to both entities.
* Bidirectional vs Unidirectional: The relationship can be **bidirectional** (defined on both entities) or **unidirectional** (defined on only one entity, namely the owning one).
* Usage: It’s typically used on a **collection field** in an entity class.
* Join Table: By default, JPA will create a join table, but you can **customize** this using the **@JoinTable** annotation.

```java
@Entity
@Table("students")
public class Student {
    @Id
    @GeneratedValue
    private Long id;
    
    private String name;
    
    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> signedCourses;
    
    // getters and setters
}

@Entity
@Table("courses")
public class Course {
    @Id
    @GeneratedValue
    private Long id;
    
    private String name;
    
    @ManyToMany(mappedBy = "signedCourses")
    private Set<Student> students;
    
    // getters and setters
}
```

In this example:
* A student can enroll in multiple courses, and a course can have multiple students.
* The @JoinTable annotation specifies the details of the join table.
* The mappedBy attribute in the Course entity indicates that Student is the owning side of the relationship.

When using @ManyToMany, consider these best practices:
* **Use Set** instead of List to avoid duplicate entries.
* Be cautious with bidirectional relationships, as they can **lead to performance issues** if not managed properly.
* Consider using **lazy loading** (fetch = FetchType.LAZY) to improve performance.
* In some cases, it might be better to model the relationship as **two one-to-many** relationships with an intermediate entity, especially if you need to store **additional information** about the relationship.
## mappedBy
The mappedBy attribute in a @ManyToMany relationship is used to indicate the non-owning side of a **bidirectional** relationship. 
* In a @ManyToMany relationship, one side needs to be the owning side, and the other is the non-owning (inverse) side.
* The owning side is where **the @JoinTable is specified** (if using a custom join table).
* The non-owning side uses mappedBy to **refer to the property** on the owning side.
Key Points
* **Only** the owning side of the relationship is responsible for updating the join table.
* Changes made to the non-owning side **won’t be reflected in the database** unless the owning side is also updated.
Benefits
* **Prevents duplicate** join tables.
* Clarifies which side of the relationship is responsible for managing the association.
Common Mistake:
* Forgetting to specify mappedBy on one side, which can lead to **two separate join table**s being created.
Bidirectional Relationship Management:
* Even though mappedBy is specified, you typically need to update both sides of the relationship in your Java code **for consistency.**
  ```java
  student.getCourses().add(course);
  course.getStudents().add(student);
  ```
Database Perspective:
* The database structure is the same regardless of which side is the owning side.
* The choice affects how JPA manages the relationship, not the underlying database schema.
## lazy loading
* Lazy loading means that an object **doesn’t load all of its associated data** from the database when it’s first retrieved.
* Instead, it loads only the data it needs immediately and loads other related data **only when it’s specifically requested**.
In ORM Context:
* When you fetch an entity from the database, lazy loading allows you to retrieve the entity **without immediately loading all of its associated entities or collections**.
* The associated data is loaded only when you try to **access it**.
When to use:
* Use lazy loading for associations that are not always needed.
* Use eager loading for associations that are almost always needed with the main entity.
Implementation:
* In JPA, lazy loading is often the default **for collection associations** (@OneToMany, @ManyToMany).
* **For single-valued associations** (@ManyToOne, @OneToOne), eager loading is usually the default.
Best Practices:
* Use lazy loading as the default strategy.
* Switch to eager loading only when you’re certain that the related data is always needed.

