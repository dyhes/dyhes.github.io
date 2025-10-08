---
title: 【NowCoder】Mybatis 2
date: 2025-10-04 00:00:00+0000
categories: [arts]
tags: [NowCoder]
---

## #{} 和 ${}

MyBatis 中的 `#{}`和 `${}`是用于动态 SQL 参数处理的两种重要语法，它们在处理方式、安全性和适用场景上有本质区别。下面这个表格清晰地展示了它们的核心差异。

| 对比维度         | `#{}`(**预编译占位符**)                                      | `${}`(**字符串拼接符**)                          |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| **处理机制**     | 参数化查询，生成预编译语句 (`PreparedStatement`)             | 直接字符串替换，生成静态语句 (`Statement`)       |
| **安全性**       | **安全**，天然防止 SQL 注入                                  | **不安全**，存在 SQL 注入风险，需手动校验        |
| **性能**         | **高**，预编译 SQL 可缓存和复用执行计划                      | **低**，每次生成新 SQL，需重新编译               |
| **引号处理**     | 自动根据参数类型添加或省略引号（如字符串加单引号，数字不加） | 直接替换，不处理引号，需手动添加                 |
| **主要应用场景** | 传入 **参数值**（WHERE 条件值、INSERT/UPDATE 值等）          | 动态 **SQL 片段**（表名、列名、ORDER BY 子句等） |

### 💡 使用场景与最佳实践

理解区别的关键在于明确它们各自的适用场景。

- **优先使用 `#{}`的场景**

  所有由用户输入或外部传入的 **值** 都应使用 `#{}`。这是保证应用安全的第一原则。常见场景包括：

  - **WHERE 条件中的值**：`WHERE username = #{name}`
  - **INSERT/UPDATE 语句中的值**：`VALUES - **LIKE 模糊查询的值**：虽然有时会看到`LIKE '%${value}%'`，但这非常危险。安全做法是在 Java 代码中拼接好通配符`String nameParam = "%" + name + "%";`，然后传入`LIKE #{nameParam}`，或使用 SQL 函数`LIKE CONCAT('%', #{name}, '%')`。

- **不得已使用 `${}`的场景**

  当需要动态改变 SQL 语句的 **结构部分**，而这些部分（如表名、列名）无法作为预编译参数时，才考虑使用 `${}`。使用时 **必须** 对参数值进行严格的白名单校验。

  - **动态表名/列名**：在分表场景中，如 `SELECT * FROM ${tableName}`。
  - **ORDER BY 排序字段**：如 `ORDER BY ${sortField} ${sortOrder}`。更安全的做法是用 `<choose>`指令枚举可选字段。
  - **批量删除的 IN 语句**：`DELETE FROM t_car WHERE id IN(${ids})`，因为 `#{}`会将整个 ID 序列视为一个带引号的字符串导致语法错误。

### 🔒 安全警示：SQL注入风险详解

这是两者最核心的区别，值得深入理解。

- **`#{}`为何安全？**

  它采用 **预编译** 机制。MyBatis 会先将 `#{}`解析为 JDBC 的 `?`占位符，SQL 语句结构先被确定。随后参数值通过 `PreparedStatement`的 `setXxx`方法传入，数据库驱动会负责对值进行正确的转义和处理，从根本上杜绝了注入。

- **`${}`为何危险？**

  它只是简单的 **字符串拼接**。假设有一条 SQL：`SELECT * FROM users WHERE name = '${name}'`。如果用户输入的 `name`值是 `' OR '1'='1`，拼接后的 SQL 将变为：

  ```
  SELECT * FROM users WHERE name = '' OR '1'='1'
  ```

  这条语句会返回所有用户数据，造成严重的信息泄露。如果参数用于表名等场景，攻击者甚至可能执行删表等破坏性操作。

### 💎 总结

在选择使用 `#{}`还是 `${}`时，请遵循以下原则：

1. **默认使用 `#{}`**：对于所有传入 **值** 的场景，这是唯一安全的选择。
2. **谨慎评估 `${}`**：仅在需要动态改变 SQL **关键字或结构**（表名、列名、排序）时使用。
3. **安全第一**：使用 `${}`时，必须对传入的参数值进行 **白名单验证**，绝不直接将不可信的用户输入拼接到 SQL 中。

希望这份详细的对比能帮助你更安全、高效地使用 MyBatis。如果你有关于特定使用场景的疑问，我们可以继续探讨。

## 缓存

MyBatis 的缓存机制是提升数据库交互性能的核心特性，它通过两级缓存有效减少数据库访问压力。下面这个表格清晰地展示了其核心构成与区别。

