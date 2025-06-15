---
title: 【Postopia Dev Log】Week 13
date: 2025-05-05 00:00:00+0000
categories: 
    - moon
    - snow
tags:
    - Postopia
math: true
---
todo for now
* ~~智能总结~~
* 微服务改造

参考
* [Spring Boot + Vue3 Post SSE + WebFlux 实现流式 AI 对话](http://mp.weixin.qq.com/s?__biz=MzA4MDc3MzE1NQ==&mid=2653999326&idx=3&sn=1bdd6fa1a24f8b21edc120309eee1bd5&chksm=85e9ad7e7cf0c40642f302b82e270295d3752e45cd74c8839503bf94b05f6a4a256978021edc#rd)

## SSE流
在Spring Boot服务端中，通过CURL发送请求并处理SSE（Server-Sent Events）流式返回给客户端，需要结合**服务端SSE实现**与**客户端请求转发机制**。以下是具体实现步骤和代码示例：

---

### 服务端实现SSE推送
####  使用`SseEmitter`创建SSE接口
通过`SseEmitter`实现服务端推送能力，每个客户端请求会创建一个长连接，支持流式返回数据。

```java
@RestController
public class SseController {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamData() {
        SseEmitter emitter = new SseEmitter(-1L); // 设置无限超时
        String clientId = UUID.randomUUID().toString();
        emitters.put(clientId, emitter);

        // 监听连接关闭或超时事件
        emitter.onCompletion(() -> emitters.remove(clientId));
        emitter.onTimeout(() -> emitters.remove(clientId));
        return emitter;
    }
}
```

####  转发外部SSE流到客户端
服务端作为客户端，通过`OkHttp`请求外部SSE服务，并将接收到的数据转发给前端：
```java
public void forwardExternalSSE(String externalUrl, String clientId) {
    OkHttpClient client = new OkHttpClient();
    Request request = new Request.Builder().url(externalUrl).build();
    EventSource eventSource = EventSources.createFactory(client)
        .newEventSource(request, new EventSourceListener() {
            @Override
            public void onEvent(EventSource eventSource, String id, String type, String data) {
                SseEmitter emitter = emitters.get(clientId);
                if (emitter != null) {
                    try {
                        emitter.send(SseEmitter.event().data(data)); // 转发数据
                    } catch (IOException e) {
                        emitter.completeWithError(e);
                    }
                }
            }

            @Override
            public void onFailure(EventSource eventSource, Throwable t, Response response) {
                emitters.get(clientId).completeWithError(t);
            }
        });
}
```

---

### 客户端通过CURL测试
####  发送CURL请求
客户端通过以下命令订阅服务端的SSE流：
```bash
curl -v http://localhost:8080/stream
```
服务端会返回`text/event-stream`格式的响应头，并持续推送数据。

####  处理流式响应
客户端会以事件流形式接收数据，格式示例：
```
data: {"message": "Event 1"}

data: {"message": "Event 2"}
```

---

### 关键配置与注意事项
1. **依赖配置**  
   需添加`spring-boot-starter-web`和`OkHttp`相关依赖：
   ```xml
   <dependency>
       <groupId>com.squareup.okhttp3</groupId>
       <artifactId>okhttp-sse</artifactId>
       <version>4.10.0</version>
   </dependency>
   ```

2. **超时管理**  
   - 若外部SSE服务中断，需通过`SseEmitter.onError()`通知客户端。
   - 使用`SseEmitter(-1L)`禁用默认超时，避免因长时间无数据触发`AsyncRequestTimeoutException`。

3. **多客户端支持**  
   通过`ConcurrentHashMap`管理多个`SseEmitter`实例，确保线程安全。

4. **错误处理**  
   - 外部SSE连接失败时，调用`emitter.completeWithError()`终止客户端连接。
   - 客户端主动断开时，触发`onCompletion()`清理资源。

---

### 完整流程示例
1. **客户端发起请求**  
   ```bash
   curl http://localhost:8080/stream
   ```

2. **服务端行为**  
   - 创建`SseEmitter`并注册到管理器。
   - 启动`OkHttp`订阅外部SSE服务（如大模型API）。
   - 将外部事件实时转发至客户端。

3. **数据流传递**  
   ```
   外部服务 -> Spring Boot服务端 -> 客户端
   ```

---

### 优化建议
- **异步非阻塞**：使用`WebFlux`的`Flux<ServerSentEvent>`替代`SseEmitter`，实现响应式流处理。
- **消息压缩**：对高频数据启用GZIP压缩，减少网络负载。
- **心跳机制**：定期发送空事件保持连接活跃，避免被代理服务器中断。

通过上述方案，可实现在Spring Boot中通过CURL请求触发服务端SSE推送，并完成流式数据的中转。具体实现需结合业务场景调整超时和错误处理逻辑。

## WebFlux与SseEmitter

在Spring生态中，**WebFlux**和**SseEmitter**均能实现服务器推送事件（SSE），但两者在技术实现、性能表现及适用场景上存在显著差异。以下是具体对比：

---

####  **底层技术与编程模型**
- **WebFlux**  
  基于Reactor响应式编程模型，采用**非阻塞I/O**（如Netty或Reactor-Netty），通过`Flux<ServerSentEvent>`处理数据流。开发者通过声明式代码组合流操作（如`map`、`filter`），无需手动管理线程，天然支持背压（Backpressure）机制，避免数据过载。  
  ```java
  @GetMapping("/sse-flux")
  public Flux<ServerSentEvent<String>> handleSseFlux() {
      return Flux.interval(Duration.ofMillis(100))
          .map(sequence -> ServerSentEvent.builder("SSE in WebFlux - " + sequence).build());
  }
  ```

- **SseEmitter**  
  属于Spring MVC框架，依赖**Servlet的异步处理机制**（阻塞I/O模型），需手动创建线程池或异步任务推送数据。编程模型为同步模式，开发者需自行处理线程调度与资源释放。  
  ```java
  @GetMapping("/sse-mvc")
  public SseEmitter handleSse() {
      SseEmitter emitter = new SseEmitter(30_000L);
      new Thread(() -> {
          try {
              for (int i = 0; i < 100; i++) {
                  emitter.send("Event " + i);
                  Thread.sleep(100);
              }
              emitter.complete();
          } catch (Exception e) { /* 异常处理 */ }
      }).start();
      return emitter;
  }
  ```

---

####  **并发能力与资源消耗**
- **WebFlux**  
  - **高并发**：基于EventLoop线程模型，单线程可处理数万连接，适合IoT、实时聊天等高并发场景。  
  - **低资源消耗**：占用少量线程（如CPU核心数），减少上下文切换开销。

- **SseEmitter**  
  - **低并发**：每个连接占用一个线程，线程池容量限制导致并发上限低（通常数百至数千）。  
  - **高资源消耗**：线程数随连接数线性增长，易引发资源耗尽问题。

---

####  **协议支持与扩展性**
- **WebFlux**  
  支持多种协议：**SSE**、**WebSocket**、HTTP/2等，可灵活适配不同实时通信需求。此外，无缝集成响应式生态组件（如R2DBC、WebClient）。

- **SseEmitter**  
  仅支持SSE协议，功能单一，扩展性受限。

---

####  **错误处理与背压机制**
- **WebFlux**  
  - **背压支持**：通过`Flux`自动调节数据流速，防止客户端过载。  
  - **健壮的错误处理**：提供`onErrorResume`等操作符，可链式定义异常恢复逻辑。

- **SseEmitter**  
  - **无背压控制**：需开发者自行实现流量限制逻辑。  
  - **手动错误处理**：依赖`try-catch`捕获异常并通过`emitter.completeWithError()`通知客户端。

---

####  **适用场景**
- **WebFlux**  
  - 高并发实时应用（如股票行情、AI对话）。  
  - 微服务架构下的流式数据处理（如日志推送、实时监控）。

- **SseEmitter**  
  - 传统Spring MVC项目中的简单推送需求（如低频率通知、小型应用）。

---

### 总结对比表
| 特性                | WebFlux (`Flux`)                     | SseEmitter                      |
|---------------------|--------------------------------------|---------------------------------|
| **底层技术**         | 非阻塞I/O（Reactor-Netty）          | 阻塞I/O（Servlet异步）          |
| **编程模型**         | 声明式响应式编程                     | 同步编程，需手动管理线程         |
| **并发能力**         | 支持10K+连接                        | 受限于线程池容量（通常<1K）     |
| **资源消耗**         | 低（少量EventLoop线程）             | 高（每个连接占用一个线程）       |
| **协议支持**         | SSE、WebSocket、HTTP/2等            | 仅SSE                           |
| **背压控制**         | 原生支持                             | 需自行实现                      |
| **适用场景**         | 高并发实时系统、响应式微服务         | 传统MVC应用、低频推送需求        |

---

### 选择建议
- **优先WebFlux**：若项目需要高并发、低延迟，或已采用响应式架构（如Spring Cloud Gateway）。  
- **使用SseEmitter**：仅需简单SSE功能且无法迁移至WebFlux的传统Spring MVC项目。

通过以上对比，开发者可根据具体需求选择合适技术方案，优化系统性能与开发效率。


## Server-Sent Events（SSE）结合 Spring Security
在Spring Boot应用中，当使用Server-Sent Events（SSE）并结合Spring Security时，遇到`Unable to handle the Spring Security Exception because the response is already committed`错误，通常是由**响应提前提交导致安全异常处理冲突**引起的。以下是具体原因及解决方案：

---

### 错误原因分析
####  **响应提前提交**
- 你的代码中使用了`Flux.create`和`CompletableFuture.runAsync`开启异步线程处理SSE流。**若异步线程中已经通过`sink`开始发送数据（即响应体已开始写入），而Spring Security在过滤器链中检测到未认证/未授权的请求并尝试抛出异常**（如`AccessDeniedException`），此时响应头可能已部分提交，导致无法修改状态码或重定向。
- **安全拦截器与异步线程的竞争条件**：主线程的Spring Security过滤器（如`FilterSecurityInterceptor`）可能在异步线程发送数据后才抛出异常，此时响应已不可修改。

####  **Spring Security默认行为冲突**
- 默认情况下，Spring Security对未认证请求会重定向到登录页（状态码302），而SSE需要保持长连接（状态码200）。**响应头的冲突会导致异常无法正确处理**。

---

### 解决方案
####  **配置Spring Security以兼容SSE**
禁用默认的重定向逻辑，改用**直接返回HTTP状态码**：
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/summary").permitAll() // 根据需求调整权限
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                // 禁用重定向，直接返回401/403状态码
                .authenticationEntryPoint((request, response, authException) -> 
                    response.sendError(HttpStatus.UNAUTHORIZED.value(), "Unauthorized")
                )
                .accessDeniedHandler((request, response, accessDeniedException) -> 
                    response.sendError(HttpStatus.FORBIDDEN.value(), "Forbidden")
                )
            )
            .csrf(csrf -> csrf.disable()); // 根据需求决定是否禁用CSRF
        return http.build();
    }
}
```

####  **调整异步处理逻辑**
确保**安全验证完成后再启动异步任务**，避免响应提前提交：
```java
@GetMapping(value = "summary", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<ServerSentEvent<String>> summary(@RequestParam Long postId) {
    return Flux.create(sink -> {
        // 在主线程完成安全验证后再启动异步任务
        if (SecurityContextHolder.getContext().getAuthentication() == null ||
            !SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            sink.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "未认证"));
            return;
        }
        CompletableFuture.runAsync(() -> intelligenceService.summary(sink, postId));
    });
}
```

####  **使用响应式编程模型（推荐）**
避免混合阻塞式线程（如`CompletableFuture`）与响应式流（`Flux`），改用`Schedulers`控制线程：
```java
@GetMapping(value = "summary", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<ServerSentEvent<String>> summary(@RequestParam Long postId) {
    return Flux.using(
        () -> intelligenceService.initSummary(postId), // 初始化资源
        resource -> Flux.fromIterable(resource.getEvents())
            .publishOn(Schedulers.boundedElastic()) // 异步处理
            .map(event -> ServerSentEvent.builder(event).build()),
        resource -> resource.close()
    ).doOnError(ex -> log.error("SSE流异常", ex));
}
```

####  **处理SSE流的异常**
通过`doOnError`捕获并处理异步操作中的异常，避免响应提前关闭：
```java
public void summary(Sink<String> sink, Long postId) {
    try {
        // 模拟业务逻辑
        for (int i = 0; i < 10; i++) {
            if (sink.isCancelled()) break; // 检查sink是否已关闭
            sink.next("Event " + i);
            Thread.sleep(1000);
        }
        sink.complete();
    } catch (Exception e) {
        sink.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "处理失败"));
    }
}
```

---

### 验证与调试
1. **测试未认证场景**：直接访问`/summary`接口应返回401状态码，而非触发SSE流。
2. **检查线程模型**：确保异步操作在安全验证通过后执行（可通过日志或断点验证）。
3. **监控响应头**：使用工具（如Postman）确认SSE响应头为`Content-Type: text/event-stream`且状态码为200。

---

### 扩展建议
- **统一异常处理**：结合`@ControllerAdvice`全局捕获SSE相关异常。
- **响应式安全配置**：若使用WebFlux，需配置`ReactiveSecurityWebFilterChain`。
- **性能优化**：使用背压（Backpressure）控制事件流速，避免资源耗尽。

通过上述方案，可解决SSE与Spring Security的响应提交冲突问题，同时保持流式数据的高效传输。

## Spring boot 请求
在Spring Boot应用中建立网络请求，可以通过多种方式实现。以下是常用的几种方法及其实现步骤，结合官方推荐和第三方库进行说明：

---

### **使用RestTemplate（同步请求）**
**适用场景**：传统同步HTTP请求，适合简单接口调用。  
**步骤**：  
1. **添加依赖**：确保`spring-boot-starter-web`已引入（默认包含）。  
2. **配置Bean**：在配置类中定义`RestTemplate`的Bean：  
   ```java
   @Configuration
   public class RestTemplateConfig {
       @Bean
       public RestTemplate restTemplate() {
           return new RestTemplate();
       }
   }
   ```  
3. **发送请求**：  
   - **GET请求**：  
     ```java
     @Autowired
     private RestTemplate restTemplate;
     
     public String getData() {
         String url = "https://api.example.com/data";
         return restTemplate.getForObject(url, String.class);
     }
     ```  
   - **POST请求**：  
     ```java
     public String postData() {
         String url = "https://api.example.com/post";
         Map<String, Object> requestBody = new HashMap<>();
         requestBody.put("key", "value");
         return restTemplate.postForObject(url, requestBody, String.class);
     }
     ```  
**注意**：RestTemplate在Spring 5后虽仍可用，但官方推荐WebClient作为替代。

---

### **使用WebClient（异步/响应式请求）**
**适用场景**：非阻塞、响应式编程，支持同步/异步调用。  
**步骤**：  
1. **添加依赖**：引入`spring-boot-starter-webflux`：  
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-webflux</artifactId>
   </dependency>
   ```  
