---
title: 【Shopee】Config Priority
date: 2025-08-21 00:00:00+0000
categories: [nutrition]
tags: [Shopee]
---

## 配置优先级

在Spring Boot的配置体系中，`application.yaml`（默认配置文件）和`application-{env}.yaml`（环境特定配置文件，如`application-prod.yaml`）的优先级遵循明确的规则，核心原则是**环境配置优先于默认配置**。以下是具体分析：

------

### ⚙️ **1. 基本优先级规则**

- **环境配置文件 > 默认配置文件**

  当通过`spring.profiles.active`激活某个环境（如`prod`）时，`application-prod.yaml`中的配置会覆盖`application.yaml`中的同名配置项。若配置项不同，则合并生效。

- **示例**：

  - `application.yaml`设置 `server.port: 8080`

  - `application-prod.yaml`设置 `server.port: 80`

    激活`prod`环境后，最终端口为 `80`。

------

### 🔧 **2. 环境配置的激活方式**

环境配置文件的生效依赖于**显式激活环境**，方式包括：

1. **配置文件指定**

   在`application.yaml`中声明：

   ```
   spring:
     profiles:
       active: prod   # 激活prod环境
   ```

2. **命令行参数**

   启动时动态指定：

   ```
   java -jar app.jar --spring.profiles.active=prod
   ```

   命令行优先级最高，可覆盖配置文件中的`active`设置。

3. **环境变量**

   通过操作系统环境变量设置：

   ```
   export SPRING_PROFILES_ACTIVE=prod
   ```

------

### 🔄 **3. 配置覆盖与合并机制**

- **同名配置项**：环境配置文件直接覆盖默认配置。

- **异名配置项**：环境配置与默认配置合并，共同生效。

  *例如：*

  - `application.yaml`定义数据库公共参数（如`db.url`）。
  - `application-prod.yaml`仅覆盖密码（`db.password`），其他参数继承默认值。

------

### 📊 **4. 完整配置源优先级链条**

环境配置文件（`application-{env}.yaml`）的优先级需置于整个配置体系中理解。**从高到低**的完整顺序为：

1. **命令行参数**（如 `--server.port=8081`）
2. **环境变量**（如 `SPRING_PROFILES_ACTIVE=prod`）
3. **外部配置文件**（如Jar包外部的`config/application-prod.yaml`）
4. **内部环境配置文件**（如`classpath:/application-prod.yaml`）
5. **内部默认配置文件**（如`classpath:/application.yaml`）
6. `@PropertySource`注解或默认配置。

> ✅ **关键结论**：
>
> `application-{env}.yaml`优先级高于 `application.yaml`，但低于命令行参数、环境变量及外部配置文件。

------

### ⚠️ **5. 注意事项**

1. **文件格式优先级**：

   若同一位置存在不同格式文件（如`application-prod.properties`和`application-prod.yaml`），**`.properties`优先级高于`.yaml`** 。

2. **多环境配置冲突**：

   激活多个环境时（如`--spring.profiles.active=dev,prod`），按**从左到右顺序加载**，右侧覆盖左侧同名配置。

3. **Profile分组**：

   可通过`spring.profiles.group`合并环境配置组（如`production = prod1,prod2`），再用`--spring.profiles.active=production`激活整组。

------

### 💎 **总结**

- **默认规则**：`application-{env}.yaml`**>** `application.yaml`（需显式激活环境）。
- **灵活控制**：通过命令行、环境变量或配置文件动态切换环境，实现配置覆盖。
- **最佳实践**：
  - 通用配置（如日志级别）放在`application.yaml`。
  - 环境差异配置（如数据库连接、端口）放在`application-{env}.yaml`。
  - 敏感信息（如密码）通过命令行或外部配置注入，避免硬编码。

## 子模块

在Spring Cloud微服务架构中，**每个微服务通常是一个独立的子模块**，但这并非绝对要求，而是取决于项目结构的设计选择。以下是具体分析：

------

### ✅ **1. 微服务作为子模块的常见实践**

在基于Maven或Gradle的多模块项目中，每个微服务通常被设计为一个独立的子模块。这种结构具有以下优势：