| 特性维度     | 一级缓存                                | 二级缓存                                        |
| ------------ | --------------------------------------- | ----------------------------------------------- |
| **作用范围** | `SqlSession`级别（同一数据库会话）      | `Mapper`级别（同一命名空间，跨 `SqlSession`）   |
| **开启方式** | **默认开启**，无需配置                  | 需在全局配置和具体 `Mapper.xml`中**手动开启**   |
| **生命周期** | 与 `SqlSession`绑定，会话关闭则缓存失效 | 与整个应用绑定，生命周期更长                    |
| **数据共享** | **隔离**，不同 `SqlSession`缓存不共享   | **共享**，多个 `SqlSession`可访问同一缓存       |
| **存储结构** | 基于 `HashMap`的 `PerpetualCache`       | 可扩展，支持集成第三方缓存（如 EhCache, Redis） |

### 💾 一级缓存：会话级加速

一级缓存是 MyBatis 默认提供的，其设计目标是优化同一数据库会话内的重复查询。

- **工作流程与生命周期**：当你执行一次查询时，MyBatis 会为这条查询语句（结合参数等因素）生成一个唯一的键（Key），并将查询结果作为值（Value）存入当前 `SqlSession`内部的缓存映射（Map）中。此后，在同一会话中执行完全相同的查询时，MyBatis 会直接从这个映射中返回结果，而无需再次访问数据库。一级缓存的生命周期与 `SqlSession`紧密绑定，当会话通过 `close()`方法关闭时，缓存也随之销毁。
- **缓存失效时机**：为确保数据的一致性，在执行 `INSERT`、`UPDATE`、`DELETE`等数据变更操作，或调用 `commit()`、`rollback()`方法，以及显式调用 `sqlSession.clearCache()`时，当前 `SqlSession`的一级缓存会被**清空**。

### 🌐 二级缓存：应用级共享

二级缓存的作用域更广，旨在跨会话共享常用数据，适合应用级别的高频只读数据缓存。

- **启用与配置**：启用二级缓存需要两步：
  1. 在 MyBatis 全局配置文件（如 `mybatis-config.xml`）中确保 `<setting name="cacheEnabled" value="true"/>`（新版本通常默认开启）。
  2. 在需要启用二级缓存的特定 `Mapper.xml`文件中添加 `<cache/>`标签。你可以在此标签中配置详细的缓存策略，例如 `eviction`（回收策略，如 LRU、FIFO）、`flushInterval`（自动刷新间隔）、`size`（缓存引用数目）和 `readOnly`（是否只读）等。
- **工作机制与序列化要求**：二级缓存的工作机制可以概括为：一个 `SqlSession`查询数据后，在它被关闭或提交时，查询结果会从其一级缓存**转存**到对应的二级缓存区域（以 Mapper 的命名空间划分）。由于这些数据可能需要被序列化到磁盘或在不同会话间传输，因此对应的 Java 实体类**必须实现 `Serializable`接口**。
- **缓存同步与清空**：当执行同命名空间下的增、删、改操作并提交事务后，MyBatis 会自动**清空**该命名空间下的二级缓存，以防止出现脏读。

### 🔄 缓存协同工作原理与顺序

当同时启用一级和二级缓存时，MyBatis 处理一条查询请求的顺序遵循一个标准的查询流程，如下图所示：

```
flowchart TD
    A[执行查询请求] --> B{二级缓存<br>是否命中？}
    B -- 命中 --> C[直接返回数据]
    B -- 未命中 --> D{一级缓存<br>是否命中？}
    D -- 命中 --> E[返回数据至二级缓存]
    D -- 未命中 --> F[查询数据库]
    F --> G[数据存入一级缓存]
    G --> E
    E --> C
```

需要注意的是，在 Spring Boot 等集成环境中，由于 `SqlSession`的生命周期可能受事务管理器影响，一级缓存的行为可能会有所不同。

### 💡 实践建议与常见问题

- **适用场景**：
  - **一级缓存**：最适合于会话内短期内重复查询相同数据的操作。
  - **二级缓存**：非常适合读多写少、对数据实时性要求不高的数据，例如系统配置项、静态字典表等。
- **数据一致性挑战**：二级缓存的主要挑战在于数据一致性。由于缓存是以 `namespace`（命名空间）为粒度管理的，对表中任何数据的修改都会导致整个命名空间的缓存失效。这在关联查询复杂的场景下可能导致大范围的缓存清空，需要谨慎设计。
- **自定义缓存集成**：MyBatis 的缓存接口是开放的，允许你轻松集成更强大、更适合生产环境的第三方缓存库，如 **Redis**（用于分布式缓存）或 **EhCache**（功能丰富的本地缓存）来替代默认实现。这为应对高并发和分布式场景提供了灵活性。

希望这份详细的介绍能帮助你更好地理解和使用 MyBatis 缓存。如果你对某个特定细节有进一步疑问，我们可以继续深入探讨。

## 缓存层级

MyBatis缓存和Spring Cache是不同层面的缓存解决方案，它们的核心区别在于作用范围和抽象层级。下面这个表格能帮你快速把握它们的核心差异。

