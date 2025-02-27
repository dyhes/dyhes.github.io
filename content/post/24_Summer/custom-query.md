---
title: 【Spring Data JPA】@Query and JPQL
date: 2024-07-14 00:00:00+0000
image: /covers/cover19.png
categories: 
    - nutrition
    - willow
tags:
    - Spring Data JPA
---
## @Query
@Query is an annotation provided by Spring Data JPA. It allows you to define custom queries using either JPQL (Java Persistence Query Language) or native SQL. This annotation is typically used on repository method declarations to specify the query that should be executed when the method is called.
### Native Query
While @Query typically uses JPQL, you can also use native SQL by setting the nativeQuery attribute to true.
```java
@Query(value = "SELECT * FROM users WHERE status = ?1", nativeQuery = true)
List<User> findUsersByStatus(int status);
```
### Positional Parameters
```java
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.email = ?1")
    User findByEmail(String email);
}
```
### Named Parameters
Instead of positional parameters (?1, ?2), you can use named parameters:
```java
@Query("SELECT u FROM User u WHERE u.status = :status AND u.name LIKE :nameLike")
List<User> findUsersByStatusAndNameLike(@Param("status") int status, @Param("nameLike") String nameLike);
```
### Modifying Queries
 For update or delete operations, use the @Modifying annotation along with @Query (mandatory)
```java
@Modifying
@Query("UPDATE User u SET u.status = :status WHERE u.lastLoginDate < :date")
int updateUserStatusByLastLoginDate(@Param("status") int status, @Param("date") LocalDate date);
```
## JPQL (Java Persistence Query Language)
JPQL is a query language similar to SQL, but it operates **on JPA entity objects** rather than database tables. It's used to define queries against entities to search for and retrieve entity objects. JPQL is **database-independent**, which means you can write queries that work across different database systems.
## JOIN
In database terms, a JOIN is an operation that **combines rows from two or more tables based on a related column between them**. In the context of JPQL, a JOIN allows you to fetch associated entities based on their relationships.
### Type
#### Entity Definition
```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String name;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;

    // getters and setters
}

@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String product;
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // getters and setters
}
```
#### Inner Join
Retrieves records that have matching values in both entities.

In JPQL (Java Persistence Query Language), the keyword JOIN by itself **defaults to an INNER JOIN**.
```java
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u INNER JOIN u.orders o WHERE o.product = :product")
	// equals
	@Query("SELECT u FROM User u JOIN u.orders o WHERE o.product = :product")
    List<User> findUsersByProduct(@Param("product") String product);
}
```
#### Left (Outer) Join
Retrieves **all records from the left** entity and **the matched records from the right** entity. If no match is found, NULL values are returned for columns from the right entity.
```java
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u LEFT JOIN u.orders o WHERE u.name = :name")
    List<User> findUsersWithOrders(@Param("name") String name);
}
```
#### Fetch Join
An **optimization technique** to eagerly fetch associated entities in a single query.
```java
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.name = :name")
    List<User> findUsersWithOrdersFetch(@Param("name") String name);
}
```
#### Right (Outer) Join
Retrieves **all records from the right** entity and **the matched records from the left** entity. If no match is found, NULL values are returned for columns from the left entity. (**Less commonly used** in JPQL)
```java
@Query("SELECT o FROM Order o RIGHT JOIN o.user u") 
List<Order> findAllOrdersWithUsers();
```
#### Full (Outer) Join
Retrieves records when there is a match in one of the entities. (**Not supported in JPQL**; you would typically use a combination of left and right joins to achieve this effect)
### Implicit Join
In JPQL, you can use implicit joins by simply referencing related entities in the WHERE clause.
```java
@Query("SELECT u FROM User u WHERE u.address.city = :city")
List<User> findUsersByCity(@Param("city") String city);

@Query("SELECT u FROM User u JOIN u.address a WHERE a.city = :city")
List<User> findUsersByCity(@Param("city") String city);
```
#### Differences
In general, implicit joins do not inherently have performance issues compared to explicit joins. The database optimizer **typically treats them the same way**. However, there are some important considerations:
* **Query Optimization:** Modern database management systems (DBMS) are quite sophisticated in their query optimization. They often **transform implicit joins into explicit joins** during the query execution plan generation. This means that in many cases, there's no performance difference between implicit and explicit joins.
* **Readability and Maintainability**: While not strictly a performance issue, explicit joins are often considered more readable and maintainable. This can indirectly affect performance if **unclear** queries lead to misunderstandings and suboptimal database usage.
* **Complex Queries**: In more complex scenarios, especially involving multiple joins or outer joins, explicit joins can **be clearer** and might help the optimizer make better decisions. This is more about query complexity than implicit vs. explicit syntax.
* **Potential Pitfalls of implicit join**:
  * **N+1 Query Problem**: This can occur with lazy loading and implicit joins, but it's not due to the implicit join itself. It's more about how the ORM (Object-Relational Mapping) handles lazy loading.
  * **Cartesian Products**: In rare cases, implicit joins might lead to unintended cartesian products, especially in complex queries. Explicit joins make the intentions clearer.
### Performance Considerations
* JOINs can be **expensive** operations, especially on large tables.
* **Proper indexing** on join columns is crucial for performance.
* Be cautious with **JOIN FETCHes on collections**, as they can lead to cartesian products and duplicate results. Use DISTINCT when necessary.
