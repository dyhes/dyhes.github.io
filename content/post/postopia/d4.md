---
title: 【Postopia Dev Log】Day 4
date: 2024-07-10 00:00:00+0000
image: /covers/cover6.png
categories: 
    - moon
    - snow
tags:
    - Postopia
math: true
---
忙于构建个人博客，没有什么进展

## Knowledge
### Java Record
Java records were **introduced in Java 14** as a preview feature and became a s**tandard feature in Java 16**. They provide a compact syntax for declaring classes that are used primarily to store data. Records are designed to reduce boilerplate code and make it easier to create **simple, immutable** data carriers.
Syntax:
```java
public record Person(String name, int age) { }
```
Automatic generation:

* A constructor with parameters for all components

* Accessor methods for each component (e.g., name() and age())
* equals() and hashCode() methods
* toString() method
Immutability:
* Records are implicitly final and cannot be extended.
* The fields (components) of a record are final by default.
Constructors:
* You can define custom constructors, including compact constructors.
* A compact constructor doesn’t need to explicitly list all fields:

```java
public record Person(String name, int age) {
    public Person {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
    }
}
```
Additional methods:You can add other methods to a record, just like in a regular class.
Limitations:
* Records cannot extend other classes (they implicitly extend java.lang.Record).
* They cannot declare instance fields other than the private final fields for the components of the state description.
* They cannot be abstract.
### Internationalization
Internationalization (i18n) is typically handled on both the front end and the back end, but the approach and responsibilities can vary depending on the specific requirements of your application. 

In many modern web applications, the front end handles a significant portion of i18n, especially for single-page applications (SPAs) and client-heavy architectures. This approach allows for more responsive user experiences and reduces server load.

However, some aspects of i18n are better suited for the back end, particularly when dealing with sensitive data, complex business logic, or when you need to generate localized content server-side.

**Best practices**

Best practices often involve a combination of both:

Use front-end i18n libraries for UI elements and client-side formatting.
Implement back-end i18n for database content, emails, and API responses.
Use content delivery networks (CDNs) or static file hosting for language resource files.
Consider using a translation management system (TMS) to streamline the translation process.