| 特性维度       | **MyBatis缓存** (持久层缓存)                                 | **Spring Cache** (应用层缓存抽象)                            |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **核心定位**   | **ORM框架内部缓存**，专注于缓存SQL查询结果，减少数据库访问   | **缓存抽象框架**，提供统一的注解和API，屏蔽不同缓存实现（如Redis、Ehcache）的差异 |
| **作用层级**   | **持久层（DAO层）**，与`SqlSession`和`Mapper`紧密绑定        | **业务层（Service层）**，用于缓存方法执行结果                |
| **缓存粒度**   | **SQL级别**，以查询语句和参数为键缓存结果集                  | **方法级别**，以方法名和参数为键缓存返回值                   |
| **数据共享**   | **一级缓存**：`SqlSession`内共享；**二级缓存**：`Mapper`命名空间内共享 | 取决于底层缓存实现（如Redis可跨应用共享，Caffeine则本地使用） |
| **数据一致性** | 与数据库操作天然联动，执行同命名空间的增删改操作会自动清空相关缓存 | 需手动配置（如使用`@CacheEvict`注解），框架无法自动感知数据变更 |

### 💡 如何选择与协同使用

理解区别后，关键在于根据你的业务场景做出合适的选择。

- **优先使用 MyBatis 缓存的场景**

  - **高频静态数据查询**：非常适合缓存变化极少的数据，例如**字典表、配置信息、城市列表**等。这些数据读多写少，使用MyBatis二级缓存能极大降低数据库压力。
  - **简单的单表查询**：对于关联关系简单的查询，开启二级缓存能获得很好的性能提升，且不易出现脏数据。
  - **⚠️ 注意事项**：MyBatis默认的二级缓存是**本地缓存**，在分布式环境下会存在数据不一致问题。生产环境建议通过`<cache type="...">`配置集成**Redis**或**Ehcache**等分布式/集中式缓存实现。

- **优先使用 Spring Cache 的场景**

  - **缓存业务计算结果**：当某个Service方法需要进行复杂计算（如数据分析、报表生成），但其结果在一段时间内可复用时，使用`@Cacheable`非常合适。
  - **调用外部API或复杂查询**：如果方法内部需要调用耗时的第三方接口，或者组合多个DAO查询得到一个复杂结果，缓存整个方法的返回值比只缓存单个DAO查询更高效。
  - **更灵活的缓存控制**：Spring Cache的`unless`、`condition`等属性允许你根据返回值或参数动态决定是否缓存，控制粒度更细。

- **两者协同工作**

  在实际项目中，MyBatis缓存和Spring Cache完全可以协同工作，形成多级缓存，进一步提升性能。其协同工作的流程如下图所示：

```
flowchart TD
    A[业务方法调用] --> B{Spring Cache<br>是否命中?}
    B -- 命中 --> C[直接返回结果]
    B -- 未命中 --> D[执行方法内部逻辑]
    D --> E[调用Mapper方法进行查询]
    E --> F{MyBatis二级缓存<br>是否命中?}
    F -- 命中 --> G[返回查询结果]
    F -- 未命中 --> H{MyBatis一级缓存<br>是否命中?}
    H -- 命中 --> G
    H -- 未命中 --> I[查询数据库]
    I --> G
    G --> J[结果返回至业务方法]
    J --> K[结果存入Spring Cache]
    K --> C
```

举个例子，一个获取商品详情的方法可能内部调用了多个Mapper来组合信息（商品基本信息、SKU列表、商家信息）。你可以：

1. 使用**MyBatis二级缓存**来缓存每个Mapper各自的简单查询结果。

2. 使用**Spring Cache**来缓存整个商品详情方法返回的复杂聚合对象。

   这样，当商品基本信息未变，但SKU列表变化时，MyBatis缓存可能局部失效，而Spring Cache整体失效，策略清晰。

### ⚠️ 使用缓存的通用注意事项

- **数据一致性**：这是缓存带来的最大挑战。务必根据业务需求为缓存设置合理的过期时间。
- **缓存穿透/击穿/雪崩**：针对这些典型问题，需要采取相应措施，如为不存在的`key`也设置空值、使用互斥锁、设置不同的过期时间等。
- **内存管理**：特别是对于本地缓存，要设置合适的大小和淘汰策略（如LRU），防止内存溢出。

### 💎 总结

简单来说，**MyBatis缓存是数据访问层的“精细化”缓存，而Spring Cache是业务层的“粗粒度”缓存抽象**。

- 如果你的优化目标是**减少重复的数据库查询**，特别是简单的、静态的数据查询，应优先考虑**MyBatis缓存**，尤其是搭配Redis等实现的二级缓存。
- 如果你需要缓存的是**复杂的业务逻辑计算结果**，或者希望有一个**统一、灵活、与底层缓存技术无关**的缓存方式，那么**Spring Cache**是更佳选择。