2. **配置Bean**：通过Builder自定义超时、连接池等：  
   ```java
   @Bean
   public WebClient webClient() {
       return WebClient.builder()
           .baseUrl("https://api.example.com")
           .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
           .build();
   }
   ```  
3. **发送请求**：  
   - **同步调用**：  
     ```java
     public String syncGet() {
         return webClient.get()
             .uri("/data")
             .retrieve()
             .bodyToMono(String.class)
             .block();
     }
     ```  
   - **异步调用**：  
     ```java
     public Mono<String> asyncGet() {
         return webClient.get()
             .uri("/data")
             .retrieve()
             .bodyToMono(String.class);
     }
     ```  

---

### **使用Feign（声明式HTTP客户端）**
**适用场景**：简化RESTful服务调用，适合微服务架构。  
**步骤**：  
1. **添加依赖**：引入OpenFeign：  
   ```xml
   <dependency>
       <groupId>org.springframework.cloud</groupId>
       <artifactId>spring-cloud-starter-openfeign</artifactId>
   </dependency>
   ```  
2. **启用Feign**：在启动类添加`@EnableFeignClients`。  
3. **定义接口**：声明式调用外部API：  
   ```java
   @FeignClient(name = "externalApi", url = "https://api.example.com")
   public interface ExternalApiClient {
       @GetMapping("/data")
       String getData();
   }
   ```  