- **统一依赖管理**：父模块（Parent Module）统一管理Spring Boot、Spring Cloud版本及公共依赖，避免版本冲突。
- **代码隔离与独立部署**：每个微服务子模块（如`order-service`、`user-service`）拥有独立的代码库、配置和启动类，可独立编译、测试和部署。
- **团队协作友好**：不同团队可并行开发各自负责的微服务模块，减少代码冲突。

**典型项目结构示例**：

```
spring-cloud-project/  
├── parent-module/              # 父模块（统一依赖管理）
├── order-service/              # 订单微服务（子模块）
│   ├── src/  
│   ├── pom.xml                 # 专属依赖配置  
├── user-service/               # 用户微服务（子模块）
│   ├── src/  
│   ├── pom.xml  
├── api-gateway/                # API网关（子模块）
└── eureka-server/              # 注册中心（子模块）
```

> 注：每个微服务子模块均为独立Spring Boot应用，通过父模块协调依赖。

------

### ⚠️ **2. 微服务不作为子模块的场景**

某些项目可能采用**完全独立的代码仓库**（而非子模块），此时微服务间无直接代码依赖：

- **技术栈异构性**：不同微服务可使用不同语言（如Java + Go）或框架，无法通过父模块统一管理。
- **独立演进需求**：大型团队中，服务需完全解耦，独立版本发布（如订单服务v1.2，用户服务v1.5）。
- **避免循环依赖**：子模块间若相互引用（如A依赖B，B又依赖A），会导致Maven构建失败。

**独立仓库的通信方式**：

- 通过HTTP/REST、gRPC或消息队列（如Kafka）远程调用。
- 依赖服务注册中心（如Eureka）动态发现服务实例。

------

### 🔧 **3. 关键设计考量因素**

| **因素**         | **作为子模块**             | **独立仓库**                   |
| ---------------- | -------------------------- | ------------------------------ |
| **依赖管理**     | 父模块统一管理，减少冲突   | 各服务独立管理，可能版本不一致 |
| **构建与部署**   | 可整体构建，但需独立部署   | 完全独立构建部署               |
| **团队协作**     | 适合中小团队，依赖协调简单 | 适合大型团队，完全解耦         |
| **技术栈灵活性** | 受限（需兼容父模块约束）   | 自由选择不同技术栈             |
| **代码复用**     | 通过公共子模块共享工具类   | 需复制代码或发布共享库         |

> 💡 **推荐选择**：
>
> - **中小型项目**：优先采用多模块结构，简化依赖管理。
> - **大型分布式系统**：微服务独立仓库，通过API契约和注册中心协作。

------

### 🛠️ **4. 实现建议**

若采用子模块方案，需注意：

1. **明确模块边界**：按业务功能拆分（如订单、用户），避免模块职责重叠。
2. **定义公共模块**：抽取工具类、DTO、Feign客户端接口到独立子模块（如`common-utils`），供其他微服务依赖。
3. **禁用直接数据库访问**：微服务间仅通过API通信，数据库严格隔离（如订单服务不直接查询用户库）。

------

### 💎 **总结**

在Spring Cloud微服务架构中，**每个微服务通常设计为Maven/Gradle子模块**，以简化依赖管理和项目结构；但在需要技术异构性或完全解耦的场景下，**微服务也可作为独立代码仓库存在**。实际选择需权衡项目规模、团队协作和技术需求。

## JPMS

Maven/Gradle 子模块和 Java 中的 Module（JPMS）**不是一回事**。它们分别属于**构建工具的项目管理**和 **Java 语言层面的运行时封装**两个不同维度，虽有交集但核心目标和技术实现差异显著。以下是详细对比分析：

------

### 📦 **1. 核心概念与目标**

| **维度**     | **Maven/Gradle 子模块**                                      | **Java Module (JPMS)**                                    |
| ------------ | ------------------------------------------------------------ | --------------------------------------------------------- |
| **定义层级** | 构建工具（Build Tool）的项目管理单元                         | Java 语言规范（JSR 376）的运行时封装单元                  |
| **主要目的** | 代码组织、依赖复用、构建效率优化（如分模块编译）             | 强封装性、显式依赖管理、运行时安全隔离（解决 "JAR Hell"） |
| **核心机制** | 父项目聚合子模块，通过配置文件（`pom.xml`/`build.gradle`）管理依赖与构建流程 | 通过 `module-info.java`声明模块边界、导出包和依赖关系     |
| **作用阶段** | **构建时**（开发阶段）                                       | **编译时 + 运行时**（影响类加载机制）                     |

