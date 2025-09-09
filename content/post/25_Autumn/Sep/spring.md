---
title: 【Shopee】Spring Fundamentals
date: 2025-09-01 00:00:00+0000
categories: [nutrition]
tags: [Shopee, Spring]
---

## `RestClient` & `WebClient`

Spring Framework 中的 `RestClient`和 `WebClient`都是用于进行 HTTP 调用的客户端工具，但它们的设计理念、适用场景和特性有显著区别。下面我用一个表格来汇总它们的核心差异，以便你快速把握：

| 特性             | RestClient                                                   | WebClient                                          |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| **同步/异步**    | 同步 (阻塞)                                                  | 异步 (非阻塞) / 支持同步调用                       |
| **编程模型**     | 传统命令式、阻塞式                                           | 响应式 (Reactive)，基于 Reactor (Mono/Flux)        |
| **API 风格**     | 流畅的 (Fluent) API                                          | 流畅的 (Fluent) API                                |
| **性能特点**     | 适用于常规同步请求，性能适中                                 | 高并发、非阻塞 I/O，资源利用率高，适合高吞吐量场景 |
| **学习曲线**     | 相对简单，易于上手                                           | 相对陡峭，需理解响应式编程概念                     |
| **Spring 版本**  | Spring Framework 6.1+ / Spring Boot 3.2+                     | Spring Framework 5+                                |
| **核心适用场景** | 传统的同步阻塞调用、微服务间的同步通信、从 `RestTemplate`迁移 | 高并发应用、响应式系统、微服务架构、流式数据处理   |

### 💡 如何选择

选择哪一个，取决于你的具体需求和项目环境：

- **选择 `RestClient`的情况**：
  - 项目基于 **Spring Boot 3.2 或更高版本** 。
  - 需要进行传统的、**同步阻塞式**的 HTTP 调用 。
  - 希望代码**简洁易读**，并且易于测试 。
  - 从旧的 `RestTemplate`迁移，希望有一个更现代的同步客户端 。
- **选择 `WebClient`的情况**：
  - 项目需要**高并发、高性能和非阻塞 I/O** 处理 。
  - 整个应用栈采用 **响应式编程模型** (如 Spring WebFlux) 。
  - 需要处理**流式数据** (如 Server-Sent Events, 大数据量传输) 。
  - 应用运行在 **Spring 5** 或更高版本上 。

### 🗂️ 关于 RestTemplate

虽然你的问题主要集中在 `RestClient`和 `WebClient`，但了解一下 `RestTemplate`也有助于理解演进：

`RestTemplate`是 Spring 早期提供的**同步阻塞式** HTTP 客户端，采用模板方法设计模式，提供了多种便捷方法 。**它在 Spring 5 之后已不再推荐积极使用，并在 Spring 6 中被标记为过时 (deprecated)**。`RestClient`可以看作是 `RestTemplate`的现代化替代品 。

### 💎 简要总结

简单来说，`RestClient`是 **同步请求的现代选择**，旨在替代 `RestTemplate`，提供更流畅的 API 和更好的开发体验。`WebClient`则是 **响应式和异步世界的强大工具**，为高并发和实时应用而生。

希望这些信息能帮助你做出清晰的选择。

## 无界队列

ThreadPoolExecutor 在使用无界队列（如 `LinkedBlockingQueue`默认构造）时，其 `maximumPoolSize`参数确实会“失效”。为了帮你快速理解，我们先看一张图，直观了解线程池的任务处理流程：

```
flowchart TD
    A[新任务提交] --> B{核心线程数已满?}
    B -- 否 --> C[创建新的核心线程执行]
    B -- 是 --> D{任务队列已满?}
    
    D -- 否 --> E[任务入队等待]
    D -- 是 --> F{线程数小于maximumPoolSize?}
    F -- 是 --> G[创建新线程<非核心>执行]
    F -- 否 --> H[执行拒绝策略]
    
    E --> I{队列是无界的?}
    I -- 是 --> J[❌ 队列永远不会满<br>流程终止于此]
    I -- 否 --> K[流程继续]
```

从图中可以看到，**使用无界队列时，任务入队的环节（步骤2）永远不会失败**，因此流程永远不会走到判断是否需要创建新非核心线程（步骤3）那一步。

### 🔍 详解线程池的工作机制

`ThreadPoolExecutor`处理新任务时，遵循一个固定的优先级顺序：

1. **核心线程优先**：如果当前运行线程数小于 `corePoolSize`，即使其他线程空闲，也会立即**创建新线程**来执行新任务。
2. **入队等待**：如果当前运行线程数已达到或超过 `corePoolSize`，线程池不会立即创建新线程，而是尝试将任务**放入任务队列**（`workQueue`）等待。
3. **创建非核心线程**：**只有当任务队列已满**（即无法入队），且当前运行线程数小于 `maximumPoolSize`时，线程池才会**创建新线程**（非核心线程）来执行新任务。
4. **拒绝策略**：如果任务队列已满，且当前运行线程数已达到 `maximumPoolSize`，那么新任务将被**拒绝**，执行拒绝策略（`RejectedExecutionHandler`）。

### ⚠️ 无界队列如何导致最大线程数失效

无界队列（如默认构造的 `LinkedBlockingQueue`）的**理论容量是 `Integer.MAX_VALUE`**，约21亿，在实践中可以认为是“无限”的。

这意味着：

- 在任务提交速度持续高于处理速度的情况下，任务会**无限地堆积**在无界队列中。
- 由于队列**永远也不会“满”**，线程池就**永远没有机会**走到上述流程的第3步（创建非核心线程）。
- 因此，线程池中的线程数量最多只会达到 `corePoolSize`，**`maximumPoolSize`这个参数也就失去了意义**，根本没有机会创建非核心线程。

### 🔥 潜在风险与影响

使用无界队列并让 `maximumPoolSize`失效会带来显著风险：

- **内存耗尽（OOM）**：这是最危险的问题。如果任务生产速度持续远大于消费速度，队列中的任务对象会无限堆积，最终耗尽 Java 堆内存，导致 `OutOfMemoryError: Java heap space`。
- **响应延迟加剧**：任务会在队列中等待很长时间才能被处理，导致系统平均响应时间飙升。
- **资源管理失控**：无法通过 `maximumPoolSize`来设置线程数的硬上限，失去了线程池控制资源的一个重要手段。

### 💡 如何正确配置

为了避免这些问题，通常的建议是：

1. **使用有界队列**：如 `ArrayBlockingQueue(int capacity)`或 `LinkedBlockingQueue(int capacity)`，为队列设置一个合理的容量上限。这是**最重要的原则**。
2. **配置合理的拒绝策略**：当队列满且线程数达到最大时，采取适当的策略（如 `CallerRunsPolicy`让提交任务的线程自己运行，或自定义策略记录日志并稍后重试），而不是默认的抛出异常或直接丢弃。
3. **核心与最大线程数设置**：根据任务特性（CPU密集型、IO密集型）设置 `corePoolSize`和 `maximumPoolSize`。

希望这些解释能帮助你理解其中的原理和风险。

## Retry.max-attempts

`spring.ai.retry.max-attempts: 1`表示**总共只执行一次，不会进行任何重试**。

为了更清晰地理解这个配置以及其他常见设置的含义，可以参考下面的表格：

| 配置值            | 实际重试次数 | 总执行次数（含首次） | 含义说明               |
| ----------------- | ------------ | -------------------- | ---------------------- |
| `max-attempts: 1` | **0**        | **1**                | **仅执行一次，不重试** |
| `max-attempts: 2` | 1            | 2                    | 首次失败后重试1次      |
| `max-attempts: 3` | 2            | 3                    | 首次失败后重试2次      |
| `max-attempts: N` | N-1          | N                    | 首次失败后重试N-1次    |

### 💡 理解 Spring Retry 的机制

Spring Retry 中的 `max-attempts`参数定义了包括初始调用在内的**最大尝试次数**。

- 当 `max-attempts`设置为 **1** 时，意味着方法最多只尝试**1次**。如果首次调用就失败，操作会直接失败，**不会触发任何重试**。
- 若需在失败后重试一次，则需将 `max-attempts`设置为 **2**。这样，初始调用加上一次重试，总共尝试2次。

### ⚠️ 注意事项

在决定是否以及如何重试时，有两点需要特别注意：

