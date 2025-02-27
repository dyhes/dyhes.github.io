---
title: Many-One Relationship
date: 2024-07-11 00:00:00+0000
image: /covers/cover19.png
categories: 
    - nutrition
    - willow
tags:
    - Spring Data JPA
    - Spring Boot
---
## @OneToMany
* This annotation is used to define a one-to-many relationship between two entities.
* It’s typically **used on the “one” side** of the relationship.
```java
public class Department {
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL
)
    private List<Employee> employees;
}
```
## @ManyToOne
* This annotation is used to define a many-to-one relationship between two entities.
* It’s typically **used on the “many” side** of the relationship.
```java
public class Employee {
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
```
Often, @OneToMany and @ManyToOne are used together to create a bidirectional relationship. The @OneToMany side uses mappedBy to indicate the field that owns the relationship. The @ManyToOne side use @JoinColumn to specify the **foreign key column**.
## Cascade operation
Cascade operations in ORM frameworks like Hibernate and JPA allow you to **automatically apply operations performed on a parent entity to its associated child entities**. This feature is particularly useful in managing relationships between entities and can significantly simplify database operations.
### Types
* PERSIST: Saves the child entity when the parent is saved.
* MERGE: Updates the child entity when the parent is updated.
* REMOVE: Deletes the child entity when the parent is deleted.
* REFRESH: Refreshes the child entity when the parent is refreshed.
* DETACH: Detaches the child entity when the parent is detached (from the persistence context).
* ALL: Applies all cascade types (PERSIST, MERGE, REMOVE, REFRESH, DETACH).
### Usage
You can specify cascade operations in the @OneToMany, @ManyToOne, @OneToOne, or @ManyToMany annotations:
```java
@OneToMany(cascade = CascadeType.ALL)
private List<ChildEntity> children;

@OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
private List<ChildEntity> children;
```
### Considerations
* Orphan Removal: Used in conjunction with cascading, orphanRemoval = true will remove child entities that are no longer referenced by the parent.
* Bi-directional Relationships: Be cautious with cascade operations in **bi-directional relationships** to avoid unintended side effects.
* Performance: Cascading can **impact performance**, especially with large datasets. Use it judiciously