4. **注入使用**：  
   ```java
   @Autowired
   private ExternalApiClient client;
   
   public String fetchData() {
       return client.getData();
   }
   ```  

---

### **第三方HTTP客户端（灵活扩展）**
#### **Apache HttpClient**
**适用场景**：高度可配置，支持复杂请求（如连接池、重试机制）。  
**示例**：  
```java
CloseableHttpClient httpClient = HttpClients.createDefault();
HttpGet request = new HttpGet("https://api.example.com");
CloseableHttpResponse response = httpClient.execute(request);
String result = EntityUtils.toString(response.getEntity());
```

#### **OkHttp**
**适用场景**：高性能，支持HTTP/2和WebSocket。  
**示例**：  
```java
OkHttpClient client = new OkHttpClient();
Request request = new Request.Builder()
    .url("https://api.example.com")
    .build();
client.newCall(request).enqueue(new Callback() {
    @Override
    public void onResponse(Call call, Response response) {
        System.out.println(response.body().string());
    }
});
```

---

### **选择建议**
- **同步场景**：优先使用WebClient或RestTemplate。  
- **响应式/高并发**：WebClient（支持非阻塞）。  
- **微服务调用**：Feign（声明式简化）。  
- **复杂配置需求**：Apache HttpClient或OkHttp。