------

### ⚙️ **2. 技术实现对比**

#### **Maven/Gradle 子模块**

- **配置方式**
  - **Maven**：父 POM 通过 `<modules>`定义子模块，子模块继承父依赖（`<dependencyManagement>`）。
  - **Gradle**：根项目通过 `settings.gradle`的 `include`声明子模块，依赖通过 `implementation project(':sub')`引用。
- **核心作用**
  - 模块间代码隔离（如微服务的独立服务模块）。
  - 统一管理依赖版本（避免冲突）。
  - 支持增量构建（仅编译修改的模块）。

#### **Java Module (JPMS)**

- **配置方式**

  - 每个模块需定义 `module-info.java`，声明：

    ```
    module com.example.core {
        requires java.sql;          // 依赖其他模块
        exports com.example.api;    // 导出公共 API
        opens com.example.impl;     // 允许反射访问
    }
    ```

- **核心作用**

  - **强封装**：未导出（`exports`）的包对其他模块不可见（即使 public 类）。
  - **依赖显式化**：编译期和运行时会检查 `requires`声明的依赖是否满足。
  - **运行时优化**：通过 `jlink`生成最小化 JRE（仅包含所需模块）。

------

### 🔗 **3. 关联性与协作场景**

虽然两者独立，但在项目中可协同工作：

1. **子模块作为 Java Module**
   - 每个构建子模块（如 `user-service`）可独立定义为 Java Module（含 `module-info.java`），实现业务逻辑的运行时隔离。
2. **依赖传递的差异**
   - **构建工具依赖**：子模块 A 依赖 B，仅需在 `build.gradle`声明 `implementation project(':B')`。
   - **JPMS 依赖**：模块 A 需在 `module-info.java`中显式声明 `requires B`，否则无法访问 B 的导出包。
3. **兼容性处理**
   - 非模块化 JAR（如传统库）可作为**自动模块**（Automatic Module）或放入**类路径**（未命名模块）使用。

------

### ⚖️ **4. 关键差异总结**

| **特性**           | Maven/Gradle 子模块           | Java Module                    |
| ------------------ | ----------------------------- | ------------------------------ |
| **问题域**         | 项目构建管理与组织            | 代码封装与运行时安全           |
| **配置文件**       | `pom.xml`/ `build.gradle`     | `module-info.java`             |
| **依赖范围**       | 构建期 + 编译期（传递性依赖） | 编译期 + 运行时（显式声明）    |
| **跨模块访问控制** | 无强制限制（代码可见即可用）  | 严格通过 `exports`/`opens`控制 |
| **工具支持**       | Maven/Gradle 插件             | JDK 内置（Java 9+）            |

------

### 💡 **5. 实际应用建议**

- **新项目**：
  - 优先用 **Gradle/Maven 子模块**管理代码结构，提升构建效率。
  - 核心服务模块可启用 **JPMS**，强化边界设计（如 API 模块 `exports`接口，实现模块隐藏细节）。
- **遗留系统迁移**：
  - 先拆分为构建子模块，再逐步为关键模块添加 `module-info.java`。
  - 使用 `jdeps`分析依赖，解决非法反射访问（`--add-opens`临时绕过）。

> **特别注意**：
>
> - 构建工具的子模块是**物理层级划分**（目录分离），Java Module 是**逻辑边界封装**（包可见性控制）。
> - Spring Boot 等框架需配合 `spring-modulith`等方案适配 JPMS，避免反射访问失败。

通过厘清两者定位，可在项目中分层应用：**构建工具解决工程效率问题，JPMS 解决架构治理问题**，共同打造高内聚、低耦合的现代化 Java 应用。

## 区别

在 Java 项目架构中，将 Gradle/Maven 子模块视为一个**逻辑上的整体 Java Module** 是合理的理解方式。这种逻辑统一性源于项目设计的模块化目标，但需结合构建工具与语言规范的具体实现机制来分层解读。以下是综合分析：

------

### ✅ **1. 逻辑统一性的依据**

