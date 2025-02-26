---
title: 【Spring Data JPA】Polymophic Query
date: 2024-07-13 00:00:00+0000
categories: 
    - nutrition
    - willow
tags:
    - Spring Data JPA
---

## Inheritance type
### `InheritanceType.SINGLE_TABLE`
#### Pros
* Simplest to implement and typically offers **the best performance** for polymorphic queries.
* No join operations needed when querying the base class.
* Easy to add new subclasses without schema changes.
#### Cons
* All columns for all subclasses are in one table, which can lead to **many nullable columns**.
* The table can become **very wide** if there are many subclasses or attributes.
* Potential for **wasted space** in the database.
### `InheritanceType.TABLE_PER_CLASS`
#### Pros
* Each entity has its own table, which can be more **intuitive**.
* **Easy to add new attributes** to subclasses without affecting other classes.
* Good for cases where subclasses **have many unique attributes**.
#### Cons
* Polymorphic queries can be **inefficient**, often requiring UNION operations.
* **Redundant storage** of common attributes across tables.
* **Not well supported** by all JPA providers.
### `InheritanceType.JOINED`
#### Pros
* Normalized database design with minimal data redundancy.
* Flexible for adding new subclasses or attributes.
* **Good balance** between normalization and performance.
#### Cons
* Requires joins for polymorphic queries, which can **impact performance**.
* Inserts and updates may affect multiple tables.
* More complex queries compared to SINGLE_TABLE.
## General consideration
* SINGLE_TABLE is often the **default choice** due to its simplicity and performance.
* JOINED is a good choice when you need a **more normalized** database structure.
* TABLE_PER_CLASS can be useful in specific scenarios but is **often avoided** due to performance concerns with polymorphic queries.
* The choice often depends on your specific use case, the number of subclasses, how often you perform polymorphic queries, and your database design preferences.
