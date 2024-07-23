---
title: 【Postopia Dev Log】Day 7 - Week 2
date: 2024-07-19 00:00:00+0000
categories: 
    - moon
    - snow
tags:
    - Postopia
math: true
---
# Day 7 - Week 2
按部就班进行开发，发现自己可能会在一些自己认知范围内的性能优化点特别在意，又会觉得优化需要对语言底层有深刻的认知，接近于一个无穷无尽的过程，然后对自己的语言功底感到焦虑。

## Delete method
Yes, derived delete methods in Spring Data JPA repositories can return a boolean value. When you define a derived delete method to return a boolean, it will indicate whether any records were actually deleted.
## @EntityListeners(AuditingEntityListener.class)
除
* @EnableJpaAuditting
* @CreateDate
还需要加上：
* **@EntityListeners(AuditingEntityListener.class)**
## Data Transfer Objects 
query only the needed fields in Spring Data JPA for several reasons:
### Performance optimization:
* By querying only the required fields, you reduce the amount of data transferred between the database and your application, which can improve performance, especially for large datasets.
### Reduced network traffic:
* Transferring only the necessary data minimizes network usage, which is particularly beneficial in distributed systems or when dealing with remote clients.
### Separation of concerns:
* DTOs help separate the data representation used in your application’s business logic from the underlying database entities, providing a clear boundary between layers.
### Flexibility and maintainability:
* DTOs allow you to shape the data according to specific use cases, making it easier to evolve your API without affecting the underlying data model.
### Security:
* By using DTOs, you can control which data is exposed to the client, reducing the risk of accidentally exposing sensitive information.
### Avoid lazy loading issues:
* When working with JPA entities, lazy-loaded associations can cause performance problems or errors if accessed outside of a transaction. DTOs help avoid these issues by containing only the required data.
## `Var` keyword
In Java, the var keyword was introduced in **Java 10** as part of the **Local Variable Type Inference feature**. It allows you to declare local variables without explicitly specifying their type. The compiler infers the type **based on the initialization expression**.
Here are some key points about var in Java:
* usage
```java
var variableName = initialValue;
```
* Scope: 
  var can only be used for **local variables** inside methods or loops. It cannot be used for fields, method parameters, or return types.
* Initialization: 
  Variables declared with var must be **initialized in the same statement**.
* Type Inference: 
  The compiler infers the type based on the right-hand side of the assignment.
* Limitations:
  * Cannot be used with null literals
  * Cannot be used with array initializers
  * Cannot be used in a compound declaration (declaring multiple variables in one statement)
* Examples
```java
// Basic usage
var name = "John";  // inferred as String
var age = 30;       // inferred as int
var list = new ArrayList<String>();  // inferred as ArrayList<String>

// In a for loop
for (var i = 0; i < 10; i++) {
    System.out.println(i);
}

// With lambda expressions
var comparator = (String s1, String s2) -> s1.compareTo(s2);

// With try-with-resources
try (var reader = new BufferedReader(new FileReader("file.txt"))) {
    // Use reader
}
```
* Benefits of using var:
  * Reduces boilerplate code, especially with long type names.
  * Improves **readability** in some cases, particularly with generic types.
  * Allows the type to change without changing the variable declaration.
* Considerations:
  * Use var judiciously. Sometimes explicit type declarations can improve code clarity.
  * var doesn’t make Java a dynamically-typed language. The type is still **determined at compile-time**.
  * IDEs can usually show you the inferred type, which helps with code understanding.
## Other Local Variable Type Inference feature
* Diamond Operator (<>):
  Introduced in Java 7, it allows type inference for generic class instantiation.
  ```java
  List<String> list = new ArrayList<>();  // Instead of new ArrayList<String>()  
* Method References:
  Introduced in Java 8, method references work with type inference.
  ```java
  List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
  names.forEach(System.out::println); 
* Try-with-resources
  ```java
  try (var input = new FileInputStream("file.txt")) {
    // Use input
  }
  ``` 
## Repository Layer Referencing
### One @Repository and Multiple @Services
#### Pros
* Promotes **separation of concerns**
* Follows the **Single Responsibility Principle**
* Can lead to better code organization and maintainability
* Easier to manage **transactions** across multiple services
#### Cons
* May require more classes and interfaces
* Can potentially lead to more complex dependency injection
### Multiple @Repositories
#### Pros
* Can **simplify** the service layer if operations frequently require data from multiple repositories
* Reduces the number of classes and interfaces
* May be more straightforward for simpler applications
#### ⠀Cons
* Can lead to a “fat” service class with too many responsibilities
* May make it **harder to maintain** and test the service class
* Could potentially **violate** the Single Responsibility Principle
### Considerations
Generally speaking, it’s often considered a good practice to follow **the first approach** (one @Repository and multiple @Services) for the following reasons:
* Better separation of concerns: Each service class can focus on a specific domain or set of related operations.
* Improved maintainability: Smaller, more focused classes are usually easier to understand and maintain.
* Easier testing: With more granular services, it’s easier to write unit tests and mock dependencies.
* Flexibility: It’s easier to reuse and combine services in different ways.
* Scalability: As your application grows, it’s easier to add new features or modify existing ones without affecting other parts of the system.

However, the best approach **depends on your specific use case**. If your application is small and simple, or if a particular service genuinely needs to work with multiple repositories directly, then referencing multiple repositories in a service class might be appropriate.

