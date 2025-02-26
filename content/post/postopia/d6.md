---
title: 【Postopia Dev Log】Day 6
date: 2024-07-12 00:00:00+0000
categories: 
    - moon
    - snow
tags:
    - Postopia
math: true
---
实现了创建空间和加入空间

调试接口的时候报：

failed to lazily initialize a collection of role: com.heslin.postopia.model.User.spaces: could not initialize proxy - no Session

检查之后发现 UsernamePasswordAuthenticationToken 在处理过程中会调用principal 的 toString方法，导致了这个错误，自己重载User.toString 之后恢复正常。
## Polymorphic Query
Check the corresponding post
## Java Enum
Check the corresponding post
## Pageable and Sort
Check the corresponding post
## @Query and JPQL
Check the corresponding post