- **共同目标与边界**

  多个子模块（如 `user-service`、`order-service`）服务于同一个业务系统，通过**父模块统一管理依赖和配置**（如 Maven 的父 POM 或 Gradle 的根构建脚本），形成内聚的代码单元。这种设计符合模块化“高内聚、低耦合”的核心原则，可视为逻辑整体 。

- **显式依赖关系**

  子模块间通过构建工具声明依赖（如 Gradle 的 `implementation project(':module')`或 Maven 的子模块坐标引用），构成**有向无环图（DAG）**，共同实现业务功能 。

------

### ⚠️ **2. 与 Java Module (JPMS) 的本质区别**

尽管子模块在逻辑上属于同一项目，但**不等于 JPMS 的 Module**，差异主要体现在：

| **维度**     | 构建工具子模块 (Gradle/Maven)    | Java Module (JPMS)                     |
| ------------ | -------------------------------- | -------------------------------------- |
| **核心目标** | 代码组织、依赖管理、构建效率优化 | 强封装性、运行时隔离、显式依赖管理     |
| **配置方式** | `pom.xml`/ `build.gradle`        | `module-info.java`                     |
| **作用阶段** | 开发与构建时                     | 编译时 + 运行时                        |
| **访问控制** | 无强制封装（代码可见即可用）     | 严格通过 `exports`/`opens`控制包可见性 |
| **技术实现** | 物理目录隔离                     | 逻辑边界封装（JVM 类加载机制）         |

> **关键区别**：
>
> - 子模块是**物理层级划分**（目录分离），JPMS 是 **JVM 层级的逻辑封装**（包可见性控制）。

------

### 🔧 **3. 协作场景：逻辑整体性的实现方式**

虽然技术实现分离，但两者可协同强化模块化设计：

1. **子模块作为 JPMS 的基础单元**

   每个构建子模块（如 `common-utils`）可独立定义为 Java Module（含 `module-info.java`），实现业务内聚与运行时隔离的双重目标 。

2. **依赖传递的协同管理**

   - **构建工具依赖**：在 `build.gradle`中声明 `implementation project(':B')`

   - **JPMS 依赖**：在 `module-info.java`中显式声明 `requires B`

     两者共同确保模块间依赖的显式化和一致性 。

3. **规避冲突**

   父模块统一管理依赖版本（如 Maven 的 `<dependencyManagement>`），避免子模块间或 JPMS 的版本冲突 。

------

### 💎 **总结：分层理解逻辑整体性**

- **项目架构层**：✅ **是逻辑整体**

  Gradle/Maven 多模块项目通过父模块统一配置、子模块协同实现业务目标，构成完整的应用系统 。

- **语言规范层**：❌ **不是 JPMS Module**

  子模块无运行时强封装能力，需额外通过 `module-info.java`实现 JPMS 的隔离 。

- **最佳实践**：

  - **新项目**：用构建工具管理物理结构（子模块），为核心模块添加 JPMS 封装 。
  - **遗留系统**：先拆分为子模块，再逐步引入 JPMS 治理边界 。

> **示例关系图**：
>
> ```
> 逻辑项目 (MyApp)
> ├── 构建子模块 [Maven/Gradle]
> │   ├── user-service (含 module-info.java → JPMS Module)
> │   └── order-service (依赖 user-service)
> └── 父模块 (统一依赖管理)
> ```
>
> *通过分层设计，兼顾工程效率与架构治理*。

## 访问权限

在 Java 中，`protected`、`default`（无修饰符）和 `private`是三种访问修饰符，用于控制类成员的可见性和访问范围。它们的核心区别在于**访问权限的严格程度和应用场景**，具体对比如下：

------

### 📊 **访问范围对比表**

| **访问修饰符** | **当前类** | **同一包内** | **不同包子类** | **其他包（非子类）** |
| -------------- | ---------- | ------------ | -------------- | -------------------- |
| `private`      | ✔          | ✖            | ✖              | ✖                    |
| `default`      | ✔          | ✔            | ✖              | ✖                    |
| `protected`    | ✔          | ✔            | ✔              | ✖                    |

> **注**：`default`是隐式修饰符（不写任何关键字），`protected`和 `private`需显式声明。

------

### 🔍 **详细区别解析**

