---
title: 【Spring Cloud Gateway】Notes
date: 2025-05-17 00:00:00+0000
categories: 
- willow
- nutrition
tags:
- Spring
- Postopia
---
## Flux vs. Mono
Flux 和 Mono 是 Reactor 框架中实现响应式编程的核心类型，用于处理异步数据流。它们基于 Reactive Streams 规范，支持非阻塞、背压（Backpressure）等特性，适用于高并发场景。以下是两者的对比与解析：

---

### **核心概念**
1. **Flux**  
   - **定义**：表示一个 **0到N个元素的异步序列**，支持无限数据流（如实时事件流）或有限数据集（如数据库查询结果集）。
   - **信号类型**：通过 `onNext` 发送多个元素，最终以 `onComplete` 或 `onError` 终止流。
   - **典型场景**：处理多个数据项（如消息队列、批量查询）或持续生成的事件流（如传感器数据）。

2. **Mono**  
   - **定义**：表示 **0或1个元素的异步序列**，用于单次结果操作（如 HTTP 请求、唯一 ID 查询）。
   - **信号类型**：最多触发一次 `onNext`，随后立即终止（`onComplete` 或 `onError`）。
   - **典型场景**：返回单个对象（如用户信息）、无返回值的异步操作（如保存操作）。

---

### **核心特性对比**
| 特性                | Flux                                      | Mono                                      |
|---------------------|-------------------------------------------|------------------------------------------|
| **元素数量**        | 0-N 个，支持无限流                   | 0或1个                           |
| **操作符**          | 支持多元素操作（如 `buffer`、`flatMap`） | 单元素操作（如 `map`、`flatMap`） |
| **性能优化**        | 适合批量数据处理，内存占用较高           | 单结果处理，轻量级                   |
| **错误处理**        | 错误终止整个流                           | 直接传递错误信号                     |

---

### **使用场景**
#### **Flux 的典型应用**
1. **批量数据查询**  
   ```java
   Flux<User> users = userRepository.findAll();  // 查询所有用户
   ```
2. **实时事件流处理**  
   ```java
   Flux<Event> events = Flux.interval(Duration.ofSeconds(1))
                            .map(tick -> generateEvent());  // 每秒生成事件
   ```
3. **数据转换与聚合**  
   使用 `flatMap` 和 `groupBy` 对多个数据流进行合并或拆分。

#### **Mono 的典型应用**
1. **单次数据库查询**  
   ```java
   Mono<User> user = userRepository.findById(id);  // 根据ID查询用户
   ```
2. **HTTP 请求响应**  
   ```java
   @GetMapping("/user/{id}")
   public Mono<User> getUser(@PathVariable String id) {
       return userService.findUserById(id);
   }
   ```
3. **异步操作结果封装**  
   ```java
   Mono<Void> saveOperation = userRepository.save(user).then();  // 保存后返回空
   ```

---

### **操作符与功能**
#### **共有操作符**
- **转换类**：`map`（元素转换）、`flatMap`（异步转换）。
- **过滤类**：`filter`（条件过滤）、`take`（限制元素数量）。
- **错误处理**：`onErrorResume`（错误降级）、`retry`（重试机制）。

#### **特有操作符**
| 类型  | 操作符               | 功能                                 |
|-------|----------------------|--------------------------------------|
| Flux  | `buffer(10)`         | 将元素按批次收集（如每10个一组） |
| Flux  | `zipWith(otherFlux)` | 合并两个流并按元素配对处理       |
| Mono  | `defaultIfEmpty()`   | 空值时返回默认值                 |
| Mono  | `then(Mono)`         | 当前流完成后触发另一个流         |

---

### **代码示例**
#### **Flux 示例**
```java
// 创建包含多个元素的流并转换
Flux<Integer> numbers = Flux.just(1, 2, 3)
    .map(n -> n * 2)                // 转换为 [2, 4, 6]
    .filter(n -> n > 3);            // 过滤出 [4, 6]
numbers.subscribe(System.out::println);
```

