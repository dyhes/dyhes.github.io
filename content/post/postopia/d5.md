---
title: 【Postopia Dev Log】Day 5
date: 2024-07-12 00:00:00+0000
categories: 
    - moon
    - snow
tags:
    - Postopia
math: true
---
深入了解了@ManyToMany, @ManyToOne, @OneToMany, @OneToOne 这几个注解以及java中的日期时间及其在数据库里的使用

定义了Comment, Space 等 model
## @Id
The @Id annotation in JPA (Java Persistence API) is used to mark a field as the primary key of an entity. 

By default:
* Nullable:
  * @Id fields are generally not nullable. Primary keys are used to uniquely identify each record in a database table, so they must have a value.
  * However, the exact behavior can depend on the underlying database and the specific JPA implementation.
* Updatable:
  * @Id fields are typically not updatable after they are set.
  * Once an entity is persisted with a primary key value, that value should not change for the lifetime of the entity.
  * Changing the ID of an existing entity can lead to data integrity issues and is generally discouraged.

It’s important to note:
* While the @Id itself doesn’t have properties for nullable or updatable, you can use additional annotations or configurations to modify the behavior:
  * You can use @Column(nullable = false) to explicitly specify that the field cannot be null (though this is usually the default for ID fields).
  * You can use @Column(updatable = false) to explicitly specify that the field cannot be updated after initial persistence.
* The exact behavior can also depend on how the ID is generated. For example, if you’re using @GeneratedValue for automatic ID generation, the field will initially be null until the entity is persisted, at which point the database or JPA provider will generate and set the ID value.
* Some JPA implementations might allow updates to ID fields in certain circumstances, but this is not standard behavior and should be avoided in most cases.
## Set or List
When deciding whether to use a Set or a List for @ManyToMany and @OneToMany relationships in JPA, there are several factors to consider, including the uniqueness requirement, ordering, and performance. Here is a breakdown of when to use each:
### When to Use Set
* **Uniqueness**
  Set does not allow duplicate elements. If you want to ensure that the collection of related entities is unique, a Set is appropriate.
* **No Ordering**
  Set does not maintain the order of elements. If the order of the related entities does not matter, you can use a Set.
* **Performance**
  In general, Set operations like add, remove, and contains are faster than List operations because Set uses hashing or other mechanisms to enforce uniqueness.
### **When to Use** **List**
* **Ordering**
  List maintains the order of elements. If the order of the related entities matters, or you need to preserve the order in which elements are inserted, you should use a List.
* **Duplicates**
  List allows duplicate elements. If there is a scenario where duplicates are meaningful or required, then List is the appropriate choice.
* **Indexed Access**
  List allows indexed access to elements. If you need to frequently access elements by their index, a List would be more suitable.
## Join Table Entity
Check the corresponding Independent post
## Dates in Java
Check the corresponding Independent post
## Confusion about FetchType.LAZY
Is the primary key of the referenced entity can be easily accessed even when the fetch is LAZY in @ManyToOne and @OneToOne of spring data jpa?

> Yes, the primary key of the referenced entity can still be easily accessed even when the fetch type is set to FetchType.LAZY in @ManyToOne and @OneToOne relationships in Spring Data JPA.
> 
> When you configure a relationship with FetchType.LAZY, it means that the related entity is not immediately loaded from the database when the parent entity is fetched. Instead, it is loaded on demand when you actually try to access the relationship.
> 
> However, accessing the primary key of the referenced entity does not require fetching the entire entity. The primary key value is typically stored as a foreign key in the parent entity, and **you can access this foreign key directly without triggering a lazy load of the related entity**.

Is it the same for @ManyToMany and @OneToMany?

> GPT-4o:
> 
> No.
> 
> In a @ManyToMany relationship, a **join table** is typically used to maintain the associations between the entities. When the fetch type is LAZY, the list of related entities is not loaded until you explicitly access it.
> 
> In a @ManyToMany relationship, The foreign key parent_id is stored in the Child entity and **not directly accessible from the Parent entity without loading the children**.
> 
> In both cases, there isn’t a straightforward way to access the primary keys of the related entities without triggering a lazy load.
## Entity Object Extension
```java
import javax.persistence.MappedSuperclass;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;

@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters and Setters
}
```
## Confusions about database
* In most cases, a simple COUNT() will be more efficient than retrieving detailed columns. 
* the columns queried can have a significant impact on query time.
  * SELECT * is often slower than selecting specific columns, especially in large tables.
  * Smaller data types (e.g., INT) are typically faster to retrieve than larger ones (e.g., TEXT or BLOB).