1. **幂等性**：重试机制要求被重试的操作是**幂等**的。即多次执行该操作与执行一次产生的结果相同。在AI接口调用等场景中，需特别注意这一点，例如重复提交相同的提示词（Prompt）一般不会产生副作用，但某些特定操作可能需要谨慎评估。
2. **配置的上下文**：`spring.ai.retry.max-attempts`这个配置是特定于 **Spring AI** 框架的。不同的库或框架（如 Spring Retry、Resilience4j）其重试配置项的名称和默认值可能有所不同，但“最大尝试次数”通常都包含初始调用。

### 💎 结论

所以，如果你的配置是 `spring.ai.retry.max-attempts: 1`，那么相关操作只要失败就会立刻停止，不会自动重试。如果需要重试，请根据上表调整这个参数的值。

## @RestControllerAdvice

@RestControllerAdvice 是 Spring Framework（3.2+）和 Spring Boot 中一个非常实用的注解，它可以帮助你集中处理 RESTful Web 服务中的异常、数据绑定和预处理逻辑，让代码更整洁、更易于维护。下面我来为你详细介绍一下。

### 🧠 核心机制与特点

@RestControllerAdvice 是一个**组合注解**，它融合了 `@ControllerAdvice`和 `@ResponseBody`的功能。

- `@ControllerAdvice`将其定义为一个全局的控制器增强类，可以捕获所有控制器（`@RestController`）抛出的异常，并允许进行全局的数据绑定和预处理操作。
- `@ResponseBody`确保了该类中所有方法的返回值都会**自动被序列化为 JSON 或 XML 格式**，并直接写入 HTTP 响应体中，非常适合构建 RESTful API。

它与传统 `@ControllerAdvice`的一个关键区别在于响应格式：

| 特性           | @ControllerAdvice             | @RestControllerAdvice                        |
| -------------- | ----------------------------- | -------------------------------------------- |
| **响应格式**   | 可返回视图名称或 ModelAndView | **直接返回 JSON/XML** (内置 `@ResponseBody`) |
| **适用场景**   | 传统 MVC 视图渲染             | **RESTful API**                              |
| **返回值处理** | 需视图解析器渲染              | 自动序列化为结构化数据                       |

### ⚙️ 主要用途

@RestControllerAdvice 主要有三大用途：

1. **全局异常处理**：这是最常见的使用场景。你可以定义一个集中的地方来捕获和处理整个应用程序中抛出的各种异常，并返回统一的、友好的错误信息格式给客户端。
2. **数据绑定与验证处理**：可以统一处理参数校验（如使用 `@Valid`注解）失败时产生的错误，避免在每个控制器方法中重复编写校验逻辑。
3. **全局数据预处理**：通过 `@InitBinder`或 `@ModelAttribute`注解的方法，可以对所有控制器方法的请求参数进行全局性的处理或绑定一些公共数据模型。

### 🛠️ 基本使用方法

使用 `@RestControllerAdvice`通常需要创建一个类并加上该注解，然后在其中定义相应的处理方法。

#### 全局异常处理示例

```
@RestControllerAdvice // 表明这是一个全局REST异常处理类
public class GlobalExceptionHandler {

    // 处理自定义的"资源未找到"异常
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        // 创建自定义的错误响应体
        ErrorResponse error = new ErrorResponse("NOT_FOUND", ex.getMessage());
        // 返回HTTP状态码为404的响应
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // 处理参数非法异常
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse("BAD_REQUEST", ex.getMessage());
        return ResponseEntity.badRequest().body(error); // HTTP 400
    }

    // 作为一个兜底方案，处理所有其他未明确捕获的异常
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse("INTERNAL_SERVER_ERROR", "服务器开小差了，请稍后再试");
        return ResponseEntity.internalServerError().body(error); // HTTP 500
    }
}
```

**代码说明**：

- `@ExceptionHandler`注解用于标记处理特定异常的方法。当控制器中抛出相应类型的异常时，Spring会调用此方法来处理。
- 方法的返回值通常是一个 `ResponseEntity`对象，这样可以方便地设置HTTP状态码和响应体。当然，你也可以直接返回一个自定义的POJO对象，它会被自动转换为JSON。
- 通过这种方式，所有类似的异常都会以统一的JSON格式返回给客户端，大大提升了API的一致性。

#### 全局数据绑定示例

```
@RestControllerAdvice
public class GlobalDataAdvice {

    // 此方法会在所有控制器方法执行前被调用，并向模型中添加一个名为"commonData"的属性
    @ModelAttribute("commonData")
    public Map<String, Object> addCommonData() {
        Map<String, Object> data = new HashMap<>();
        data.put("appName", "My Awesome App");
        data.put("version", "1.0.0");
        data.put("company", "Example Corp");
        return data;
    }
}
```

**代码说明**：

- `@ModelAttribute`注解的方法可以用于向所有控制器的模型中添加公共数据。
- 这样，在每个控制器方法中，都可以通过模型获取到这些公共数据，无需重复编写。

### 📋 控制作用范围

你可以通过 `@RestControllerAdvice`注解的参数来精细控制其生效的控制器范围，避免“一刀切”：

- `basePackages`：指定一个或多个包名，只有这些包及其子包下的控制器才会被该 advice 处理。

  ```
  @RestControllerAdvice(basePackages = "com.example.api.controllers")
  ```

- `assignableTypes`：指定一个或多个控制器类，只有这些特定的控制器才会被处理。

  ```
  @RestControllerAdvice(assignableTypes = {UserController.class, ProductController.class})
  ```

### ⚠️ 使用注意事项

- **包扫描路径**：确保你的 `@RestControllerAdvice`类位于 Spring Boot 应用程序的组件扫描路径之下，否则 Spring 无法发现并注册它。
- **异常匹配优先级**：当多个 `@ExceptionHandler`方法都能处理同一个异常时，**最具体（异常类层次最深）的处理器会优先执行**。例如，处理 `IOException`的方法和处理 `FileNotFoundException`（它是`IOException`的子类）的方法同时存在时，对于`FileNotFoundException`，会优先匹配后者。
- **多个 @RestControllerAdvice 类**：你可以定义多个 `@RestControllerAdvice`类来按模块或功能分类处理异常。可以通过 `@Order`注解来指定它们的优先级， order 值越小，优先级越高。
- **与传统 MVC 的区别**：如果你开发的是传统的、需要返回视图（如 JSP, Thymeleaf）的 MVC 应用，并且异常处理需要跳转到特定的错误页面，那么应该使用 `@ControllerAdvice`而不是 `@RestControllerAdvice`，因为后者会直接将返回对象写入响应体，而不会进行视图解析。

### 💡 应用场景

@RestControllerAdvice 非常适合以下场景：

- **统一异常处理**：处理 `IllegalArgumentException`、`NullPointerException`等常见异常，返回标准错误格式。
- **敏感信息过滤**：在响应前对数据进行脱敏处理（如隐藏用户密码），这通常需要配合 `ResponseBodyAdvice`接口来实现。
- **权限校验**：拦截未授权请求，返回 403 响应。
- **API 版本信息注入**：为所有响应体自动添加公共字段，如接口版本号、时间戳等。

### 📚 总结

@RestControllerAdvice 是 Spring 框架为 **RESTful API** 设计的全局增强工具，通过**集中处理异常、数据绑定和预处理**，它能有效地使业务逻辑与横切关注点（如异常处理）解耦，让代码更加简洁、可维护，特别适合微服务架构或前后端分离项目，帮助开发者统一接口响应格式，提升开发效率。

只需定义一个类并加上 `@RestControllerAdvice`注解，再配合 `@ExceptionHandler`、`@ModelAttribute`等注解，就能轻松实现全局处理逻辑。

## 审计

Spring框架提供了多种注解来支持数据审计功能，主要分为两大流派：**Spring Data JPA提供的基础审计注解**和**Hibernate Envers提供的历史追踪与版本化审计注解**。下面我用一个表格帮你快速了解它们的核心区别和主要注解：

| 特性维度         | Spring Data JPA 基础审计                                     | Hibernate Envers 历史审计 (借助 `@Audited`)                  |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **核心注解**     | `@CreatedDate`, `@LastModifiedDate`, `@CreatedBy`, `@LastModifiedBy` | `@Audited`                                                   |
| **主要目的**     | **自动填充**实体的创建时间、修改时间、创建人、修改人等基础字段 | **记录实体所有变更的完整历史**，可追溯任何时间点的数据状态   |
| **审计信息存储** | 与实体本身存储在**同一张表**的额外字段里                     | 在**单独的审计表**（通常以 `_AUD`结尾）中创建历史记录版本    |
| **数据追溯能力** | 仅能看到**当前的最新状态**                                   | 可查询**任何历史修订版本**，支持按时间或版本号回溯           |
| **关键依赖**     | `spring-boot-starter-data-jpa`                               | `hibernate-envers`                                           |
| **常用场景**     | 记录数据条目的创建和更新信息                                 | 需要满足强合规性要求、追踪数据完整变更历史、实现数据版本控制 |