In conclusion, while referencing one @Repository and multiple @Services in a @Service class is often a good practice, the most important thing is to choose an approach that makes sense for your application’s architecture and maintainability goals.
##  Long or long
In Java, it’s **generally recommended** to use the primitive type long instead of the wrapper class Long in method signatures, unless you have a **specific reason** to use the object wrapper. Here’s why:
* **Performance**: Primitive types are more efficient in terms of memory usage and performance. They don’t require object creation or autoboxing/unboxing.
* **Simplicity**: Using primitives makes the code simpler and more straightforward.
* **Null safety**: Primitive types can’t be null, which can prevent null pointer exceptions.

However, there are cases where using Long might be preferable:
* When **null values are meaningful**: If you need to represent the absence of a value, Long can be null while long cannot.
* In **collections**: Java collections (like ArrayList or HashMap) require object types, so you’d use Long in these cases.
* When working with **generics**: Generics in Java don’t work with primitive types, so you’d need to use Long in these situations.
* In certain APIs or frameworks: Some APIs or frameworks might require the use of wrapper classes.
```java
// Preferred for most cases
public void methodWithLong(long value) {
    // ...
}

// Use when null is a meaningful value
public void methodWithLongObject(Long value) {
    if (value == null) {
        // Handle null case
    } else {
        // Handle non-null case
    }
}
```
In summary, use long by default for better performance and simplicity, but don’t hesitate to use Long when the situation calls for it, such as when dealing with nullable values or working with Java collections and generics.
## Check Or Not
### Checking existence before update
```java
if (repository.existsById(id)) {
    repository.save(entity);
} else {
    throw new EntityNotFoundException("Entity not found");
}
```
#### Pros
* Provides **more control** over the flow of your application.
* Allows you to give **more specific feedback** to the user (e.g., “User not found” instead of a generic error).
* Can be more efficient if you have **additional logic** that depends on the entity’s existence.
#### ⠀Cons
* Requires an additional database query, which can **impact performance**, especially in high-traffic scenarios.
* There’s a small chance of a **race condition** between the check and the update (though this is rare in most applications).
### Handling the update exception directly
```java
try {
    repository.save(entity);
} catch (EntityNotFoundException e) {
    // Handle the case where the entity doesn't exist
}
```
#### Pros
* More **straightforward** code, following the “it’s easier to ask forgiveness than permission” principle.
* Potentially more **efficient** as it avoids an extra database query.
* **Eliminates** the possibility of race conditions between checking and updating.
#### ⠀Cons
* **Less control** over the specific error message or handling.
* May **catch other unexpected exceptions** that you didn’t intend to handle in the same way.
### Recommendation
* For most simple CRUD operations, handling the exception directly is often sufficient and more efficient.
* Consider checking existence first if:
  * You need to provide very specific feedback to the user.
  * You have complex logic that depends on whether the entity exists or not.
  * You’re in a scenario where the extra database query doesn’t significantly impact performance.
* In **high-performance** systems with many updates, handling the exception might be preferable to avoid the extra query.
* If you’re using optimistic locking (e.g., with @Version), you might want to handle OptimisticLockingFailureException separately, as this indicates a concurrent modification rather than a non-existent entity.
* Consider your specific use case: if updates to non-existent entities are rare, handling the exception might be cleaner. If they’re common, checking first could provide a better user experience.
## Transactional on Repository Layer
By default, Spring Data JPA repository methods are transactional, but **only for read-only operations**. For modifying operations (like updates), you need to explicitly mark the method or the surrounding service method with @Transactional.
## Derived Query Method
In Spring Data JPA, derived query methods **are primarily used for retrieving data** rather than updating it. While derived query methods are very convenient for simple read operations, they do not support update operations directly.
## Malicious Use
When developing and deploying a REST API, it’s essential to consider both valid scenarios and potential malicious use cases. 
* **Security**: Ignoring potential malicious use can leave your API vulnerable to attacks such as SQL injection, Cross-Site Scripting (XSS), Distributed Denial of Service (DDoS), and others.
* **Stability**: Malicious uses can lead to unexpected behavior, crashes, or resource exhaustion, affecting the availability and reliability of your service.
* **Compliance**: Many industries have regulations requiring secure handling of data, which includes protecting against malicious use.
* **User Trust**: Users expect their data to be secure. Failing to protect against malicious use can damage your reputation and erode user trust.
## @AuthenticatedPrincipal Usage
### Passing the principal from the controller
#### Pros
* Makes the flow of data more explicit.
* Easier to **unit test** the service layer, as you can pass any principal object directly.
* Keeps the service layer completely **decoupled** from Spring Security.
#### Cons
* Requires passing the principal through **potentially many layers** if you have a deep call hierarchy.
* May lead to repetitive code in controllers if many endpoints need to pass the principal.
### Using@AuthenticatedPrincipal in the service layer
#### Pros
* Keeps the service method signature clean and focused on business logic parameters.
* **Reduces coupling** between the controller and service layer.
* Allows the service to be used in different contexts (e.g., scheduled tasks, message listeners) where a controller might not be involved.
#### Cons
* May make unit testing the service layer slightly **more complex**, as you need to mock the security context.
* Could be seen as **mixing concerns** if you consider authentication a cross-cutting concern.
### Recommendation
In general, using @AuthenticatedPrincipal in the service layer is often preferred because:
* It adheres to the Don’t Repeat Yourself (DRY) principle, avoiding the need to pass the principal in every controller method.
* It makes the service methods self-contained and more reusable in different contexts.
* It leverages Spring Security’s built-in capabilities, which are well-tested and maintained.
