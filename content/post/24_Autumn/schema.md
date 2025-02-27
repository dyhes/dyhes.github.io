---
title: 【Database】Schema
date: 2024-09-19 00:00:00+0000
categories: 
    - willow
---

## Database Schema

 DBMSs utilize an **internal schema**, which represents the structure of the data as viewed by the **DBMS**, and an **external** schema, which represents various structures of the data as viewed by the **end user**. The conceptual schema represents the basic underlying structure of data as viewed by the enterprise as a **whole**.



![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fe8cff73a38421af28ceba263a8661e6.png)

外模式

外模式又称子模式或用户模式，对应于用户级。它是某个或某几个用户所看到的数据库的数据视图，是与某一应用有关的数据的逻辑表示。外模式是从模式导出的一个子集，包含模式中允许特定用户使用的那部分数据。用户可以通过外模式描述语言来描述、定义对应于用户的数据记录(外模式)，也可以利用数据操纵语言(Data Manipulation Language，DML)对这些数据记录进行操作。外模式反映了数据库系统的**用户观**。 

概念模式 

概念模式又称模式或逻辑模式，对应于概念级。它是由数据库设计者综合所有用户的数据，按照统一的观点构造的全局逻辑结构，是对数据库中全部数据的逻辑结构和特征的总体描述，是所有用户的公共数据视图(全局视图)。它是由数据库管理系统提供的数据模式描述语言(Data Description Language，DDL)来描述、定义的。概念模式反映了数据库系统的**整体观**。 

内模式 

内模式又称存储模式，对应于物理级。它是数据库中全体数据的内部表示或底层描述，是数据库最低一级的逻辑描述，它描述了数据在存储介质上的存储方式和物理结构，对应着实际存储在外存储介质上的数据库。内模式由内模式描述语言来描述、定义的。内模式反映了数据库系统的**存储观**。 

在一个数据库系统中，只有唯一的数据库， 因而作为定义 、描述数据库存储结构的内模式和定义、描述数据库逻辑结构的模式，也是唯一的，但建立在数据库系统之上的应用则是非常广泛、多样的，所以对应的外模式不是唯一的，也不可能是唯一的。