💡 **如何使用这些注解**

### 📝 Spring Data JPA 基础审计

1. **启用审计**：在配置类上添加 `@EnableJpaAuditing`。

2. **标记实体**：

   - 在实体类上添加 `@EntityListeners(AuditingEntityListener.class)`。

   - 在需要的字段上添加审计注解：

     ```
     @CreatedDate
     @Column(name = "create_time", updatable = false)
     private LocalDateTime createTime;
     
     @LastModifiedDate
     @Column(name = "update_time")
     private LocalDateTime updateTime;
     
     @CreatedBy
     @Column(name = "creator", updatable = false)
     private String creator;
     
     @LastModifiedBy
     @Column(name = "modifier")
     private String modifier;
     ```

3. **提供审计者信息**（如果使用了 `@CreatedBy`或 `@LastModifiedBy`）：实现 `AuditorAware`接口并将其注入容器。例如，结合 Spring Security 获取当前用户名：

   ```
   @Component
   public class SpringSecurityAuditorAware implements AuditorAware<String> {
       @Override
       public Optional<String> getCurrentAuditor() {
           // 从安全上下文中获取当前认证的用户名
           Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
           if (authentication == null || !authentication.isAuthenticated()) {
               return Optional.empty();
           }
           return Optional.ofNullable(authentication.getName());
       }
   }
   ```

### 🔍 Hibernate Envers 历史审计

1. **添加依赖**：在 `pom.xml`中添加 Envers 依赖。

   ```
   <dependency>
       <groupId>org.hibernate</groupId>
       <artifactId>hibernate-envers</artifactId>
   </dependency>
   ```

2. **标记需要历史审计的实体**：在实体类上添加 `@Audited`。

   ```
   @Entity
   @Audited // 增加此注解
   public class YourEntity {
       // ... 字段定义
   }
   ```

3. **查询审计历史**：通过继承 `RevisionRepository`的接口进行查询。

   ```
   public interface YourEntityAuditRepository extends RevisionRepository<YourEntity, Long, Integer> {
       List<Revision<Integer, YourEntity>> findRevisionsById(Long id);
   }
   ```

### 💡 实用建议

- **基础审计**适用于大多数需要简单记录创建/更新信息的场景。
- **历史审计** (`@Audited`) 功能更强大，但会生成额外的审计表，适合对数据变更追踪有严格要求（如合规性要求高）的场景。
- 使用 `@CreatedBy`和 `@LastModifiedBy`时，确保正确实现 `AuditorAware`接口以提供当前的审计者信息。
- 审计功能对于**问题排查**、**安全分析**和**满足合规性要求**非常有帮助。

希望这些信息能帮助你更好地在Spring项目中应用审计功能。

## @EntityListener

@EntityListeners 是 JPA（Java Persistence API）中的一个注解，主要用于**监听实体类的生命周期事件**（如创建、更新、删除、加载等），并在这些事件发生时**自动执行指定的回调逻辑**。

为了让你能快速了解它支持监听哪些生命周期事件，我用一个表格来汇总：

| 注解           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| `@PrePersist`  | 在实体被 `EntityManager`的 `persist()`方法持久化（新增）**之前**调用 |
| `@PostPersist` | 在实体被持久化（新增）**之后**调用                           |
| `@PreUpdate`   | 在实体被更新（UPDATE操作）**之前**调用                       |
| `@PostUpdate`  | 在实体被更新**之后**调用                                     |
| `@PreRemove`   | 在实体被 `EntityManager`的 `remove()`方法删除**之前**调用    |
| `@PostRemove`  | 在实体被删除**之后**调用                                     |
| `@PostLoad`    | 在实体从数据库被加载（SELECT操作）或刷新（refresh）**之后**调用 |

### 🔧 如何使用 @EntityListeners

1. **定义监听器类**：创建一个类，在其中定义方法，并使用上表中的生命周期回调注解来指定这些方法在何时触发。这些方法的返回类型必须为 `void`，并且接受一个参数（参数类型为所要监听的实体类型）。

   ```
   public class MyEntityListener {
   
       @PrePersist
       public void beforeSave(MyEntity entity) {
           System.out.println("即将保存实体: " + entity.getId());
           // 可以在此处设置创建时间、初始化状态等
       }
   
       @PostUpdate
       public void afterUpdate(MyEntity entity) {
           System.out.println("实体已更新: " + entity.getId());
           // 可以记录更新日志、发送通知等
       }
       // 其他生命周期方法...
   }
   ```

2. **将监听器关联到实体**：在需要被监听的实体类上使用 `@EntityListeners`注解，并指定监听器类。

   ```
   @Entity
   @EntityListeners(MyEntityListener.class) // 可以指定多个监听器，如 {Listener1.class, Listener2.class}
   public class MyEntity {
       @Id
       @GeneratedValue
       private Long id;
       // ... 其他字段和方法
   }
   ```

3. **(可选) 启用审计功能**：如果你使用 Spring Data JPA 的审计功能（如自动填充 `@CreatedDate`、`@LastModifiedDate`、`@CreatedBy`、`@LastModifiedBy`），除了需要 `@EntityListeners(AuditingEntityListener.class)`，还需在配置类上添加 `@EnableJpaAuditing`来启用审计。

### 💡 实用示例：自动记录操作日志

假设你想在用户信息（UserEntity）被更新后自动记录一条审计日志，可以这样做：

1. **定义日志监听器**：

   ```
   public class UserAuditListener {
       private static final Logger log = LoggerFactory.getLogger(UserAuditListener.class);
   
       @PostUpdate
       public void auditUserUpdate(UserEntity user) {
           log.info("用户 {} 的信息于 {} 被修改", user.getId(), LocalDateTime.now());
           // 实际项目中，这里可以将日志写入数据库的审计表，或发送到消息队列等
       }
   }
   ```

2. **在用户实体上关联监听器**：

   ```
   @Entity
   @EntityListeners({AuditingEntityListener.class, UserAuditListener.class}) // 可以同时指定多个监听器
   @Table(name = "user")
   public class UserEntity {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long id;
       private String username;
       // ... 其他字段、getter和setter
       // 假设这里还有 @CreatedDate, @LastModifiedDate 等审计字段
   }
   ```

   这样，每当一个 `UserEntity`实例被更新后，`auditUserUpdate`方法就会被自动调用，记录下审计信息。

### ⚠️ 使用注意

- **监听器方法的参数**：生命周期回调方法接受一个参数，此参数代表**正在经历该生命周期事件的实体对象**。
- **事务上下文**：这些回调方法通常在**与实体操作相同的事务上下文中执行**。
- **异常影响**：如果在 `@PrePersist`, `@PreUpdate`, `@PreRemove`等方法中抛出异常，可能会**阻止后续数据库操作的发生**。

希望这些信息能帮助你更好地理解和使用 `@EntityListeners`。

## @EnableJpaAuditing

`@EnableJpaAuditing`注解是 Spring Data JPA 审计功能的**总开关**🔌。它的核心作用是**激活一套自动填充实体审计字段的机制**，让你无需在每次保存或更新数据时手动设置诸如创建时间、修改时间、创建人、修改人这些字段。

为了让你快速了解它的主要功能，我用一个表格来概括：

| 功能维度           | 说明                                                         | 常用场景                                           |
| ------------------ | ------------------------------------------------------------ | -------------------------------------------------- |
| **激活审计监听**   | 启用 `AuditingEntityListener`，使其能够监听实体生命周期事件（如 `@PrePersist`, `@PreUpdate`）。 | 自动填充 `@CreatedDate`, `@LastModifiedDate`等字段 |
| **提供审计者信息** | 通过 `auditorAwareRef`参数指定一个 `AuditorAware`Bean，为 `@CreatedBy`和 `@LastModifiedBy`提供当前用户信息。 | 记录数据是由哪个用户创建或修改的。                 |
| **自定义时间源**   | 通过 `dateTimeProviderRef`参数指定一个 `DateTimeProvider`Bean，自定义审计时间的获取方式（如统一时区）。 | 确保所有审计时间都使用统一的时区（如 UTC）。       |
| **控制日期设置**   | 通过 `setDates`参数控制是否自动设置日期字段（默认为 `true`）。 | 测试时可能需要临时关闭日期自动设置。               |

下面是关于它如何工作以及如何配置的详细说明。

### 📊 1. 核心作用与工作原理