在很多现代应用中，一种常见的高效模式是：**利用MyBatis（整合Redis）处理DAO层的SQL结果缓存，同时使用Spring Cache处理Service层的业务方法缓存**，两者互补，共同构建高性能的应用架构。

希望这份详细的对比能帮助你做出更合适的技术决策。

## Spring DATA JPA 缓存

Spring Data JPA 的缓存机制是提升应用性能的重要特性，它通过多级缓存减少数据库访问。下面这个表格清晰地展示了其核心的**三级缓存结构**及其关键特点。

| 特性维度     | **一级缓存** (Session缓存)                 | **二级缓存** (SessionFactory缓存)           | **查询缓存**                                   |
| ------------ | ------------------------------------------ | ------------------------------------------- | ---------------------------------------------- |
| **作用范围** | 单个 `EntityManager`(或事务) 内部          | 应用级别，跨 `EntityManager`共享            | 应用级别，缓存特定查询的结果列表               |
| **开启方式** | **默认开启**，无需配置                     | 需**手动开启**并配置缓存提供商（如EhCache） | 需**手动开启**并在查询方法上使用 `@QueryHints` |
| **缓存内容** | 实体对象                                   | 实体对象                                    | 查询语句和参数组合的结果集ID列表               |
| **生命周期** | 与 `EntityManager`绑定，会话结束则缓存失效 | 与应用同生命周期，直到缓存过期或被驱逐      | 依赖于缓存配置，可在数据变更时失效             |
| **数据共享** | **隔离**，无法跨会话共享                   | **共享**，所有会话可访问                    | **共享**，所有会话可访问                       |

### 💾 深入理解各级缓存

#### 一级缓存（Session级别）

一级缓存是Hibernate（JPA的默认实现）内置的，其生命周期与一个`EntityManager`（大致对应一个数据库会话或事务）绑定。

- **工作机制**：在同一会话中，首次根据ID查询某个实体时，数据会从数据库加载并存入一级缓存。后续再次根据相同ID查询时，会直接返回缓存中的同一对象实例（`==`判断为true）。
- **失效与清空**：当执行`em.flush()`、事务提交或调用`em.clear()`时，一级缓存会被清空。执行更新操作后，Hibernate会保证缓存与数据库的同步。

#### 二级缓存（应用级别）

二级缓存是进程或集群范围内的缓存，需要显式开启并配置。

- **启用步骤**：
  1. **添加依赖**：如`hibernate-ehcache`（如果使用EhCache）。
  2. **配置启用**：在`application.properties`中设置`spring.jpa.properties.hibernate.cache.use_second_level_cache=true`并指定缓存区域工厂（如`EhCacheRegionFactory`）。
  3. **标记可缓存实体**：在实体类上添加`@Cacheable`和`@org.hibernate.annotations.Cache`注解来定义缓存策略（如`READ_ONLY`）。
- **配置示例**：在`ehcache.xml`中可以为不同实体配置详细的缓存策略，例如过期时间、内存中最大对象数量等。

#### 查询缓存

查询缓存用于缓存查询结果列表（如`List<User>`），适用于不常变化的列表数据。

- **启用与使用**：
  1. 全局启用：设置`spring.jpa.properties.hibernate.cache.use_query_cache=true`。
  2. 在查询方法上添加提示：在Repository的自定义查询方法上使用`@QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))`。
- **注意**：查询缓存仅缓存查询结果的主键ID列表。真正的实体对象仍由二级缓存存储，或按需从数据库加载。

### ⚠️ 缓存的挑战与最佳实践

使用缓存能提升性能，也带来一些挑战，需注意以下几点：

- **数据一致性**：这是核心挑战。二级缓存和查询缓存可能导致**脏读**，即缓存数据与数据库实际数据不一致。解决方案包括：
  - 在写入、更新或删除数据时，通过`@CacheEvict`等注解**手动清除相关缓存**。
  - 为缓存数据设置合理的**过期时间**。
- **事务与延迟提交**：在事务中，数据的最终提交可能延迟到事务结束时。在此之前，数据库的约束检查可能不会立即触发，使用`save`方法后立即进行其他操作需留意。必要时可使用`saveAndFlush`方法立即同步。
- **适用场景**：缓存最适合**读多写少**、**数据实时性要求不高**的场景（如系统菜单、配置项）。对于**写操作频繁**或**对数据强一致性要求极高**的场景，需谨慎使用或考虑禁用缓存。

### 💡 在Spring Boot中配置二级缓存

在Spring Boot项目中，可以按以下步骤启用和配置二级缓存：

