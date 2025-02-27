---
title: 【Spring Data JPA】Pageable and Sort
date: 2024-07-14 00:00:00+0000
categories: 
    - nutrition
    - willow
tags:
    - Spring Data JPA
---

## Pageable
Pageable is an interface in Spring Data JPA that's used for **pagination and sorting** when working with the PagingAndSortingRepository. It allows you to retrieve data from a database in smaller chunks (pages) and specify sorting criteria.
### Creation
Creating Pageable objects:
* Use **PageRequest.of()** static factory methods
```java
public Page<User> getUsersPage(int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("lastName").ascending());
    return userRepository.findAll(pageable);
}
```
### Performance Considerations
* Pagination can significantly **improve performance** for large datasets.
* Be cautious with **offset-based pagination** (which Pageable uses) for very large datasets, as it can become inefficient.
* For large datasets, consider using indexed columns for sorting and filtering.
* Be cautious with **complex joins** in paginated queries, as they can impact performance.
### Method Signature
* The method should return a **Page<T>** object.
* Include a **Pageable parameter** in the method signature.
### Sorting
* The Pageable object includes sorting information.
* Spring Data **adds ORDER BY** clauses based on the Sort specification in the Pageable object.
* The sorting specified in the Pageable object **overrides** any ORDER BY clause in your query.
### Native Queries
* The query can be in JPQL (Java Persistence Query Language) or native SQL.
* When using native SQL queries, you need to provide **a separate count query** for pagination.
* Use the countQuery attribute of the @Query annotation for this.
```java
    @Query(value = "SELECT * FROM users u WHERE u.created_date > :date", 
           countQuery = "SELECT count(*) FROM users u WHERE u.created_date > :date",
           nativeQuery = true)
    Page<User> findUsersCreatedAfter(@Param("date") Date date, Pageable pageable);
```
## Sort
Sort is a class in Spring Data that represents sorting parameters. It's used to specify the order in which data should be returned from a query.
### Creation
Use static factory methods like Sort.by() to create Sort instances.
```java
Sort sortByName = Sort.by("name");
```
### Direction
* Default direction is **ascending**.
* Use Direction.ASC or Direction.DESC to specify direction.
```java
Sort sortByAgeDesc = Sort.by(Direction.DESC, "age");
```
### Order
* The Order class represents a single sort criterion (property + direction).
* Multiple Order objects can be combined in a Sort.
```java
        Sort complexSort = Sort.by(
            Order.asc("department"),
            Order.desc("salary")
        );
```
### Method Chaining
* Sort provides a fluent API for method chaining.
* Use and() to combine multiple sort criteria.
```java
        Sort chainedSort = Sort.by("department").ascending()
                               .and(Sort.by("salary").descending());

```
### Null Handling
Null handling:
* You can specify null handling with nullsFirst() or nullsLast().
```java
Sort sort = Sort.by( Order.asc("department").nullsLast(), Order.desc("salary").nullsFirst() );
```
### Ignoring case
* Use ignoreCase() for case-insensitive sorting.
### ⠀Typed Sort
* For type-safe sorting, use Sort.sort(Class).
### Example
```java
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;

public class SortExample {

    public void demonstrateSort() {

        // Sorting by multiple properties
        Sort sortByLastNameThenFirstName =Sort.by("lastName").and(Sort.by("firstName"));

        // Combining sorts
        Sort combinedSort = sortByName.and(sortByAgeDesc);

    }
}
```