1. **`private`（最严格）**

   - **访问范围**：仅限**当前类内部**，其他类（包括同包或子类）均不可访问。

   - **使用场景**：

     - 封装敏感数据（如密码），通过 `getter/setter`方法间接访问。
     - 隐藏工具方法（如内部计算逻辑），避免外部调用。

   - **示例**：

     ```
     public class User {
         private String password; // 仅本类可访问
     }
     ```

2. **`default`（包级私有）**

   - **访问范围**：**当前类 + 同一包内的其他类**。不同包中的类（包括子类）均不可访问。

   - **使用场景**：

     - 共享工具类或配置给同包模块（如工具类 `StringUtils`）。
     - 限制跨包访问，实现模块化封装。

   - **示例**：

     ```
     class Logger { // 默认修饰符
         void log(String message) { // 同包内可调用
             System.out.println(message);
         }
     }
     ```

3. **`protected`（继承友好）**

   - **访问范围**：**当前类 + 同一包内类 + 不同包子类**。非子类的外部包类不可访问。

   - **使用场景**：

     - 父类定义可被子类重写的方法（如模板方法模式）。
     - 子类需直接访问父类成员（如 `protected int id;`）。

   - **示例**：

     ```
     public class Animal {
         protected void breathe() { // 子类可访问
             System.out.println("Breathing...");
         }
     }
     public class Dog extends Animal {
         public void test() {
             breathe(); // ✔ 子类调用父类protected方法
         }
     }
     ```

------

### ⚠️ **关键注意事项**

1. **类修饰符的限制**：
   - `private`和 `protected`**不能修饰外部类**（仅能修饰内部类），外部类只能用 `public`或 `default`。
2. **继承中的可见性**：
   - 子类可访问父类的 `protected`成员，但**不能访问 `private`成员**（即使继承也隐藏）。
3. **设计原则**：
   - **封装性优先**：尽量用 `private`，必要时通过 `protected`开放给子类，避免滥用 `public`。
   - **包内协作**：同包模块间用 `default`共享，减少跨包耦合。

------

### 💎 **总结：选择策略**

- **`private`**：隐藏实现细节，强制通过接口访问。
- **`default`**：同包内共享工具或配置，禁止跨包访问。
- **`protected`**：支持跨包继承，允许子类扩展父类行为。

> 实际开发中，**优先选择最严格的权限**（如能用 `private`则不用 `default`），再按需放宽。

## @Order

在 Java Spring 框架中，当多个相同类型的 `@Component`中部分指定了 `@Order`值而其他未指定时，其行为主要由以下规则决定：

### ⚙️ 1. **默认值机制**

- **未指定 `@Order`的组件**：会被隐式赋予默认值 `Ordered.LOWEST_PRECEDENCE`（即 `Integer.MAX_VALUE`），表示最低优先级。
- **指定 `@Order`的组件**：按注解值排序，值越小优先级越高（例如 `@Order(1)`优先于 `@Order(2)`）。

### 🔀 2. **排序规则与位置**

- **整体排序逻辑**：所有组件按优先级分组排序：
  - 最高优先级：实现 `PriorityOrdered`接口的组件（如框架内部扩展）。
  - 中等优先级：显式指定 `@Order`或实现 `Ordered`接口的组件。
  - **最低优先级**：未指定 `@Order`的组件（默认 `Integer.MAX_VALUE`）。
- **未指定值组件的顺序**：
  - 在注入集合（如 `List<Service>`）时，它们会**排在所有有序组件之后**。
  - 多个未指定值的组件之间**顺序不确定**（可能受类加载顺序影响）。

### ⚠️ 3. **典型场景示例**

- **集合注入顺序**：

  ```
  @Component @Order(1) class ServiceA implements MyService {}
  @Component @Order(2) class ServiceB implements MyService {}
  @Component class ServiceC implements MyService {} // 默认 Order=Integer.MAX_VALUE
  
  @Autowired
  private List<MyService> services; // 顺序：ServiceA → ServiceB → ServiceC
  ```

- **执行顺序**：在切面（AOP）、过滤器（Filter）、事件监听器等场景中，未指定值的组件最后执行。

### 🛠️ 4. **冲突与注意事项**

- **相同 `@Order`值**：若多个组件指定相同值（如均 `@Order(1)`），其相对顺序不确定。
- **与 `@Primary`的关系**：`@Primary`注解的组件在单独注入时优先，但不影响集合中的排序。
- **性能影响**：大规模组件排序可能增加启动开销，建议仅对必要组件显式指定顺序。