1. **添加依赖**（以EhCache为例）：

   ```
   <dependency>
       <groupId>org.hibernate</groupId>
       <artifactId>hibernate-ehcache</artifactId>
   </dependency>
   <dependency>
       <groupId>net.sf.ehcache</groupId>
       <artifactId>ehcache</artifactId>
   </dependency>
   ```

2. **配置`application.properties`**：

   ```
   spring.jpa.properties.hibernate.cache.use_second_level_cache=true
   spring.jpa.properties.hibernate.cache.region.factory_class=org.hibernate.cache.ehcache.EhCacheRegionFactory
   # 指定EhCache配置文件路径（如果需要）
   spring.jpa.properties.hibernate.cache.provider_configuration_file_resource_path=ehcache.xml
   ```

3. **实体类配置**：

   ```
   @Entity
   @Cacheable
   @Cache(usage = CacheConcurrencyStrategy.READ_ONLY) // 例如只读策略
   public class User {
       // ... 字段定义
   }
   ```

希望这份详细的梳理能帮助你更好地理解和应用Spring Data JPA的缓存机制。如果你对某个特定细节有进一步的疑问，我们可以继续探讨。

## Mybatis Plus

| **特性**           | **MyBatis**                      | **MyBatis-Plus**                                     |
| :----------------- | :------------------------------- | :--------------------------------------------------- |
| **SQL 编写**       | 需手动编写所有 SQL（XML 或注解） | 内置通用 CRUD，单表操作无需写 SQL                    |
| **条件构造器**     | 不支持，需手写动态 SQL           | 提供QueryWrapper、LambdaQueryWrapper等，支持链式调用 |
| **代码生成**       | 无内置支持                       | 内置代码生成器，可快速生成 Model、Mapper 等层代码    |
| **Lambda 支持**    | 不支持                           | 支持 Lambda 表达式，避免硬编码字段名                 |
| **主键策略**       | 需手动配置                       | 支持 4 种主键策略（含分布式 ID 生成器）              |
| **分页插件**       | 需手动实现或集成第三方插件       | 内置物理分页插件，简化分页逻辑                       |
| **SQL 注入防护**   | 依赖开发者使用#{}占位符          | 内置 SQL 注入剥离器，自动过滤危险字符                |
| **实体映射注解**   | 需手动配置 XML 映射              | 支持@TableName、@TableId等注解，简化表与字段映射     |
| **全局拦截与插件** | 需自定义拦截器                   | 内置全局拦截插件（如防全表删除/更新）                |
| **性能优化**       | 依赖手动优化 SQL                 | 支持批量操作、二级缓存等优化                         |

| **场景**                | **推荐框架** | **理由**                                  |
| :---------------------- | :----------- | :---------------------------------------- |
| **复杂 SQL 或存储过程** | MyBatis      | 灵活控制 SQL，适合对 SQL 性能要求高的场景 |
| **快速开发单表 CRUD**   | MyBatis-Plus | 内置通用方法，减少重复代码                |
| **微服务或分布式项目**  | MyBatis-Plus | 支持分布式 ID、批量操作等优化             |
| **需要高度定制化**      | MyBatis      | 原生 MyBatis 更灵活，无额外约束           |

## 动态 sql

MyBatis 的动态 SQL 是一项强大而实用的功能，它允许你在 XML 映射文件中，根据运行时条件灵活地构建 SQL 语句，完美解决了传统 JDBC 开发中需要手动拼接 SQL 字符串的繁琐和安全隐患。

下面这个表格汇总了 MyBatis 核心的动态 SQL 标签，帮你快速掌握它们的用途。

| 标签名                            | 核心作用                                              | 关键适用场景                                           |
| --------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| **`<if>`**                        | 条件判断，根据表达式结果决定是否包含SQL片段           | 可选字段的查询条件、更新操作                           |
| **`<choose>/<when>/<otherwise>`** | 多路选择，类似 Java 的 `switch-case`语句              | 多条件互斥，只需满足其中一个的场景                     |
| **`<where>`**                     | 智能处理 `WHERE`子句，自动添加/移除关键字             | 包裹多个条件查询，避免 `WHERE`后直接跟 `AND`等语法错误 |
| **`<set>`**                       | 智能处理 `UPDATE`语句中的 `SET`子句，自动去除多余逗号 | 动态更新非空字段，实现部分更新                         |
| **`<foreach>`**                   | 遍历集合（如 List、数组），拼接SQL片段                | **IN** 查询、批量插入、批量删除等                      |
| **`<trim>`**                      | 自定义修剪SQL语句的前后缀，功能更灵活                 | 可替代 `<where>`或 `<set>`，处理更复杂的字符串修剪需求 |

### 💡 核心标签详解与最佳实践

掌握每个标签的具体用法和细节，是写出稳健、高效动态 SQL 的关键。

#### **1. `<if>`标签：基础的条件判断**

`<if>`标签是最基础、最常用的标签，通过 `test`属性指定一个 OGNL 表达式进行条件判断。

