---
title: 【Spring Data JPA】Database Exception
date: 2024-07-18 00:00:00+0000
categories: 
    - nutrition
    - willow
tags:
    - Spring Data JPA
---
## EmptyResultDataAccessException
### deleteById(ID id)
* Using deleteById(ID id) with @Transactional: If the method is annotated with @Transactional, it might throw an EmptyResultDataAccessException if the entity doesn’t exist.
* Using deleteById(ID id): This method doesn’t throw an exception if the entity doesn’t exist. It **silently does nothing**.