### 💎 总结

未指定 `@Order`的组件会以最低优先级（`Integer.MAX_VALUE`）参与排序，始终位于有序组件之后，且同类未指定组件间顺序不可控。若需精确控制顺序，应为所有组件显式赋值并预留间隔值（如 `@Order(100)`、`@Order(200)`）。

> 💡 **最佳实践**：使用常量类管理顺序值（如 `OrderConstants.SECURITY_FILTER`），并添加文档说明优先级逻辑。

## Loggig.level.root

在 Spring Boot 中，`logging.level.root`是一个非常重要的日志配置属性，它用于设置**根日志记录器 (Root Logger) 的日志级别**，充当所有其他日志记录器的默认父级和全局控制器。

它的核心作用是**统一控制应用程序中所有未被特定包或类单独设置级别的日志输出**。

### 📊 理解日志级别

日志级别从低到高通常分为：

```
TRACE`< `DEBUG`< `INFO`< `WARN`< `ERROR`< `FATAL`/`OFF
```

设置某一级别后，只有该级别及更高级别的日志信息会被输出。例如，若设置 `logging.level.root=INFO`，则 `INFO`、`WARN`、`ERROR`级别的日志会被输出，而 `TRACE`和 `DEBUG`级别的日志则不会被输出。

### 🔧 logging.level.root 的作用与配置

`logging.level.root`为整个应用提供了一个默认的日志级别基准。这意味着任何没有在 `logging.level.<package-or-class>`中明确指定级别的包或类，都会继承这个根日志记录器设置的级别。

**常见配置示例（在 `application.properties`或 `application.yml`中）**：

```
# 设置根日志级别为 WARN
logging.level.root = WARN

# 为特定包或类设置不同的日志级别
logging.level.org.springframework.web = DEBUG
logging.level.com.yourcompany.service = INFO
logging.level.com.yourcompany.security = TRACE
```

在上述配置中：

- 所有未被明确设置的组件（包、类）的日志级别默认为 `WARN`。
- `org.springframework.web`包下的日志级别被设置为 `DEBUG`（适用于调试Web相关问题时）。
- `com.yourcompany.service`包下的日志级别被设置为 `INFO`。
- `com.yourcompany.security`包下的日志级别被设置为 `TRACE`（可能会输出非常详细的流程信息，用于深入追踪安全相关问题）。

### 📝 配置示例与写法

您可以在 `application.properties`或 `application.yml`文件中配置 `logging.level.root`。

**在 application.properties 中的写法：**

```
logging.level.root=INFO
```

**在 application.yml 中的写法：**

```
logging:
  level:
    root: INFO
    org.springframework: WARN
    com.example.demo: DEBUG
    com.example.demo.service.MyService: ERROR
```

### 📌 最佳实践和注意事项

1. **环境区分**：建议根据不同的环境（开发、测试、生产）设置不同的根日志级别。在生产环境，为了性能和安全性，通常设置为 `WARN`或 `ERROR`；在开发环境，为了便于调试，可以设置为 `DEBUG`或 `TRACE`。
2. **配合特定记录器使用**：利用 `logging.level.root`进行全局控制，同时使用 `logging.level.<name>`为关键模块或需要详细排查问题的包/类设置更低的级别（如 `DEBUG`），实现精细化的日志控制。
3. **配置优先级**：当存在多个日志配置文件（如 `logback.xml`, `application.properties`, `logback-spring.xml`）时，后加载的配置通常会覆盖先加载的配置。Spring Boot 推荐使用 `logback-spring.xml`进行更复杂和灵活的日志配置。
4. **留意性能**：过低的日志级别（如 `DEBUG`, `TRACE`）在生产环境会产生大量日志输出，可能消耗I/O资源并影响性能，请谨慎使用。

### 💎 总结

`logging.level.root`是 Spring Boot 日志配置的基石，它提供了**全局默认的日志级别**。通过合理设置它，并结合为特定包或类设置级别，您可以有效地平衡日志信息的详细程度和系统性能，从而更好地监控、调试和维护您的应用程序。

希望以上信息能帮助您更好地理解和使用 `logging.level.root`。