```
<select id="findUsers" resultType="User">
  SELECT * FROM users
  <where>
    <if test="username != null and username != ''">
      AND username LIKE CONCAT('%', #{username}, '%')
    </if>
    <if test="status != null">
      AND status = #{status}
    </if>
  </where>
</select>
```

**最佳实践**：将 `<if>`标签包裹在 `<where>`标签内，可以自动处理可能产生的多余 `AND`或 `OR`关键字，无需再写 `WHERE 1=1`。

#### **2. `<choose>`标签组：实现多路分支**

当你的业务逻辑是“多选一”时，`<choose>`标签组比一连串的 `<if>`标签更清晰。

```
<select id="findUserByPriority" resultType="User">
  SELECT * FROM users
  <where>
    <choose>
      <!-- 优先级1: 优先用id精确查找 -->
      <when test="id != null">
        id = #{id}
      </when>
      <!-- 优先级2: 其次用用户名模糊匹配 -->
      <when test="username != null and username != ''">
        username LIKE CONCAT('%', #{username}, '%')
      </when>
      <!-- 默认情况: 查询活跃用户 -->
      <otherwise>
        status = 'ACTIVE'
      </otherwise>
    </choose>
  </where>
</select>
```

**注意**：`<choose>`结构内，一旦某个 `<when>`的条件满足，就会执行其SQL片段，并且跳过其余分支。

#### **3. `<set>`标签：优雅的动态更新**

`<set>`标签专用于 `UPDATE`语句，能够智能地处理 `SET`子句末尾可能因 `<if>`条件不成立而产生的多余逗号。

```
<update id="updateUser" parameterType="User">
  UPDATE user
  <set>
    <if test="username != null">
      username = #{username},
    </if>
    <if test="age != null">
      age = #{age},
    </if>
    <if test="email != null">
      email = #{email},
    </if>
  </set>
  WHERE id = #{id}
</update>
```

**风险提示**：务必确保至少有一个更新字段不为空，否则会生成 `UPDATE user SET WHERE id=?`的错误SQL。通常会在业务层进行校验。

#### **4. `<foreach>`标签：处理集合操作**

`<foreach>`标签功能强大，常用于 **IN** 查询和批量操作。其属性配置是关键：

- `collection`: 指定要遍历的集合参数名。如果接口方法参数是 `List`，默认名为 `list`；是数组，默认名为 `array`。推荐使用 `@Param`注解明确命名。
- `item`: 循环中当前元素的变量名。
- `open`/`close`: 循环内容包装的前缀和后缀符号。
- `separator`: 各元素间的分隔符。

**批量 IN 查询示例**：

```
<select id="selectUserByIds" resultType="User">
  SELECT * FROM user 
  WHERE id IN
  <foreach collection="idList" item="id" open="(" close=")" separator=",">
    #{id}
  </foreach>
</select>
```

**批量插入示例**：

```
<insert id="batchInsert">
  INSERT INTO user (name, age) VALUES
  <foreach collection="userList" item="user" separator=",">
    (#{user.name}, #{user.age})
  </foreach>
</insert>
```

#### **5. `<trim>`标签：更灵活的字符串修剪**

`<trim>`标签是一个多功能标签，可以自定义地添加前缀、后缀，并覆盖（移除）不必要的前后缀，用它可以实现 `<where>`和 `<set>`的功能。

**用 `<trim>`模拟 `<where>`标签**：

```
<trim prefix="WHERE" prefixOverrides="AND |OR ">
  ...
</trim>
```

**用 `<trim>`模拟 `<set>`标签**：

```
<trim prefix="SET" suffixOverrides=",">
  ...
</trim>
```

### ⚠️ 核心优势与使用建议

1. **根本优势**：动态 SQL 最大的价值在于**减少代码冗余**。一个动态 SQL 模板可以替代传统 JDBC 中需要为不同条件组合编写的多个 SQL 变体，极大提高了灵活性和可维护性。
2. **安全基石**：MyBatis 动态 SQL 与 `#{}`参数占位符紧密结合，所有参数都通过预编译处理，从根本上**防止了 SQL 注入攻击**，切勿使用 `${}`进行字符串拼接。
3. **性能考量**：虽然动态 SQL 带来了灵活性，但过于复杂的动态 SQL 可能会影响 SQL 优化器的索引选择。建议结合数据库的 **`EXPLAIN`** 命令对生成的实际 SQL 进行性能分析。

希望这份详细的介绍能帮助你深入理解并有效运用 MyBatis 的动态 SQL。如果你在具体实践中有任何疑问，欢迎随时提出。

## 底层原理

MyBatis 是一款优秀的半自动化 ORM 框架，其核心价值在于将 Java 对象与数据库操作灵活地关联起来，同时将开发者从繁琐的 JDBC 代码中解放出来。为了让你对 MyBatis 的底层原理有一个全局的认识，我们先通过下面这张图来了解其核心架构和一次 SQL 执行的完整流程。