#### **Mono 示例**
```java
// 模拟异步查询用户并处理结果
Mono<User> userMono = userRepository.findById("123")
    .flatMap(user -> {
        user.setName(user.getName().toUpperCase());
        return Mono.just(user);
    })
    .onErrorResume(e -> Mono.just(new User("fallback")));  // 错误时返回默认用户
userMono.subscribe();
```

---

### **如何选择 Flux 或 Mono？**
1. **数据量**：需要处理多个元素时选 Flux，单个或无结果时选 Mono。
2. **性能**：Mono 更轻量，适合高频单次操作；Flux 适合批量或流式处理。
3. **语义明确性**：使用 Mono 可增强代码可读性（如明确表示“可能有或没有结果”）。

---

### **总结**
Flux 和 Mono 是响应式编程的基石，分别解决多元素和单元素异步流处理的问题。Flux 擅长复杂的数据流操作（如合并、批处理），而 Mono 在单结果场景中更高效直观。实际开发中需根据业务需求选择，例如在 Spring WebFlux 中，Controller 方法通常返回 Mono（单结果）或 Flux（列表或流）。
## ServerHttpRequestDecorator
ServerHttpRequestDecorator 是 Spring WebFlux 框架中用于增强或修改 HTTP 请求的核心工具类，基于装饰器模式实现对请求的拦截和动态处理。以下是其核心特性、使用场景及示例的详细解析：

---

### **1. 核心功能与作用**
- **请求信息拦截与修改**  
  继承自 `ServerHttpRequest`，通过重写 `getHeaders()`、`getBody()` 等方法，开发者可以修改请求头、请求体等关键信息。例如，动态添加请求头、解密请求内容或统一请求格式。

- **装饰器模式实现**  
  在不改变原始 `ServerHttpRequest` 对象的基础上扩展功能，支持链式调用和多层包装，适用于对请求进行非侵入式处理。

---

### **2. 关键方法与使用示例**
#### **常用方法**
- `getHeaders()`  
  重写此方法可动态修改请求头信息（如强制设置 `Content-Type`）。
  
- `getBody()`  
  拦截请求体数据流（`Flux<DataBuffer>`），允许对原始数据进行转换（如解密、日志记录）。

#### **代码示例**
**场景：强制设置请求头的 Content-Type**
```java
public class ContentRequestDecorator extends ServerHttpRequestDecorator {
    public ContentRequestDecorator(ServerHttpRequest delegate) {
        super(delegate);
    }

    @Override
    public HttpHeaders getHeaders() {
        HttpHeaders headers = HttpHeaders.writableHttpHeaders(super.getHeaders());
        headers.setContentType(MediaType.APPLICATION_JSON); // 强制设置为 JSON 类型
        return headers;
    }
}
```
**应用方式**  
在过滤器中包装原始请求：
```java
public class CustomFilter implements WebFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest decoratedRequest = new ContentRequestDecorator(exchange.getRequest());
        return chain.filter(exchange.mutate().request(decoratedRequest).build());
    }
}
```

**场景：解密请求体内容**  
```java
public class DecryptRequestDecorator extends ServerHttpRequestDecorator {
    @Override
    public Flux<DataBuffer> getBody() {
        return super.getBody()
            .map(buffer -> {
                String encrypted = DataBufferUtils.releaseBufferToString(buffer);
                String decrypted = AesUtils.decrypt(encrypted); // 自定义解密逻辑
                return bufferFactory().wrap(decrypted.getBytes());
            });
    }
}
```

---

### **3. 典型应用场景**
1. **请求头动态处理**  
   例如统一添加认证头（如 `Authorization`）或修复客户端缺失的 `Content-Type`。

2. **请求体内容转换**  
   解密敏感数据、压缩/解压缩请求体，或记录原始请求内容用于调试。

3. **协议兼容性适配**  
   将非标准协议（如自定义二进制格式）转换为标准 HTTP 请求，方便后续处理。

4. **数据格式统一**  
   对异构客户端发送的 XML、表单数据等统一转换为 JSON，简化业务逻辑。

---

### **4. 注意事项**
- **避免重复提交**  
  若直接操作请求体数据流，需确保数据仅被消费一次，否则会触发 `IllegalStateException`。可通过缓存（如 `Flux.cache()`）解决。

- **性能优化**  
  高频请求处理需注意内存管理，推荐使用非阻塞式流处理（如 `Flux.map` 代替同步循环）。