`@EnableJpaAuditing`主要用来**激活 Spring Data JPA 的审计功能**。一旦启用，当实体对象被持久化（新增）或更新时，框架会自动填充标记了特定审计注解的字段。

**关键机制：**

- **自动填充字段**：通过 `@CreatedDate`, `@LastModifiedDate`, `@CreatedBy`, `@LastModifiedBy`等注解标记的字段，其值会在数据创建或更新时由框架自动填充，无需手动设置。
- **监听实体生命周期**：此功能依赖于 `AuditingEntityListener`来监听实体的持久化（`@PrePersist`）和更新（`@PreUpdate`）等生命周期事件。

### ⚙️ 2. 配置说明

`@EnableJpaAuditing`通常放置在 Spring Boot 的主配置类上：

```
@SpringBootApplication
@EnableJpaAuditing // 启用JPA审计功能
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

### 👤 3. 记录操作用户（`@CreatedBy`/ `@LastModifiedBy`）

若要自动记录数据的创建者和最后修改者，你需要：

1. **实现 `AuditorAware`接口**：此接口用于获取当前用户信息。

   ```
   @Component
   public class SpringSecurityAuditorAware implements AuditorAware<String> {
       @Override
       public Optional<String> getCurrentAuditor() {
           // 从安全上下文中获取当前认证的用户名
           Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
           if (authentication == null || !authentication.isAuthenticated()) {
               return Optional.empty();
           }
           return Optional.ofNullable(authentication.getName());
       }
   }
   ```

2. **在 `@EnableJpaAuditing`中引用**（如果需要明确指定 Bean）：

   ```
   @EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
   ```

### 🕐 4. 自定义日期与时间提供者

你可以通过实现 `DateTimeProvider`接口来自定义审计时间的来源，例如统一使用 UTC 时间或特定时区：

```
@Component
public class CustomDateTimeProvider implements DateTimeProvider {
    @Override
    public Optional<TemporalAccessor> getNow() {
        // 返回当前UTC时间
        return Optional.of(Instant.now());
    }
}
```

并在配置中指定：

```
@EnableJpaAuditing(dateTimeProviderRef = "customDateTimeProvider")
```

### 💡 5. 最佳实践与常见问题

- **使用基类（推荐）**：通过 `@MappedSuperclass`创建一个包含所有审计字段的基类，让其他实体类继承，这样可以避免在每个实体中重复定义这些字段。

  ```
  @MappedSuperclass
  @EntityListeners(AuditingEntityListener.class)
  public abstract class AuditableEntity {
      @CreatedDate
      @Column(name = "created_date", updatable = false)
      private LocalDateTime createdDate;
  
      @LastModifiedDate
      @Column(name = "last_modified_date")
      private LocalDateTime lastModifiedDate;
  
      // ... 其他审计字段（如@CreatedBy, @LastModifiedBy）及其getter/setter
  }
  ```

- **时间字段类型**：审计时间字段支持多种类型，如 `Date`、`Calendar`、`Long`（时间戳），以及 Java 8 的 `LocalDateTime`、`Instant`等。

- **常见问题排查**：

  - **审计字段未自动填充**：首先检查是否添加了 `@EnableJpaAuditing`注解，实体类是否使用了 `@EntityListeners(AuditingEntityListener.class)`，以及字段上的审计注解（如 `@CreatedDate`）是否正确。
  - **时区问题**：如果遇到时间时区不一致，可以考虑实现自定义的 `DateTimeProvider`。

### 📌 总结

`@EnableJpaAuditing`注解是 Spring Data JPA 审计功能的**核心配置**。它通过**自动填充**审计字段，大大简化了对数据创建和修改信息的跟踪，提升了开发效率，并增强了数据的可追溯性。

希望这些信息能帮助你更好地理解和使用 `@EnableJpaAuditing`。

## @Transational

Spring Boot 中处理数据库事务，主要用的是 **`@Transactional`** 这个注解。它通常标注在**服务层（Service）** 的类或方法上，用来将一系列数据库操作绑成一个事务，确保数据的一致性。

下面我用一个表格帮你快速了解这些注解和属性：

| 注解/属性                          | 说明                                                         | 常用值/示例                                                  |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **`@Transactional`**               | **核心事务注解**，可应用于类或方法上。标注在类上时，该类所有**public**方法都会开启事务。 | `@Transactional` `@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)` |
| `propagation`                      | **事务传播行为**，定义方法如何参与或创建事务。               | `Propagation.REQUIRED`(默认) `Propagation.REQUIRES_NEW` `Propagation.NESTED` |
| `isolation`                        | **事务隔离级别**，控制事务间的可见性。                       | `Isolation.DEFAULT`(默认) `Isolation.READ_COMMITTED` `Isolation.REPEATABLE_READ` |
| `timeout`                          | **事务超时时间**（秒），超过该时间事务未完成则自动回滚。     | `timeout = 5`(5秒)                                           |
| `readOnly`                         | 指定事务是否为**只读**。优化查询性能。                       | `readOnly = true`                                            |
| `rollbackFor` `noRollbackFor`      | 指定哪些**异常触发回滚**或**不触发回滚**。                   | `rollbackFor = Exception.class` `noRollbackFor = RuntimeException.class` |
| **`@EnableTransactionManagement`** | **启用注解式事务管理**，通常放在主配置类或启动类上。**Spring Boot 默认已启用**，通常可省略。 | `@SpringBootApplication` `@EnableTransactionManagement` (显式添加) |

🧠 **`@Transactional`关键属性详解**

`@Transactional`的强大在于其丰富的属性配置，让你能精细控制事务行为：

1. **propagation (传播行为)**：当多个事务方法相互调用时，此属性决定了事务如何传播。这是处理复杂业务逻辑时最关键的概念之一。
   - **REQUIRED** (默认)：如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新事务。
   - **REQUIRES_NEW**：总是创建一个新事务。如果当前存在事务，则将其挂起。这意味着新事务与原有事务相互独立。
   - **NESTED**：如果当前存在事务，则在嵌套事务内执行。嵌套事务是外部事务的一部分，提交或回滚与外部事务有关联。
   - 其他值如 `SUPPORTS`, `MANDATORY`, `NOT_SUPPORTED`, `NEVER`则用于更特定的场景。
2. **rollbackFor / noRollbackFor (回滚规则)**：
   - 默认情况下，`@Transactional`只在遇到**运行时异常（RuntimeException）** 和 **Error** 时回滚。
   - 如果需要在遇到**受检异常（Checked Exception，如 Exception, IOException, SQLException）** 时也回滚事务，必须使用 `rollbackFor`属性明确指定，例如 `@Transactional(rollbackFor = Exception.class)`。

⚡ **使用注意事项**

1. **确保注解生效**：`@Transactional`通常基于 Spring AOP 代理实现。需注意：
   - **方法必须是 public**：非 public 方法上的 `@Transactional`注解会被忽略。
   - **避免同类自调用**：一个类中的 `A`方法（无`@Transactional`）调用同类中的 `B`方法（有`@Transactional`），`B`方法的事务会失效。因为自调用不经过代理对象。解决方法是将 `B`方法放到另一个 Service 类中。
   - **异常需抛出**：事务回滚依赖于异常被抛出。如果你在方法内用 `try-catch`捕获了异常但未重新抛出，事务就不会回滚。
2. **正确设置回滚异常**：根据业务需要，明确配置 `rollbackFor`。若需所有异常都回滚，可设为 `rollbackFor = Exception.class`。
3. **数据库引擎支持事务**：确保你使用的数据库表使用的是支持事务的引擎（如 InnoDB）。例如，MySQL 的 MyISAM 引擎就不支持事务。

💡 **代码示例**

这是一个综合使用了多个属性的服务层方法示例：

```
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private InventoryRepository inventoryRepository;

    // 在一个新事务中执行，超时时间5秒，任何异常都回滚
    @Transactional(propagation = Propagation.REQUIRES_NEW, 
                   timeout = 5, 
                   rollbackFor = Exception.class)
    public void placeOrder(Order order) throws Exception {
        // 1. 扣减库存
        inventoryRepository.reduceStock(order.getProductId(), order.getQuantity());
        // 2. 创建订单
        orderRepository.save(order);
        // 如果在此过程中抛出任何异常（包括Exception），所有操作都将回滚
    }
}
```

📚 **总结**

Spring Boot 中数据库事务管理的核心是 **`@Transactional`** 注解。要有效使用它，你需要理解其**传播行为**、**隔离级别**、**回滚规则**等关键属性，并注意避免常见的失效陷阱，如**同类自调用**和**异常被捕获**。

希望这些信息能帮助你更好地在 Spring Boot 项目中应用事务管理。

## 类级别 @Transactional

在 Spring 中，当你将 `@Transactional`注解应用于类级别时，它会为该类的所有 **public 方法**提供一个默认的事务配置模板。这意味着这些方法的执行都会被纳入事务管理。

为了让你快速了解其核心要点，我总结了一个表格：

| 方面                       | 类级别 `@Transactional`的作用                                | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **默认事务行为**           | 类中所有 **public 方法**在执行时都会自动开启和管理事务。     | 非 public 方法（private, protected）上的 `@Transactional`注解**不会生效**。 |
| **方法级注解覆盖类级配置** | 如果某个 public 方法上也有 `@Transactional`注解，那么**方法上的配置会优先于类级别的配置**。 | 这提供了灵活性，允许对特定方法进行更细致的事务控制。         |
| **统一管理**               | 方便地为整个服务类的所有业务方法设定**统一的事务属性**（如传播行为、隔离级别、只读等），减少重复配置。 | 适用于类中大多数方法有相似事务需求的情况，有助于保持代码整洁。 |
| **可能带来的性能影响**     | 如果盲目地将所有方法（包括只读查询）都置于事务中，可能会带来**不必要的性能开销**。 | 数据库事务本身有一定开销。对于不修改数据的纯查询方法，考虑使用 `@Transactional(readOnly = true)`或不在类级别设置事务，而是在方法级别单独配置。 |

🧩 **方法级别覆盖的示例**

下面的代码示例展示了方法级别的事务配置如何覆盖类级别的配置：

```
@Service
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class) // 类级别：默认必需事务，任何异常都回滚
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 此方法将使用类级别的事务配置：Propagation.REQUIRED, rollbackFor = Exception.class
    public void createUser(User user) {
        userRepository.save(user);
    }

    // 此方法上的注解覆盖了类级别的配置：总是开启一个新事务，并且只读
    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // 此方法上的注解覆盖了类级别的配置：指定了超时时间
    @Transactional(timeout = 30)
    public void updateUserProfile(User user) {
        // ... 一些耗时操作
        userRepository.updateUser(user);
    }
}
```

📋 **注意事项**

使用类级别 `@Transactional`时，有几个重要的地方需要注意：

1. **慎用于非 public 方法**：Spring 的事务管理基于 AOP（动态代理），非 public 方法上的 `@Transactional`注解**会被忽略**，且通常不会有任何报错，这是一处容易踩坑的地方。
2. **避免自调用问题**：在同一个类中，一个没有 `@Transactional`注解的方法（比如 `methodA`）直接调用另一个有 `@Transactional`注解的方法（比如 `methodB`），**`methodB`的事务注解会失效**。这是因为自调用不经过代理对象。解决方法是将 `methodB`移到另一个 Service 类中，或通过注入自身代理等方式调用。
3. **明确回滚规则**：类级别设置的 `rollbackFor`或 `noRollbackFor`属性会应用于所有方法。务必清楚默认回滚的是 `RuntimeException`和 `Error`，如果需要检查异常（Checked Exception）也触发回滚，需要在类或方法级别明确配置 `rollbackFor = Exception.class`。
4. **数据库引擎支持**：确保你使用的数据库表引擎支持事务（如 MySQL 的 InnoDB）。如果使用的是不支持事务的引擎（如 MyISAM），事务注解将不会生效。

💡 **总结一下**

在类上使用 `@Transactional`可以**高效地为所有 public 方法提供统一的事务管理**，非常适合那些大多数方法都需要类似事务配置的 Service 类。

但它是一把“双刃剑”，需注意：

- **灵活性**：需要特事特办的方法，可以在方法级别用 `@Transactional`进行覆盖。
- **谨慎性**：避免给不需要事务的只读方法带来额外开销，并留意非 public 方法注解失效和自调用陷阱。

希望这些解释能帮助你更好地理解和使用类级别的 `@Transactional`注解。

## Spring Security 权限注解

Spring 框架，特别是其安全模块 **Spring Security**，提供了一系列强大的**权限控制注解**，可以帮助你轻松地在方法或类级别实现精细化的访问控制。下面我用一个表格汇总这些核心注解，并附上详细说明和代码示例。

| 注解               | 应用场景与描述                                               | 常用表达式/示例                                              |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **@PreAuthorize**  | 方法**执行前**进行权限检查，**最常用**。支持丰富的 SpEL 表达式。 | `@PreAuthorize("hasRole('ADMIN')")``@PreAuthorize("hasAuthority('USER_DELETE')")``@PreAuthorize("#id == authentication.principal.id")` |
| **@PostAuthorize** | 方法**执行后**进行权限检查，适用于需要**基于返回值**进行鉴权的场景。 | `@PostAuthorize("returnObject.owner == authentication.name")` |
| **@Secured**       | 较简单的角色检查，**不支持** SpEL 表达式。角色名必须以 `ROLE_`前缀开头。 | `@Secured({"ROLE_ADMIN", "ROLE_USER"})`                      |
| **@RolesAllowed**  | JSR-250 标准注解，功能与 `@Secured`类似。                    | `@RolesAllowed({"ADMIN", "USER"})`                           |
| **@PreFilter**     | 方法执行前，根据规则**过滤传入的集合参数**。                 | `@PreFilter("filterObject.owner == authentication.name")`    |
| **@PostFilter**    | 方法执行后，根据规则**过滤返回的集合结果**。                 | `@PostFilter("filterObject.status == 'PUBLIC' or filterObject.owner == authentication.name")` |

🧩 **详解与示例**

### 🔒 1. @PreAuthorize

此注解用于在方法调用**之前**执行权限检查，如果表达式评估结果为 `false`，方法将不会执行。

```
@PreAuthorize("hasRole('ADMIN')") // 要求用户拥有'ROLE_ADMIN'角色
public void deleteUser(Long userId) {
    // 删除用户的逻辑
}