更多配置细节（如超时设置、拦截器）可参考官方文档或相关搜索来源。

假设你是一个论坛帖子内容总结助手，用户将会以形如{“postTitle”:“帖子名”,content:“帖子引言”,comments:[“评论内容1”,“评论内容2”]}的序列化JSON形式发送帖子，请你帮助总结整个帖子（包括内容和评论），并总结内容与评论的情感态度，并给出各态度的百分比，请以形如{“altitudes”:[{altitude: “开心”, percentage: “50%”}, {altitude: “愤怒”, percentage: “20%”},…], “summary”: “这篇帖子讨论了…”}的序列化JSON格式返回字段

## Application.yaml更新问题
在Spring Boot应用部署后，修改`application.yaml`是否需要重新编译或重启，取决于具体的配置管理方式。以下是不同场景下的解决方案和对应操作：

---

### **仅修改外部配置文件并重启**
如果将配置文件放在**外部目录**（如与Jar包同级目录的`config`文件夹或自定义路径），并在启动时通过`--spring.config.location`参数指定其位置，则修改后只需**重启应用**即可生效，无需重新编译打包。  
**操作步骤**：
1. 将`application.yaml`移动到Jar包外部（如`/opt/app/config/`）。
2. 启动命令中添加参数：  
   ```bash
   java -jar your-app.jar --spring.config.location=file:/opt/app/config/
   ```