```
flowchart TD
    A[配置文件<br>mybatis-config.xml] --> B(Configuration<br>配置中心)
    C[Mapper文件<br>Mapper.xml] --> B
    B --> D[SqlSessionFactory<br>会话工厂]
    D --> E[SqlSession<br>会话接口]
    E --> F[Executor<br>执行器]
    F --> G[MappedStatement<br>SQL封装]
    G --> H[StatementHandler<br>语句处理器]
    H --> I[ParameterHandler<br>参数处理器]
    I --> J[(Database)]
    J --> K[ResultSetHandler<br>结果集处理器]
    K --> L[Result Object<br>结果对象]
    L --> E
```

上图清晰地展示了 MyBatis 内部各核心组件的协作关系。下面，我们来详细解析图中的每一步，特别是这些核心组件各自扮演的角色。

### 🔎 核心组件深度解析

1. **SqlSessionFactory 与 SqlSession**

   - **SqlSessionFactory** 是 MyBatis 的“会话工厂”，其职责是创建 `SqlSession`。它是线程安全的，通常在应用生命周期内只有一个实例（单例），通过 `SqlSessionFactoryBuilder`解析全局配置文件（`mybatis-config.xml`）构建而成。所有配置信息最终都被封装到一个全局的 `Configuration`对象中。
   - **SqlSession** 是 MyBatis 最顶层的面向用户的 API，代表了一次与数据库的会话。它提供了 `selectOne`, `insert`等方法。**注意：** `SqlSession`的实例是**非线程安全**的，因此其生命周期应局限于方法或请求内部，使用完毕后必须正确关闭。

2. **Executor – 执行引擎**

   `SqlSession`本身并不直接执行 SQL，而是将工作委托给 **Executor**（执行器）。它是 MyBatis 的调度核心，主要负责：

   - **SQL 执行**：调用底层数据库操作。
   - **缓存管理**：维护**一级缓存**（默认开启，作用于同一个 `SqlSession`生命周期）和**二级缓存**（需手动开启，作用于 `SqlSessionFactory`级别，可跨会话共享）。上图所示的执行流程，在 `Executor`层面会优先查询缓存。

3. **MappedStatement – SQL 指令库**

   它是对 Mapper XML 文件中一个 SQL 语句（如 `<select>`标签）的完整封装。`Executor`执行时，会根据语句的 ID 从 `Configuration`中获取对应的 `MappedStatement`，其中包含了 SQL 源码、输入输出参数类型、缓存策略等所有元信息。

4. **StatementHandler – SQL 语句操作员**

   `Executor`会将具体的数据库操作交给 **StatementHandler**。它是对 JDBC `Statement`的直接封装，负责：

   - 向数据库发起调用，执行 SQL。
   - 创建 `ParameterHandler`和 `ResultSetHandler`来处理参数和结果。

5. **ParameterHandler 与 ResultSetHandler – 数据转换专家**

   - **ParameterHandler**：负责将传入的 Java 对象参数，按照规则转换成 JDBC `PreparedStatement`所需的参数值（例如，将 `java.util.Date`转换为 `java.sql.Timestamp`）。
   - **ResultSetHandler**：负责将 JDBC 返回的 `ResultSet`结果集转换为 Java 对象（如 `List<User>`）。这是 MyBatis ORM 魔力的最终体现。

### ⚙️ 动态 SQL 的解析魔法

MyBatis 的强大之处在于其动态 SQL 能力。它允许在 XML 中编写包含条件判断、循环等逻辑的 SQL 语句。这个过程主要由 `SqlSource`和 `SqlNode`协作完成：

- **拼接阶段**：MyBatis 会将 XML 中的 SQL 标签（如 `<if>`, `<foreach>`）和文本解析成一棵由 **SqlNode** 组成的语法树。执行时，根据传入的参数，遍历这棵树动态地拼接出最终的 SQL 字符串（此阶段会处理 `${}`和动态标签）。
- **解析阶段**：拼接好的 SQL 字符串（此时 `#{}`仍保留）会被传递给 **SqlSource**，它负责将 `#{}`解析为 JDBC 的 `?`占位符，并生成包含 SQL 和参数映射信息的 `BoundSql`对象，供 `StatementHandler`使用。

### 💡 总结与价值

通过以上的剖析，我们可以看到 MyBatis 底层原理的精髓在于：**通过清晰的分层和组件化设计，将复杂的 JDBC 操作标准化、模块化**。它不仅保留了 JDBC 的性能优势和对 SQL 的精准控制力，还通过动态 SQL、类型处理器、插件等机制提供了极大的灵活性和扩展性。

希望这份详细的介绍能帮助你深入理解 MyBatis 的工作机制。如果你对某个特定细节还有疑问，我们可以继续探讨。