@PreAuthorize("hasAuthority('USER_DELETE') and #userId != authentication.principal.id") // 要求拥有'USER_DELETE'权限且不能删除自己
public void deleteUser(Long userId) {
    // 删除用户的逻辑
}
```

### 🔍 2. @PostAuthorize

此注解在方法**执行后**进行权限检查，特别适合访问控制决策需要依赖方法返回值的情况。

```
// 只能返回属于自己的用户信息
@PostAuthorize("returnObject.username == authentication.principal.name")
public User getUserById(Long id) {
    return userRepository.findById(id).orElse(null);
}
```

### 🛡️ 3. @Secured

这是一个较早期的 Spring Security 注解，主要用于基于角色的简单检查。

```
@Secured("ROLE_ADMIN") // 要求用户拥有'ROLE_ADMIN'角色
public void updateSystemConfig() {
    // 更新系统配置的逻辑
}
```

### 📋 4. @RolesAllowed

这是 JSR-250 标准注解，需要单独启用 (`jsr250Enabled = true`)。其作用与 `@Secured`类似。

```
@RolesAllowed({"ADMIN", "SUPER_USER"}) // 允许拥有'ADMIN'或'SUPER_USER'角色的用户访问
public void viewAuditLogs() {
    // 查看审计日志的逻辑
}
```

### 🧹 5. @PreFilter 与 @PostFilter

这两个注解用于对集合数据进行过滤，实现数据级别的权限控制。

```
// 只能处理属于自己的任务
@PreFilter("filterObject.assignee == authentication.name")
public void updateTasks(List<Task> tasks) {
    tasks.forEach(taskRepository::save);
}

// 只返回状态为公共或属于自己的帖子
@PostFilter("filterObject.status == 'PUBLIC' or filterObject.owner == authentication.name")
public List<Post> getAllPosts() {
    return postRepository.findAll();
}
```

### ⚙️ **启用注解支持**

要使用 `@PreAuthorize`, `@PostAuthorize`, `@Secured`等注解，你必须在你的配置类上显式启用它们：

```
@Configuration
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {
    // 其他安全配置...
}
```

- `prePostEnabled = true`: 启用 `@PreAuthorize`和 `@PostAuthorize`。
- `securedEnabled = true`: 启用 `@Secured`。
- `jsr250Enabled = true`: 启用 `@RolesAllowed`(JSR-250)。

### 💡 **注意事项**

- **表达式中的对象**：在 SpEL 表达式中，你可以使用 `authentication`、`principal`来获取当前认证信息和用户主体，并使用 `#参数名`来引用方法的参数。
- **角色与权限**：`hasRole('ADMIN')`会在传入的字符串前自动添加 `ROLE_`前缀（即查找 `ROLE_ADMIN`）。而 `hasAuthority('USER_DELETE')`则会直接使用字符串 'USER_DELETE' 进行精确匹配。根据你的权限设计方式选择使用 。
- **方法调用的注意事项**：这些基于 AOP 的注解通常只在通过代理对象进行的外部方法调用时生效。在同一个类中，一个方法内部调用另一个被注解修饰的方法，注解可能会失效。