3. 修改配置文件后，重启应用即可。

---

### **动态刷新配置（无需重启）**
通过集成**Spring Cloud Config**或**Spring Boot Actuator**，可实现配置的**动态刷新**，无需重启应用。  
**实现方式**：
- **Spring Cloud Config**：  
  将配置集中存储在Git等版本库中，通过`@RefreshScope`注解刷新Bean，调用`/actuator/refresh`接口触发更新。
- **手动刷新**：  
  使用`ContextRefresher`类主动刷新配置（需引入`spring-cloud-context`依赖）：  
  ```java
  @Autowired
  private ContextRefresher contextRefresher;
  
  public void updateConfig() {
    // 修改外部配置文件内容
    contextRefresher.refresh(); // 触发配置刷新
  }
  ```

---

### **开发环境热部署（自动重启）**
在开发阶段，使用`spring-boot-devtools`工具可实现**修改后自动重启**（非生产环境适用）：  
1. 添加依赖：
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-devtools</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```
2. 修改配置文件后，IDEA会自动触发应用重启。

---

### **总结**
- **是否需要重新编译**：  
  **不需要**。无论采用外部配置还是动态刷新，均无需重新编译代码。
- **是否需要重启**：  
  - 若使用外部配置文件但未集成动态刷新，需**手动重启应用**。
  - 若通过动态刷新或热部署工具，则**无需重启**。

建议根据实际场景选择方案：生产环境推荐**外部配置+动态刷新**，开发环境可使用热部署工具简化流程。