## Mybatis 插件

MyBatis 插件是其框架提供的一种强大扩展机制，允许你在不修改核心代码的情况下，拦截并增强 MyBatis 内部核心组件的行为，从而实现自定义功能。下面通过一个表格快速了解其核心组件和拦截点：

| 核心组件               | 角色描述                                                     | 可拦截的关键方法示例                                  |
| ---------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| **`Executor`**         | SQL 执行的“发动机”，负责增删改查操作及事务管理。             | `update`, `query`, `commit`, `rollback`               |
| **`StatementHandler`** | 处理 JDBC `Statement`的“翻译官”，负责 SQL 预编译和参数设置。 | `prepare`, `parameterize`, `batch`, `update`, `query` |
| **`ParameterHandler`** | 给 SQL 语句“喂参数”的“小助手”，将 Java 对象转换为 JDBC 参数。 | `setParameters`, `getParameterObject`                 |
| **`ResultSetHandler`** | 将结果集“转成 Java 对象”的“转换器”，处理查询结果映射。       | `handleResultSets`, `handleOutputParameters`          |

### 🔧 工作原理与开发步骤

MyBatis 插件的核心原理是 **动态代理**。当你在配置文件中注册一个插件后，MyBatis 在启动时会为这些核心组件创建代理对象。当方法被调用时，会先经过插件的 `intercept`方法，你可以在其中插入自定义逻辑，再决定是否继续执行原始方法 。

开发一个自定义插件通常只需三步：

1. **实现接口与注解配置**

   创建一个类实现 `org.apache.ibatis.plugin.Interceptor`接口，核心是重写 `intercept`方法。使用 `@Intercepts`和 `@Signature`注解精确指定要拦截的方法 。

   ```
   @Intercepts({
       @Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class, Integer.class})
   })
   public class SqlStatsInterceptor implements Interceptor {
       @Override
       public Object intercept(Invocation invocation) throws Throwable {
           long startTime = System.currentTimeMillis();
           try {
               // 执行原始方法
               return invocation.proceed();
           } finally {
               long costTime = System.currentTimeMillis() - startTime;
               System.out.println("SQL 执行耗时: " + costTime + "ms");
               // 实际项目中可将统计信息发送至监控系统
           }
       }
   }
   ```

2. **注册插件**

   让 MyBatis 知道并加载这个插件。

   - **XML 配置**（传统方式）：在 `mybatis-config.xml`中配置 。
   - **Java 代码配置**（Spring Boot 项目）：通过 `@Bean`定义 `SqlSessionFactory`并设置插件 。

3. **（可选）接收配置参数**

   如果插件需要可配置项，可以重写 `setProperties`方法。在 XML 配置中通过 `<property>`标签传递的参数会封装到 `Properties`对象并传入此方法 。

### 💡 常见应用场景

插件机制非常灵活，常见的应用场景包括：

- **性能监控与 SQL 日志记录**：拦截 `StatementHandler`的 `prepare`方法或 `Executor`的 `query/update`方法，记录完整的 SQL 语句、参数和执行时间，帮助发现慢查询 。
- **数据加密与脱敏**：拦截 `ParameterHandler`的 `setParameters`方法，在数据入库前自动加密敏感字段（如密码）；拦截 `ResultSetHandler`的 `handleResultSets`方法，在数据查询出来后自动解密 。
- **分页功能**：拦截 `Executor`的 `query`方法，根据分页参数自动重写和执行统计总数的 SQL 及分页 SQL。知名的 PageHelper 插件就是基于此原理 。
- **动态数据源与权限控制**：在多租户等场景下，拦截 SQL 执行过程，根据当前上下文动态添加租户 ID 等过滤条件，实现数据隔离 。

### ⚠️ 使用注意事项与最佳实践

- **拦截目标要精准**：`@Signature`注解的参数必须精确匹配，避免拦截不必要的方法影响性能或导致错误 。
- **注意插件执行顺序**：多个插件会按注册顺序形成“代理链”。如果插件间有依赖关系，需要注意它们的注册顺序 。
- **保持插件逻辑轻量**：插件的 `intercept`方法会在每次目标方法调用时执行，应避免在此处进行复杂的计算或远程调用，以免成为性能瓶颈。非核心逻辑可考虑异步处理 。
- **避免循环代理**：在重写 `plugin`方法时，确保不会对同一个目标对象进行重复代理，否则可能导致栈溢出 。

### 💎 总结

MyBatis 插件机制通过动态代理，为我们提供了一种非侵入式的、强大的框架扩展能力。无论是简单的 SQL 监控，还是复杂的业务逻辑如数据加密和分页，都可以通过插件优雅地实现。

希望这份详细的介绍能帮助你理解和运用 MyBatis 插件。如果你在具体实现过程中遇到问题，可以随时提出。