Spring Security 的权限注解为应用安全提供了强大而灵活的保障。正确使用它们，可以让你轻松构建出权限控制精细、代码清晰易维护的系统。

## @SentinelResource

Sentinel 中实现限流的核心注解是 `@SentinelResource`。它允许你声明需要保护的业务资源，并指定限流或降级后的处理逻辑。下面我用一个表格总结它的核心属性，然后详细说明如何使用：

| 注解属性                | 说明                                                         | 示例                                        |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------- |
| **`value`**             | **资源名称**，必填。Sentinel 根据此名称来配置和统计规则。    | `@SentinelResource(value = "getUserById")`  |
| **`blockHandler`**      | **限流/熔断处理方**法名。**可选**。该方法需与原方法同参数列表，并额外加一个 `BlockException`参数，且需同返回值类型。 | `blockHandler = "handleBlock"`              |
| **`blockHandlerClass`** | 指定 `blockHandler`方法所在的类。**可选**。此时 `blockHandler`方法必须是该类的 **静态方法**。 | `blockHandlerClass = {ExceptionUtil.class}` |
| **`fallback`**          | **业务异常降级处理**方法名。**可选**。用于处理业务逻辑抛出的异常（非 `BlockException`）。参数列表需与原方法一致，可加一个 `Throwable`参数。 | `fallback = "fallbackHandler"`              |
| **`fallbackClass`**     | 指定 `fallback`方法所在的类。**可选**。此时 `fallback`方法必须是该类的 **静态方法**。 | `fallbackClass = {ExceptionUtil.class}`     |

🧩 **使用步骤**

### 1. 添加依赖

在 `pom.xml`中添加 Spring Cloud Alibaba Sentinel 依赖：

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
    <version>2022.0.0.0</version> <!-- 请选择与你的Spring Boot版本匹配的版本 -->
</dependency>
```

### 2. 配置 Sentinel 控制台（可选但推荐）

在 `application.yml`中配置 Sentinel Dashboard 地址：

```
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080 # Sentinel 控制台地址
        port: 8719 # 应用与Sentinel控制台交互的本地端口
      eager: true # 取消控制台懒加载，项目启动即连接
```

### 3. 使用 `@SentinelResource`注解

你可以在 Service 方法或 Controller 方法上使用 `@SentinelResource`注解。

**示例 1：在 Controller 中使用，`blockHandler`处理限流**

```
import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @GetMapping("/test")
    @SentinelResource(value = "testResource", blockHandler = "handleBlock")
    public String test() {
        return "正常访问";
    }

    // 限流降级方法 (需符合 blockHandler 方法签名要求)
    public String handleBlock(BlockException ex) {
        return "请求过于频繁，请稍后再试"; // 触发限流时返回此信息
    }
}
```

**示例 2：使用 `blockHandlerClass`指定外部类处理限流**

```
// 在Controller或Service中
@SentinelResource(value = "getUserById", 
                  blockHandler = "handleBlock", 
                  blockHandlerClass = {ExceptionUtil.class})
public User getUserById(String id) {
    // 业务逻辑
}
// 独立的异常处理工具类 ExceptionUtil.java
public final class ExceptionUtil {
    // 必须是静态方法
    public static User handleBlock(String id, BlockException ex) {
        // 记录日志或执行其他操作
        return new User("fallback-user", "请求被限流"); // 返回降级数据
    }
}
```

**示例 3：同时使用 `blockHandler`和 `fallback`**

```
@SentinelResource(value = "demoService", 
                  blockHandler = "blockHandler", // 处理 Sentinel 规则拦截的异常（如限流、熔断）
                  fallback = "fallbackHandler")  // 处理业务逻辑抛出的其他异常
public String demoService(String input) {
    if ("error".equals(input)) {
        throw new RuntimeException("业务异常");
    }
    return "处理成功: " + input;
}

// Sentinel BlockException 处理方
public String blockHandler(String input, BlockException ex) {
    return "请求被限流或熔断，输入: " + input;
}

// 通用 Fallback 处理方 (Throwable 可选)
public String fallbackHandler(String input, Throwable t) {
    return "服务降级，原因: " + t.getMessage();
}
```

### 4. 配置限流规则

配置规则有两种主要方式：

**方式一：通过 Sentinel 控制台动态配置（推荐）**

1. 启动 Sentinel 控制台（通常是一个独立的 Jar 包）。
2. 访问控制台（默认用户名密码均为 `sentinel`）。
3. 在 **“簇点链路”** 中找到你通过 `@SentinelResource`注解定义的资源名（如 `testResource`）。
4. 点击 **“流控”** 按钮，设置 **QPS** 或**线程数**阈值、流控模式（直接、关联、链路）和流控效果（快速失败、Warm Up、排队等待）。

**方式二：通过代码初始化规则（适用于初始配置或测试）**

```
import com.alibaba.csp.sentinel.slots.block.RuleConstant;
import com.alibaba.csp.sentinel.slots.block.flow.FlowRule;
import com.alibaba.csp.sentinel.slots.block.flow.FlowRuleManager;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Collections;

@Configuration
public class SentinelConfig {
    @Bean
    public ApplicationRunner initSentinelRules() {
        return args -> {
            FlowRule rule = new FlowRule();
            rule.setResource("testResource"); // 与 @SentinelResource 的 value 一致
            rule.setGrade(RuleConstant.FLOW_GRADE_QPS); // 限流阈值类型 (QPS 模式)
            rule.setCount(2); // 阈值 (每秒最多允许 2 次请求)
            rule.setLimitApp("default");
            FlowRuleManager.loadRules(Collections.singletonList(rule));
        };
    }
}
```

*请注意，代码配置的规则在应用重启后通常会丢失，建议通过控制台配置或结合 Nacos 等配置中心进行持久化。*

### 5. 统一异常处理（可选）

如果你想自定义被限流时返回的 JSON 格式而非简单字符串，可以实现 `BlockExceptionHandler`：

```
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.alibaba.csp.sentinel.adapter.spring.webmvc.callback.BlockExceptionHandler;
import org.springframework.stereotype.Component;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class CustomBlockExceptionHandler implements BlockExceptionHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, BlockException e) throws Exception {
        response.setStatus(429); // Too Many Requests
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write("{\"code\": 429, \"msg\": \"请求过于频繁，请稍后再试\"}");
    }
}
```

💡 **注意事项**

- **资源名唯一性**：`value`定义的资源名应唯一。
- **方法签名**：`blockHandler`和 `fallback`方法需要严格遵循**参数和返回值类型**的约定。
- **控制台配置**：通过 Sentinel 控制台配置规则是**动态生效**的，无需重启应用，非常灵活。
- **规则持久化**：默认配置的规则存在于内存中，应用重启会丢失。如需持久化，可集成 Nacos、ZooKeeper 等配置中心。
- **自动埋点**：Sentinel 默认也会为所有 HTTP 端点（如 `@RequestMapping`注解的方法）提供资源保护，资源名为 URL 路径。你同样可以在控制台为这些自动埋点的资源配置规则。

希望这些信息能帮助你顺利地在项目中使用 Sentinel 进行限流。

## Spring Retry

Spring Retry 组件通过几个简洁而强大的注解，为应用程序提供了处理临时性故障（如网络波动、数据库连接暂时不可用等）的优雅重试机制。它能有效增强系统的容错性和稳定性。

下面是 Spring Retry 的核心注解概览：

| 注解                    | 说明                                                         | 常用参数                                               |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| **`@EnableRetry`**      | **启用重试功能**的开关注解，通常放在配置类或主启动类上。     |                                                        |
| **`@Retryable`**        | 标记**需要进行重试的方法**。当方法抛出指定异常时，Spring Retry 会根据配置的策略进行重试。 | `value`/`include`, `exclude`, `maxAttempts`, `backoff` |
| **`@Backoff`**          | 通常作为 `@Retryable`的参数使用，用于**配置重试的延迟策略**，如固定间隔、指数增长等。 | `delay`, `multiplier`, `maxDelay`, `random`            |
| **`@Recover`**          | 标记一个方法作为**重试全部失败后的“兜底”恢复方法**。当所有重试尝试都失败后，会调用此方法。 |                                                        |
| **`@CircuitBreaker`**   | 提供**熔断器功能**。在失败次数达到阈值后，熔断器会打开，暂时停止所有重试尝试，经过一段时间后再进入半开状态尝试恢复。 | `openTimeout`, `resetTimeout`                          |
| **`@ConcurrencyLimit`** | **限制方法的并发执行数量**，防止系统过载。                   | `value`(最大并发数)                                    |

### 🚀 如何启用重试

要使用 Spring Retry，首先需要在项目中添加依赖。如果你使用 Maven，可以在 `pom.xml`中添加：

```
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
    <version>1.3.1</version> <!-- 请查看最新版本 -->
