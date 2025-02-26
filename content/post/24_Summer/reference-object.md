---
title: 【Spring Data JPA】Reference Object
date: 2024-07-18 00:00:00+0000
categories: 
    - nutrition
    - willow
tags:
    - Spring Data JPA
---
benefits:
* It’s more **efficient**, as it doesn’t require an additional database query to fetch the Space object.
* It’s particularly useful when you’re dealing with **large volumes of data** or when the related entity (Space in this case) has **a lot of fields** that you don’t need.

However, there are a few things to keep in mind:
* Make sure the Space with the given ID **actually exists** in the database. If it doesn’t, you’ll get a EntityNotFoundException when the entity is first accessed.
* This approach only works for **setting the relationship**. If you need to access properties of the Space object beyond its ID, you’ll need to fetch the full object from the database.
* Be aware of any **cascade operations** or other JPA settings that might affect this behavior.
##  `entityManager.getReference`
```java
@Autowired
private EntityManager entityManager;
//
Post newPost = new Post();
newPost.setTitle("New Post Title");
newPost.setContent("Post content...");

Space spaceReference = entityManager.getReference(Space.class, knownSpaceId);
newPost.setSpace(spaceReference);
postRepository.save(newPost);
```
### Pros
* **Type-safe**: It ensures the referenced entity type is correct.
* **JPA-compliant**: It’s the standard JPA way of creating entity references.
* **Lazy-loading**: The reference is a proxy that can lazy-load the full entity when needed.
* **Consistency**: It maintains consistency with how JPA handles entity relationships.
### Cons
* **Dependency**: It requires injecting EntityManager, which might not always be desirable or available.
* **Complexity**: It adds a bit more complexity to your code.
## Simple Reference Object
```java
Post newPost = new Post();
newPost.setTitle("New Post Title");
newPost.setContent("Post content...");

Space spaceReference = new Space();
spaceReference.setId(knownSpaceId);
newPost.setSpace(spaceReference);
postRepository.save(newPost);
```
### Pros
* 1 **Simplicity**: It’s straightforward and easy to understand.
* 2 **No additional dependencies**: It doesn’t require EntityManager.
* 3 **Lightweight**: It’s a very lightweight operation.
### Cons
* **Not type-safe**: You need to ensure you’re using the correct entity class and ID type.
* **Not a true JPA proxy**: It won’t lazy-load additional entity details if accessed.
* **Potential for inconsistency**: If not used carefully, it could lead to inconsistencies with how JPA manages entities.
## Guidelines
* If you’re working within a JPA/Hibernate context and have easy access to EntityManager, using EntityManager.getReference() is **generally the preferred** method. It’s more aligned with JPA standards and provides better integration with JPA’s entity management.
* If you’re working in a simpler context, perhaps in a **service layer** where you don’t want to introduce a dependency on EntityManager, using a simple reference object can be appropriate. This is especially true if you’re sure you won’t need to access any properties of the referenced entity beyond its ID.
* If you’re working on a large-scale application where **performance is critical**, and you’re dealing with a high volume of entities, the simple reference object might be slightly more efficient as it doesn’t create a proxy object.
* If you’re using Spring Data JPA repositories, you can also use the **getOne() method (deprecated in newer versions) or getReferenceById() method**, which internally use EntityManager.getReference().
* This approach combines the benefits of using EntityManager.getReference() with the convenience of working with repositories.
  ```java
  Space spaceReference = spaceRepository.getReferenceById(knownSpaceId);
  newPost.setSpace(spaceReference);
  ```
  This approach combines the benefits of using EntityManager.getReference() with the convenience of working with repositories.
* In general, if you’re working within a JPA environment, using EntityManager.getReference() or the repository’s getReferenceById() method is often the most **robust and recommended** approach. However, in simpler scenarios or where JPA is not heavily used, a simple reference object can be perfectly adequate.
## Lazy-loaded Reference
When using a lazy-loaded reference (like those created by EntityManager.getReference() or JpaRepository.getReferenceById()), the full entity will be lazy-loaded in the following scenarios:
### Accessing Non-ID Properties
When you try to access any property of the entity other than its ID, the full entity will be loaded from the database.
```java
Space spaceReference = entityManager.getReference(Space.class, spaceId);
String spaceName = spaceReference.getName(); // This will trigger lazy loading
```
### Invoking Methods
If you call any method on the proxy object that requires data from the entity, it will trigger lazy loading.
```java
Space spaceReference = entityManager.getReference(Space.class, spaceId);
spaceReference.someMethod(); // This will trigger lazy loading if the method uses any non-ID fields
```
### Relationship Navigation
If you navigate from the proxy to related entities (that are not already loaded), it will trigger lazy loading.
```java
Space spaceReference = entityManager.getReference(Space.class, spaceId);
List<Post> posts = spaceReference.getPosts(); // This will trigger lazy loading
```
### Explicit Initialization
If you explicitly initialize the proxy using Hibernate.initialize() or similar methods.
```java
Space spaceReference = entityManager.getReference(Space.class, spaceId);
Hibernate.initialize(spaceReference); // This will trigger lazy loading
```
### toString(), equals(), or hashCode()
If these methods are overridden in your entity class to use non-ID fields, calling them will trigger lazy loading.
```java
Space spaceReference = entityManager.getReference(Space.class, spaceId);
System.out.println(spaceReference); // This might trigger lazy loading if toString() is overridden
```
### Serialization
If you try to serialize the proxy object, it will typically trigger lazy loading to ensure all data is available for serialization.
### Important points
* Lazy loading will only work within an **active persistence context** (typically, within a transaction).
* If you try to access a lazy-loaded property outside of a persistence context, you might get a **LazyInitializationException**.
* The ID of the entity is **always available** without triggering a load, as it’s used to create the proxy.
* If the referenced entity doesn’t exist in the database, accessing it will throw an **EntityNotFoundException** when lazy loading is triggered.


