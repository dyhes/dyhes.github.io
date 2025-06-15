---
title: 【Postopia Dev Log】Week 17
date: 2025-06-02 00:00:00+0000
categories: 
    - moon
    - snow
tags:
    - Postopia
math: true
---

## 问题：Spring Cloud Gateway 偶发报 400 BadRequest
特别是一个请求之后，未知原因
使用 Retries 解决

## @Transactional 自调用
Spring 的 `@Transactional` 注解在**自调用（self-invocation）** 场景下会失效，即一个类中的方法 A 直接调用同一个类中的方法 B（即使 B 被标注了 `@Transactional`），此时方法 B 的事务不会生效。以下是详细解释和解决方案：

---

### ⚠️ 一、问题原因：Spring AOP 的代理机制限制
1. **代理机制原理**  
   Spring 的事务管理基于 AOP 代理实现：
   - 当调用 `@Transactional` 方法时，实际是通过 Spring 生成的**代理对象**触发事务逻辑（如开启/提交事务）。
   - **自调用**（如 `this.methodB()`）会绕过代理对象，直接调用目标对象的原始方法，导致事务拦截器未被触发。

2. **错误示例**  
   ```java
   @Service
   public class OrderService {
       public void methodA() {
           this.methodB();  // 自调用，事务失效！
       }
   
       @Transactional
       public void methodB() { 
           // 数据库操作（无事务保护）
       }
   }
   ```

---

### 🔧 二、解决方案
#### ✅ 方法 1：将事务方法拆分到另一个 Service 类
通过依赖注入调用，确保通过代理对象触发事务：
```java
@Service
public class ServiceA {
    @Autowired
    private ServiceB serviceB; // 注入另一个Service

    public void methodA() {
        serviceB.methodB(); // 通过代理对象调用，事务生效
    }
}

@Service
public class ServiceB {
    @Transactional
    public void methodB() { 
        // 事务操作
    }
}
```
> **优点**：符合 Spring 设计规范，代码清晰。

#### ✅ 方法 2：通过代理对象调用自身（需开启 `exposeProxy`）
```java
@Service
public class OrderService {
    public void methodA() {
        // 获取当前代理对象，再调用方法
        ((OrderService) AopContext.currentProxy()).methodB();
    }

    @Transactional
    public void methodB() { ... }
}
```
**需在配置中启用代理暴露**（Spring Boot 可添加注解）：
```java
@EnableAspectJAutoProxy(exposeProxy = true)
public class AppConfig { ... }
```
> **注意**：需确保类能被 Spring AOP 代理（非 `private` 方法）。

#### ✅ 方法 3：注入自身代理（避免循环依赖）
```java
@Service
public class OrderService {
    @Autowired
    @Lazy // 延迟注入解决循环依赖
    private OrderService selfProxy;

    public void methodA() {
        selfProxy.methodB(); // 通过代理调用
    }

    @Transactional
    public void methodB() { ... }
}
```
> **适用场景**：不适合拆分类时使用。

---

### ⚡ 三、其他导致事务失效的场景
1. **非 `public` 方法**  
   `@Transactional` 只能用于 `public` 方法，否则不生效。
2. **异常被捕获未抛出**  
   事务回滚需抛出未处理的异常（默认仅回滚 `RuntimeException` 和 `Error`）。
3. **数据库引擎不支持事务**  
   如 MySQL 的 MyISAM 引擎不支持事务，需改用 InnoDB。

---

### 💎 总结
| **场景**               | **是否生效** | **解决方案**                     |
|------------------------|--------------|----------------------------------|
| 跨类调用 `@Transactional` 方法 | ✅ 生效       | 依赖注入调用其他 Service         |
| 同类自调用               | ❌ 失效       | 拆分方法、注入自身代理或使用 `AopContext` |
| 非 `public` 方法        | ❌ 失效       | 改为 `public` 方法               |

> 提示：优先选择 **拆分 Service 类** 的方案，避免代理绕行问题，符合 Spring 事务设计规范。