</dependency>
<!-- Spring Retry 基于AOP，因此还需要引入AOP依赖 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
</dependency>
```

然后，在一个配置类（使用 `@Configuration`注解）或你的主启动类上加上 `@EnableRetry`注解来启用重试功能：

```
@Configuration
@EnableRetry // 就是它了
public class AppConfig {
    // ... 其他配置
}
```

### ⚙️ 配置重试行为

#### **1. `@Retryable`- 核心重试注解**

`@Retryable`注解用于标记那些在遇到特定异常时需要重试的方法。

- **基本用法**：

  ```
  @Service
  public class MyService {
  
      @Retryable(value = RuntimeException.class) // 遇到RuntimeException就重试
      public void serviceMethod() {
          // 可能失败的业务逻辑
      }
  }
  ```

- **常用参数**：

  - **`value`或 `include`**: 指定**需要重试的异常类型**数组。例如 `@Retryable(value = {IOException.class, SQLException.class})`。
  - **`exclude`**: 指定**不进行重试的异常类型**。
  - **`maxAttempts`**: **最大重试次数**（包括第一次调用）。默认是3次。
  - **`backoff`**: 通过 `@Backoff`注解**配置重试之间的延迟策略**。

#### **2. `@Backoff`- 控制重试间隔**

`@Backoff`注解用于定制重试的等待时间，避免立即重试给系统带来压力。

- **固定间隔重试**：

  ```
  @Retryable(
    value = {RemoteAccessException.class},
    maxAttempts = 5,
    backoff = @Backoff(delay = 2000) // 每次重试间隔2秒
  )
  public void callApi() {
      // ...
  }
  ```

- **指数退避重试**（延迟时间随重试次数指数增长）：

  ```
  @Retryable(
    value = {RemoteAccessException.class},
    maxAttempts = 4,
    backoff = @Backoff(delay = 1000, multiplier = 2, maxDelay = 5000)
    // 初始延迟1秒，下次2秒，再下次4秒，最大不超过5秒
  )
  public void callApi() {
      // ...
  }
  ```

- **随机延迟重试**（避免多个客户端同时重试形成“重试风暴”）：

  ```
  @Retryable(
    value = {RemoteAccessException.class},
    maxAttempts = 3,
    backoff = @Backoff(delay = 1000, maxDelay = 3000, random = true)
    // 延迟时间在1秒到3秒之间随机
  )
  public void callApi() {
      // ...
  }
  ```

#### **3. `@Recover`- 重试失败后的降级处理**

当所有重试尝试都失败后，你可以使用 `@Recover`注解定义一个恢复方法来执行降级逻辑，如记录日志、返回默认值或进行补偿操作。

- **定义恢复方法**：

  ```
  @Service
  public class MyService {
  
      @Retryable(value = IOException.class, maxAttempts = 3)
      public String readFile() throws IOException {
          // 尝试读取文件
      }
  
      @Recover // 当所有重试失败后，会调用这个方法
      public String recover(IOException e) {
          // 降级逻辑，例如返回一个默认内容或记录告警
          return "Default Content";
      }
  }
  ```

  **注意**：`@Recover`方法的**第一个参数必须是重试方法抛出的异常类型**，返回类型应与重试方法一致。

#### **4. `@CircuitBreaker`- 熔断器注解**

对于可能长时间不可用的服务，可以使用 `@CircuitBreaker`实现熔断模式，防止持续重试消耗资源。

```
@CircuitBreaker(
  value = RemoteAccessException.class,
  maxAttempts = 5, // 在熔断前尝试的次数
  openTimeout = 5000, // 熔断器打开后的持续时间(毫秒)
  resetTimeout = 10000 // 熔断器进入半开状态前的等待时间(毫秒)
)
public void callUnstableService() {
    // ...
}
```

**熔断器工作流程**：

1. **关闭（Closed）**：正常状态，失败次数未达阈值。
2. **打开（Open）**：失败次数达到阈值，熔断器打开，**短时间内所有请求立即失败，不再重试**。
3. **半开（Half-Open）**：经过 `resetTimeout`后，熔断器允许少量请求通过。若成功则关闭熔断器，恢复常态；若失败则再次打开。

### 💡 进阶特性与最佳实践

- **Spring Framework 7.0 的内置支持**：从 Spring Framework 7.0 开始，重试和容错功能（包括 `@Retryable`和新的 `@ConcurrencyLimit`）已**集成到框架核心模块中**，无需单独引入 `spring-retry`依赖。

- **`@ConcurrencyLimit`**：此注解可用于**限制方法的并发调用数**，防止过载。

  ```
  @ConcurrencyLimit(10) // 最多允许10个并发请求
  public void handleRequest() {
      // ...
  }
  ```

- **响应式支持**：Spring Retry 也支持对 Reactor 等响应式流进行重试装饰。

- **注意事项**：

  - 被 `@Retryable`注解的方法必须是 **`public`** 的。
  - 避免在**同一个类内部**调用重试方法，因为基于AOP的代理可能不生效。
  - 重试逻辑会**增加响应时间和资源消耗**，请谨慎设置重试次数和延迟策略，尤其在高并发场景下。
  - 并非所有异常都适合重试（如业务逻辑错误），重试应主要用于处理**瞬时故障**（网络超时、数据库连接短暂失效等）。

Spring Retry 通过声明式的注解，让我们能以非常简洁和清晰的方式为方法增添 resiliency（弹性）能力。正确配置和使用这些注解，能显著提升应用程序应对不可靠依赖和网络波动的能力。

希望这些信息能帮助你更好地使用 Spring Retry。

## @Recover

`@Recover`注解的**生效范围确实仅限于它所在的类**。它只能处理**同一个类中**被 `@Retryable`注解标记的方法在重试全部失败后的恢复逻辑。

为了让你快速理解 `@Recover`的工作规则，我用一个表格来概括其核心要点：

| 特性维度           | 规则说明                                                     | 示例或备注                                                   |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **类内生效**       | `@Recover`方法**必须**与对应的 `@Retryable`方法在**同一个类**中定义。 | 无法捕获和处理其他类中方法的重试失败。                       |
| **异常类型匹配**   | `@Recover`方法的**第一个参数**必须是 `Throwable`类型或其子类，且通常应与 `@Retryable`方法配置的异常类型一致或为其父类。 | `@Retryable(value = IOException.class)`对应 `@Recover public void recover(IOException e)` |
| **参数列表匹配**   | `@Recover`方法的参数（除第一个异常参数外）应与 `@Retryable`方法的参数**保持一致**（包括参数类型和顺序）。 | `@Retryable(String a, int b)`对应 `@Recover(...Exception e, String a, int b)` |
| **返回值匹配**     | `@Recover`方法的**返回值类型**必须与 `@Retryable`方法的返回值类型**完全相同**。 | 如果 `@Retryable`返回 `String`，`@Recover`也必须返回 `String`。 |
| **方法匹配优先级** | 当有多个 `@Recover`方法时，Spring Retry 会选择**异常类型最具体、参数最兼容**的那个。 | 若有 `recover(IOException e)`和 `recover(Exception e)`，当抛出 `IOException`时会优先匹配前者。 |

📌 **如何正确使用 `@Recover`**

确保 `@Recover`方法按预期工作，需满足以下条件：

1. **类内定义**：`@Recover`方法必须和它要处理的 `@Retryable`方法在**同一个类中**。
2. **参数匹配**：
   - **第一个参数必须是异常类型**，且应与 `@Retryable`中指定的异常类型匹配或更通用。
   - **后续参数应与 `@Retryable`方法的参数列表一致**（包括类型和顺序）。你可以选择接收所有参数，或只接收需要的部分，但**顺序必须一致**。
3. **返回值匹配**：`@Recover`方法的**返回类型必须与 `@Retryable`方法完全相同**。

🧩 **同一类中有多个 `@Recover`方法时如何区分？**

当一个类中有多个 `@Retryable`和 `@Recover`方法时，Spring Retry 通过**异常类型**和**方法参数**来匹配。

```
@Service
public class MyService {