- **与 ServerWebExchange 集成**  
  通常结合 `ServerWebExchange.mutate()` 方法，将装饰后的请求注入过滤器链。

---

### **5. 相关类对比**
- **ServerHttpRequest**  
  原始请求接口，提供基础请求信息访问能力。

- **ServletServerHttpRequest**  
  针对 Servlet 容器的适配器，将 `HttpServletRequest` 转换为响应式请求对象，通常与 `ServerHttpRequestDecorator` 配合使用。

通过合理应用 `ServerHttpRequestDecorator`，开发者能够灵活控制请求处理流程，满足复杂的业务需求。
## ServerHttpResponseDecorator
在 Spring Cloud Gateway 中，`ServerHttpResponseDecorator` 是一个用于包装并增强 `ServerHttpResponse` 功能的工具类，主要用于拦截和修改网关的响应内容。以下是其核心特性和应用场景的详细介绍：

---

### **1. 核心功能与作用**
- **响应内容拦截与修改**  
  `ServerHttpResponseDecorator` 继承自 `ServerHttpResponse`，通过重写 `writeWith()` 方法，开发者可以在响应体写入前或写入后对数据进行修改。例如，可以动态添加响应头、加密响应内容或记录日志。
  
- **装饰器模式实现**  
  通过装饰器模式，`ServerHttpResponseDecorator` 在不改变原始 `ServerHttpResponse` 对象的基础上扩展功能，支持链式调用和多重包装。

---

### **2. 核心方法与使用示例**
#### **关键方法**
- `writeWith(Publisher<DataBuffer> body)`  
  重写此方法以拦截原始响应体的数据流，允许对 `DataBuffer` 进行自定义处理（如字符串转换、JSON 序列化等）。
  
- `getDelegate()`  
  获取被装饰的原始 `ServerHttpResponse` 实例，便于直接操作底层属性（如状态码、Cookie 等）。

#### **代码示例**
```java
public class CustomResponseDecorator extends ServerHttpResponseDecorator {
    public CustomResponseDecorator(ServerHttpResponse delegate) {
        super(delegate);
    }

    @Override
    public Mono<Void> writeWith(Publisher<? extends DataBuffer> body) {
        // 修改响应体内容（例如添加前缀）
        Flux<DataBuffer> modifiedBody = Flux.from(body)
            .map(buffer -> {
                String content = DataBufferUtils.releaseBufferToString(buffer);
                return bufferFactory().wrap(("Modified: " + content).getBytes());
            });
        return super.writeWith(modifiedBody);
    }
}
```
在过滤器中应用该装饰器：
```java
public class CustomFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpResponse decoratedResponse = new CustomResponseDecorator(exchange.getResponse());
        return chain.filter(exchange.mutate().response(decoratedResponse).build());
    }
}
```

---

### **3. 典型应用场景**
1. **动态修改响应头**  
   例如添加安全相关的 `Content-Security-Policy` 或自定义业务标识头。
   
2. **统一响应格式**  
   对后端服务的原始响应进行封装，统一错误码或标准化数据结构。

3. **日志记录与监控**  
   记录响应耗时、响应体大小等指标，集成监控系统。

4. **敏感数据脱敏**  
   在响应返回客户端前，对敏感字段（如手机号、身份证号）进行脱敏处理。

---

### **4. 注意事项**
- **响应提交状态**  
  需通过 `isCommitted()` 方法判断响应是否已提交，避免重复操作导致异常。
  
- **性能影响**  
  响应体的拦截和修改涉及数据流操作，需注意内存消耗和延迟，建议使用非阻塞式处理。

---

### **5. 相关类与上下文**
- **`ServerWebExchange`**  
  网关请求的上下文对象，持有 `ServerHttpRequest` 和 `ServerHttpResponse`，是操作请求和响应的入口。
  
- **`ReactorServerHttpResponse`**  
  `ServerHttpResponse` 的默认实现类，基于 Netty 的响应处理，其 `HttpHeaders` 可直接修改。

通过合理使用 `ServerHttpResponseDecorator`，开发者可以灵活控制网关的响应行为，满足复杂业务需求。