    @Retryable(value = IOException.class, maxAttempts = 3)
    public String methodA(String fileName) throws IOException {
        // 尝试读取文件，可能抛出IOException
        return "Content from " + fileName;
    }

    @Retryable(value = SQLException.class, maxAttempts = 3)
    public void methodB(Integer id) throws SQLException {
        // 数据库操作，可能抛出SQLException
    }

    // 匹配methodA的恢复方法
    @Recover
    public String recoverForIOException(IOException e, String fileName) {
        return "Recovered from IOException for file: " + fileName + "; Error: " + e.getMessage();
    }

    // 匹配methodB的恢复方法
    @Recover
    public void recoverForSQLException(SQLException e, Integer id) {
        // 处理SQLException的恢复逻辑，记录日志等
        System.out.println("Recovered from SQLException for ID: " + id);
    }

    // 一个更通用的恢复方法，处理其他未明确指定的异常
    @Recover
    public String genericRecover(Exception e, Object... args) {
        // 处理其他异常或作为兜底
        return "Generic recovery after all retries failed for: " + e.getMessage();
    }
}
```

在这个例子中：

- 当 `methodA`重试失败后，会调用 `recoverForIOException`。
- 当 `methodB`重试失败后，会调用 `recoverForSQLException`。
- 如果有一个 `@Retryable`方法抛出的异常未被前两个 `@Recover`方法明确匹配，且其参数与 `genericRecover`兼容（注意它是 `Object... args`），则可能会调用 `genericRecover`。

💡 **注意事项**

1. **避免自调用**：由于 `@Retryable`和 `@Recover`基于 **Spring AOP 代理**实现，所以**在同一个类内部的一个方法直接调用另一个 `@Retryable`方法时，重试和恢复逻辑会失效**。务必通过外部调用或从Spring容器中获取代理后的Bean来调用。
2. **确保幂等性**：由于方法会被多次重试，务必保证 `@Retryable`标记的方法的**幂等性**，即多次执行不会产生副作用。
3. **谨慎设置重试**：避免无限重试或重试间隔过短，以免对下游服务造成过大压力。重试适用于**临时性故障**（如网络波动、瞬时超时），而非业务逻辑错误。

希望这些信息能帮助你更好地理解和使用 `@Recover`注解。

## 类级 Retryable

`@Retryable`注解**可以添加到类上**。当它用于类级别时，表示**这个类中的所有 `public`方法**都会成为可重试的方法。

为了让你能快速了解 `@Retryable`在方法级别和类级别应用的主要区别，我用一个表格来汇总：

| 特性维度       | 方法级别使用 `@Retryable`                                 | 类级别使用 `@Retryable`                        |
| -------------- | --------------------------------------------------------- | ---------------------------------------------- |
| **作用范围**   | 仅作用于被注解的**单个方法**                              | 作用于该类的**所有 `public`方法**              |
| **配置灵活性** | 可以为**每个方法单独定制**重试策略（异常、次数、延迟等）  | 通常为该类所有方法提供**统一的默认重试策略**   |
| **适用场景**   | 需要为不同方法设置不同重试规则时                          | 类中多个方法需要**共享相同**的重试策略时       |
| **控制精度**   | **高**，可精准控制每个方法的行为                          | **相对较低**，依赖类级别的统一配置             |
| **常用属性**   | `value`, `include`, `exclude`, `maxAttempts`, `backoff`等 | `include`, `exclude`, `maxAttempts`, `delay`等 |

📌 **类级别使用示例与要点**

```
@Service
@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000)) // 应用于整个类
public class MyService {

    // 此方法会继承类级别的重试配置：最多重试3次，每次间隔1秒
    public void methodOne() {
        // ... 可能抛出异常的业务逻辑
    }

    // 此方法也会继承类级别的重试配置
    public void methodTwo() {
        // ... 可能抛出异常的业务逻辑
    }

    // 即使类级别有配置，方法级别的注解也会覆盖类级别的配置。此方法会使用自己的重试策略：最多重试5次
    @Retryable(maxAttempts = 5)
    public void methodThree() {
        // ... 可能抛出异常的业务逻辑
    }
}
```

⚡ **注意事项**

1. **只对 public 方法生效**：Spring Retry 基于 AOP 实现，因此 `@Retryable`（无论是类级别还是方法级别）**只对 `public`方法有效**。对 `protected`、`private`或默认权限的方法无效。
2. **避免同类调用**：如果一个类中的某个方法（比如 `methodA`）**直接调用**了同一个类中的另一个 `@Retryable`方法（比如 `methodB`），那么 `methodB`的重试逻辑**会失效**。这是因为 Spring AOP 代理机制的限制。调用必须通过代理对象进行，通常意味着方法需要被外部类调用。
3. **谨慎配置异常类型**：在类级别使用 `@Retryable`时，如果不使用 `include`或 `exclude`细化异常类型，默认可能会对许多异常进行重试。建议**根据业务场景，使用 `include`或 `exclude`属性来明确指定需要或不需要重试的异常类型**，以避免对不期望的异常（如 `NullPointerException`等代码错误）进行重试。

💡 **实用建议**

- **共享通用配置**：如果一个类中有多个方法需要**相同的重试策略**（例如，调用同一个不稳定外部服务的多个方法），那么在类级别使用 `@Retryable`非常方便，能避免重复配置。
- **需要特例时覆写**：如果类中大多数方法适用通用重试策略，但少数方法需要特殊配置，你可以在类级别定义通用规则，然后在那些需要定制的方法上单独使用 `@Retryable`进行覆盖。
- **明确异常范围**：在类级别使用 `@Retryable`时，**强烈建议通过 `include`或 `exclude`属性明确指定要重试或排除的异常类型**，以增强代码的可控性和可维护性。

希望这些信息能帮助你更好地理解和使用 `@Retryable`注解。

## 缓存



## 类级缓存

Spring 框架的缓存注解中，主要有 **`@Cacheable`** 和 **`@CachePut`** 这两个注解既可以标注在方法上，也可以标注在类上。

为了让你能快速了解这些注解在类和方法上的使用特点，我用一个表格来汇总：

| 注解               | 类级别使用                                                   | 方法级别使用                                                 | 说明                                                         |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **`@Cacheable`**   | 表示该**类所有 `public`方法**的支持缓存。                    | 表示该方法是支持缓存的。                                     | 类级别可为所有方法提供**默认缓存行为**，方法级别注解可**覆盖**类级别的定义。 |
| **`@CachePut`**    | 表示该**类所有 `public`方法**的执行结果都会更新缓存。        | 表示该方法的执行结果会更新缓存。                             | 类级别可为所有方法提供**默认缓存更新行为**，方法级别注解可**覆盖**类级别的定义。 |
| **`@CacheEvict`**  | （由源码可得可类级别）                                       | 用于在方法执行后（或之前）清除缓存。                         | 通常用于方法级别，以精确控制缓存清除操作。                   |
| **`@Caching`**     | （由源码可得可类级别）                                       | 用于组合多个缓存操作（如同时使用 `@Cacheable`、`@CachePut`、`@CacheEvict`）于一个方法。 | 通常用于方法级别，处理复杂的缓存逻辑。                       |
| **`@CacheConfig`** | 用于类级别，**共享**缓存配置（如 `cacheNames`、`keyGenerator`），简化方法级别注解的配置。 | 不直接用于方法。                                             | 这是一个**类级别**的配置注解，旨在减少方法级别注解的重复配置。 |

📌 **补充说明**

- **`@CacheConfig`**：这是一个特殊的**类级别注解**，它本身不直接触发任何缓存操作，而是为类中的其他缓存注解（如 `@Cacheable`, `@CachePut`, `@CacheEvict`）提供**共享的默认配置**，从而避免在每个方法上重复相同的配置。

💡 **实用建议**

- **谨慎使用类级别注解**：在类上使用 `@Cacheable`或 `@CachePut`意味着该类的**所有 `public`方法**都将应用缓存规则。这可能导致一些不需要缓存的方法（如简单查询、频繁更新方法）也被缓存，从而**浪费资源或产生数据不一致**。通常建议根据实际需求，在具体方法上使用相应的缓存注解。
- **优先级**：当方法级别和类级别都有相同类型的缓存注解时，**方法级别的注解配置会覆盖类级别的默认配置**。
- **结合 `@CacheConfig`**：为了保持代码简洁，可以使用 `@CacheConfig`在类级别定义一些通用的缓存设置（如 `cacheNames`），然后在方法级别的注解中只需指定必要的属性（如 `key`或 `condition`）。

希望这些信息能帮助你更好地理解和使用 Spring 缓存注解。



