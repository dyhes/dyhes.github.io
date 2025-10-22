---
title: 【Postopia】caffeine
date: 2025-07-02 00:00:00+0000
categories: [nutrition, willow, moon]
tags:
- Postopia
---
## Caffeine

Caffeine 是一款基于 Java 8 的高性能本地缓存库，由 Google Guava Cache 改进而来，现已成为 Spring Boot 默认的本地缓存实现。其设计专注于高并发、低延迟场景，通过创新的算法和灵活的配置优化缓存命中率与内存管理。以下从核心特性、工作原理、使用场景等方面展开详细介绍：


------
### 🔥 **核心特性**

1. **高性能与高命中率**
   - **Window TinyLFU 算法**：Caffeine 采用混合了 LRU（最近最少使用）和 LFU（最不常使用）优势的算法，通过频率统计智能保留热点数据，命中率接近理论最优值，尤其在高并发场景下显著优于传统 LRU 算法[3,4,5](@ref)。
   - **无锁并发设计**：基于 Java 8 的 `StampedLock` 和分段锁技术，减少线程竞争，支持高吞吐量访问（O(1) 时间复杂度）[3,5](@ref)。
2. **灵活的缓存策略**
   - **基于容量**：通过 `maximumSize` 限制条目数量，或通过 `maximumWeight` 结合权重函数（如数据大小）控制内存占用[3,6](@ref)。
   - 基于时间：
     - `expireAfterWrite`：写入后固定时间过期（如 10 分钟）；
   - `expireAfterAccess`：最后一次访问/写入后固定时间过期；
     - `refreshAfterWrite`：写入后定时刷新（异步加载新值，不阻塞请求）[3,5,6](@ref)。
   - **基于引用**：支持弱引用（`weakKeys`/`weakValues`）或软引用（`softValues`），允许 JVM 在内存不足时回收缓存[5,6](@ref)。
3. **异步与自动加载**
   - **异步加载（AsyncCache）**：返回 `CompletableFuture`，适用于非阻塞编程模型，默认使用 `ForkJoinPool` 执行加载任务[3,7](@ref)。
   - **同步加载（LoadingCache）**：通过 `CacheLoader` 实现缓存未命中时自动加载数据，避免手动处理逻辑[5,7](@ref)。
4. **扩展功能**
   - **淘汰监听**：`removalListener` 可捕获条目移除事件（如过期、手动删除），便于日志或资源清理[3,5](@ref)。
   - **统计监控**：`recordStats()` 启用命中率、加载耗时等统计，辅助性能优化[3,7](@ref)。


------
### ⚙️ **工作原理与关键技术**

1. **缓存淘汰机制**
   - 采用惰性删除与定期批量清理结合的策略：
     - 读/写操作时检查过期时间，异步回收过期条目；
     - 后台线程定期执行清理任务，减少主线程阻塞[3,6](@ref)。
2. **内存管理优化**
   - **权重控制**：通过 `Weigher` 接口为不同条目分配权重，避免大对象占用过多内存[6](@ref)。
   - **智能驱逐**：结合容量、时间、引用策略，确保内存占用可控（例如 `maximumWeight` 与 `weigher` 配合）[5,6](@ref)。
3. **刷新与过期区别**
   | **策略**            | **触发条件** | **行为**                       | **适用场景**               |
   | ------------------- | ------------ | ------------------------------ | -------------------------- |
   | `expireAfterWrite`  | 写入后超时   | 阻塞请求直至新值加载完成       | 强一致性场景（如配置数据） |
   | `refreshAfterWrite` | 写入后超时   | 返回旧值并异步刷新，不阻塞请求 | 高并发读场景（如热点数据） |


------
### 🚀 **适用场景**

1. **高频访问数据缓存**
   - Web 请求结果、用户会话信息、商品详情等，减少数据库压力，提升响应速度（如电商首页热点商品）[4,7](@ref)。
2. **计算密集型任务优化**
   - 缓存图像处理结果、大数据分析中间值，避免重复计算（如实时报表生成）[4,6](@ref)。
3. **微服务架构中的本地缓存层**
   - 作为三级缓存（L1）与 Redis（L2）、数据库（L3）协同：
     - L1（Caffeine）：进程内缓存，纳秒级访问；
     - L2（Redis）：跨进程共享，减少数据库查询；
     - 数据一致性通过 TTL 或消息通知保障[4,6](@ref)。
4. **高并发系统**
   - 如秒杀系统库存缓存，通过 `refreshAfterWrite` 异步更新，避免缓存击穿[3,4](@ref)。


------
### ⚖️ **与其他缓存库对比**

| **特性**     | **Caffeine**      | **Guava Cache** | **Redis**       |
| ------------ | ----------------- | --------------- | --------------- |
| **算法**     | Window TinyLFU    | LRU             | 多种（如 LRU）  |
| **并发性能** | ⭐⭐⭐⭐（无锁优化）  | ⭐⭐（锁竞争）    | ⭐⭐⭐（网络延迟） |
| **内存管理** | 灵活（权重/大小） | 基础            | 依赖外部配置    |
| **适用场景** | 本地缓存          | 小规模本地缓存  | 分布式缓存      |


------
### 💻 **基础代码示例**

```java
// 同步加载缓存（自动加载数据）
LoadingCache<String, User> cache = Caffeine.newBuilder()
    .maximumSize(1000)
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .refreshAfterWrite(1, TimeUnit.MINUTES)
    .recordStats()
    .build(key -> userDao.getUserById(key));

// 获取数据（自动加载未命中条目）
User user = cache.get("user123");

// 异步加载缓存
AsyncLoadingCache<String, User> asyncCache = Caffeine.newBuilder()
    .buildAsync((key, executor) -> userDao.getUserAsync(key));
CompletableFuture<User> future = asyncCache.get("user456");
```


------
### ⚠️ **常见问题与优化**

1. **缓存命中率低**
   - **优化**：增大 `maximumSize`、调整过期时间（如延长 `expireAfterAccess`）、检查数据加载逻辑[2,6](@ref)。
2. **内存占用过高**
   - **优化**：使用 `maximumWeight` 限制权重、启用 `weakValues` 或 `softValues`[2,6](@ref)。
3. **缓存雪崩**
   - **预防**：分散过期时间（如随机 TTL）、结合 `refreshAfterWrite` 异步刷新[3,4](@ref)。


------
### 💎 **总结**

Caffeine 凭借 **Window TinyLFU 算法**、**无锁并发**和**灵活的策略组合**，成为 Java 本地缓存的标杆。其适用于高并发、低延迟场景，如微服务缓存层、热点数据加速等。通过与分布式缓存（如 Redis）组成多级缓存，可进一步优化系统性能。开发者可通过丰富的配置（容量、时间、权重）和监控功能（`recordStats`）实现精细化调优[3,4,5](@ref)。
## 多级缓存

Spring Boot 结合 Caffeine（本地缓存）和 Redis（分布式缓存）实现多级缓存，能显著提升高并发场景下的系统性能。以下基于实战经验，详细说明实现步骤和完整代码示例：


------
### 📐 **多级缓存架构设计**

1. 请求流程
   ```
   请求 → Caffeine（L1，进程内）→ 命中则返回  
          ↓ 未命中  
          Redis（L2，分布式）→ 命中则回填L1并返回  
          ↓ 未命中  
          数据库 → 回填Redis和Caffeine
   ```
2. 核心优势
   - **高性能**：Caffeine 提供纳秒级访问，承载 80% 以上热点请求[4](@ref)
   - **容量分层**：Redis 存储全量数据，Caffeine 仅存高频热点[1](@ref)
   - **一致性保障**：通过异步通知 + TTL 控制数据同步[5](@ref)


------
### ⚙️ **依赖配置（pom.xml）**

```
<dependencies>
    <!-- Spring 缓存支持 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
    <!-- Caffeine 本地缓存 -->
    <dependency>
        <groupId>com.github.ben-manes.caffeine</groupId>
        <artifactId>caffeine</artifactId>
    </dependency>
    <!-- Redis 分布式缓存 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
</dependencies>
```


------
### 🔧 **多级缓存配置类**

```java
@Configuration
@EnableCaching
public class CacheConfig {

    // 一级缓存：Caffeine（短周期，防穿透）
    @Bean
    public CacheManager caffeineCacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(Caffeine.newBuilder()
            .initialCapacity(100)      // 初始容量
            .maximumSize(1000)        // 最大条目
            .expireAfterWrite(5, TimeUnit.SECONDS) // 短TTL避免旧数据
            .recordStats());           // 启用统计
        return manager;
    }

    // 二级缓存：Redis（长周期，全量存储）
    @Bean
    public RedisCacheManager redisCacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30)) // 长TTL
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        return RedisCacheManager.builder(factory).cacheDefaults(config).build();
    }

    // 组合多级缓存管理器（核心）
    @Bean
    @Primary
    public CacheManager multiLevelCacheManager(
            @Qualifier("caffeineCacheManager") CacheManager level1,
            @Qualifier("redisCacheManager") CacheManager level2) {
        return new MultiLevelCacheManager(level1, level2);
    }
}
```


------
### 🧩 **多级缓存管理器实现**

```java
public class MultiLevelCacheManager implements CacheManager {
    private final CacheManager level1; // Caffeine
    private final CacheManager level2; // Redis
    private final ConcurrentMap<String, Cache> caches = new ConcurrentHashMap<>();

    public MultiLevelCacheManager(CacheManager level1, CacheManager level2) {
        this.level1 = level1;
        this.level2 = level2;
    }

    @Override
    public Cache getCache(String name) {
        return caches.computeIfAbsent(name, cacheName -> 
            new MultiLevelCache(level1.getCache(cacheName), level2.getCache(cacheName))
        );
    }

    static class MultiLevelCache implements Cache {
        private final Cache level1;
        private final Cache level2;

        public MultiLevelCache(Cache level1, Cache level2) {
            this.level1 = level1 != null ? level1 : new NoOpCache();
            this.level2 = level2 != null ? level2 : new NoOpCache();
        }

        @Override
        public ValueWrapper get(Object key) {
            // 1. 先查本地缓存
            ValueWrapper value = level1.get(key);
            if (value != null) return value;

            // 2. 再查Redis
            value = level2.get(key);
            if (value != null) {
                level1.put(key, value.get()); // 回填本地缓存
                return value;
            }
            return null; // 两级均未命中
        }

        @Override
        public void put(Object key, Object value) {
            // 双写策略：同时更新两级缓存
            level1.put(key, value);
            level2.put(key, value);
        }

        @Override
        public void evict(Object key) {
            // 双删策略：保证一致性
            level1.evict(key);
            level2.evict(key);
        }
    }

    // 空缓存实现（容错）
    static class NoOpCache implements Cache { /* 基础方法实现 */ }
}
```


------
### 🛠️ **业务层使用示例**

```java
@Service
public class ProductService {
    @Autowired
    private ProductRepository repository;

    // 读取数据：自动走多级缓存
    @Cacheable(value = "products", key = "#id")
    public Product getProduct(Long id) {
        return repository.findById(id).orElse(null); // 模拟DB查询
    }

    // 更新数据：清除缓存
    @CacheEvict(value = "products", key = "#product.id")
    public void updateProduct(Product product) {
        repository.save(product);
    }
}
```


------
### 🛡️ **关键优化策略**

1. **数据一致性保障**
   - **双删策略**：更新数据后同时清除两级缓存（如上例 `@CacheEvict`）
   - **Pub/Sub 同步**：通过 Redis 发布订阅，通知其他节点失效本地缓存[1](@ref)
   ```Java
   // Redis 消息监听示例
   @Bean
   public MessageListenerAdapter listenerAdapter() {
       return new MessageListenerAdapter(new CacheEvictListener());
   }
   public class CacheEvictListener {
       public void handleMessage(String cacheKey) {
           caffeineCacheManager.getCache("products").evict(cacheKey);
       }
   }
   ```
2. **防缓存穿透**
   - 缓存空值（短TTL）：
   ```java
   if (product == null) {
       level2.put(key, NULL_OBJECT, 30, TimeUnit.SECONDS); // 缓存空对象
   }
   ```
3. **防雪崩机制**
   - Redis TTL 添加随机扰动：
   ```java
   redisTemplate.opsForValue().set(key, value, 30 + random.nextInt(10), TimeUnit.MINUTES);
   ```
4. **性能监控**
   ```java
   // 获取Caffeine统计信息
   CacheStats stats = caffeineCache.getNativeCache().stats();
   log.info("L1命中率: {}", stats.hitRate());
   ```


------
### 💎 **适用场景与性能对比**

| **场景**             | **推荐方案** | **性能提升**                   |
| -------------------- | ------------ | ------------------------------ |
| 高频读（如商品详情） | 多级缓存     | QPS 从 5.8万 → 120万 [4](@ref) |
| 低频写高一致性       | 纯Redis      | 数据一致但延迟较高             |
| 静态数据（如配置）   | 纯Caffeine   | 零网络延迟                     |
> **注**：完整代码需根据业务调整以下配置：
>
> - Caffeine 的 `refreshAfterWrite`（搭配 `CacheLoader` 异步刷新）[8](@ref)
> - Redis 分布式锁控制回源（防缓存击穿）
> - 动态预热热点数据（`@PostConstruct` 加载高频数据）[5](@ref)
通过以上设计，系统可显著降低数据库负载（实测下降 90%），TP99 延迟从 120ms 降至 45ms [4](@ref)。实际部署时建议配合 **Prometheus 监控缓存命中率**和 **Hystrix 降级策略**，保障高可用性。
## 差异化多级缓存

在 Spring Boot 应用中，可通过**分治策略**实现部分接口使用多级缓存（Caffeine + Redis），其余接口仅用 Redis 缓存。以下是具体实现方案和示例：


------
### 🔧 **核心配置：创建两类缓存管理器**

#### **多级缓存管理器**（Caffeine + Redis）

```java
@Configuration
public class CacheConfig {

    // 一级缓存：Caffeine（短TTL）
    @Bean("caffeineCacheManager")
    public CacheManager caffeineCacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(10, TimeUnit.SECONDS)); // 短TTL避免脏数据
        return manager;
    }

    // 二级缓存：Redis（长TTL）
    @Bean("redisCacheManager")
    public CacheManager redisCacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30));
        return RedisCacheManager.builder(factory).cacheDefaults(config).build();
    }

    // 多级缓存组合管理器
    @Bean("multiLevelCacheManager")
    public CacheManager multiLevelCacheManager(
            @Qualifier("caffeineCacheManager") CacheManager level1,
            @Qualifier("redisCacheManager") CacheManager level2) {
        return new CompositeCacheManager(level1, level2); // 组合两级缓存[1,4](@ref)
    }
}
```
#### **单级Redis缓存管理器**（独立配置）

```java
@Bean("pureRedisCacheManager")
public CacheManager pureRedisCacheManager(RedisConnectionFactory factory) {
    RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
        .entryTtl(Duration.ofHours(1));
    return RedisCacheManager.builder(factory).cacheDefaults(config).build();
}
```


------
### 🛠️ **业务层使用：按接口指定缓存策略**

#### **多级缓存接口**（热点数据）

```java
@Service
public class ProductService {

    // 使用多级缓存（优先查Caffeine，未命中查Redis）
    @Cacheable(cacheManager = "multiLevelCacheManager", value = "hot_products", key = "#id")
    public Product getHotProduct(Long id) {
        return productRepository.findById(id).orElse(null); // 数据库查询[4](@ref)
    }
}
```
#### **单级Redis缓存接口**（普通数据）

```java
@Service
public class UserService {

    // 仅用Redis缓存
    @Cacheable(cacheManager = "pureRedisCacheManager", value = "users", key = "#id")
    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null); // 数据库查询[5](@ref)
    }
}
```
#### **动态条件控制**（更精细的粒度）

```java
@Cacheable(cacheManager = "multiLevelCacheManager", value = "products", 
           condition = "#isHot == true") // 仅当isHot=true时启用多级缓存
public Product getProduct(Long id, boolean isHot) {
    // ...
}
```


------
### ⚙️ **高级场景：自定义注解简化配置**

#### 定义注解 `@MultiLevelCache`

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Cacheable(cacheManager = "multiLevelCacheManager")
public @interface MultiLevelCache {
    String value();
    String key();
}
```
#### 在目标接口上使用

```java
@MultiLevelCache(value = "orders", key = "#orderId") // 自动走多级缓存
public Order getOrder(String orderId) {
    // ...
}
```


------
### ⚠️ **注意事项与优化**

1. **缓存一致性**
   - 更新多级缓存数据时，需同时清除本地和Redis缓存：
     ```java
     @CacheEvict(cacheManager = "multiLevelCacheManager", value = "hot_products", key = "#id")
     public void updateProduct(Long id) { ... }
     ```
   - 集群环境下，使用 **Redis Pub/Sub 通知其他节点失效本地缓存**[2,3](@ref)。
2. **内存控制**
   - 本地缓存（Caffeine）限制 `maximumSize`，避免 OOM。
   - 非热点数据禁止使用多级缓存，减少内存压力。
3. **监控区分**
   - 独立监控两类缓存命中率：
     ```java
     // 多级缓存监控
     caffeineCacheManager.getCache("hot_products").getNativeCache().stats().hitRate();
     // Redis缓存监控
     redisTemplate.opsForValue().get("users::123");
     ```


------
### 💎 **方案对比与选型**

| **场景**                   | **策略**            | **配置方式**                                        | **优势**                  |
| -------------------------- | ------------------- | --------------------------------------------------- | ------------------------- |
| 高频热点数据（如商品详情） | 多级缓存            | `@Cacheable(cacheManager="multiLevelCacheManager")` | 纳秒级响应，降低Redis压力 |
| 低频普通数据（如用户信息） | 单级Redis           | `@Cacheable(cacheManager="pureRedisCacheManager")`  | 节省内存，保证数据一致性  |
| 条件化缓存（动态决策）     | 注解+SpEL条件表达式 | `condition = "#isHot"`                              | 灵活控制缓存层级          |


------
### 🔍 **扩展：解决多级缓存的典型问题**

- 缓存穿透：在多级缓存的 get 方法中，对空值进行短时间缓存：
  ```
  if (value == null) {
      redisCache.put(key, NULL_OBJECT, 30, TimeUnit.SECONDS); // 缓存空值[5](@ref)
  }
  ```
- 缓存雪崩：为 Redis 的 TTL 添加随机扰动：
  ```
  .entryTtl(Duration.ofMinutes(30 + ThreadLocalRandom.current().nextInt(10)));
  ```


------
通过以上设计，**热点接口**（如秒杀商品查询）享受本地缓存的速度优势（<10ms），**普通接口**（如用户信息）保持 Redis 的全局一致性，同时避免内存浪费。实际部署时，建议结合 **Spring Actuator** 监控缓存指标，并根据业务流量动态调整缓存策略。
## 自定义TTL

在Spring Boot中，`@Cacheable`本身不直接支持TTL设置（因其为抽象层，不依赖具体缓存实现），但可通过以下方法实现自定义TTL：


------
### ⏳ **自定义CacheManager（推荐）**

通过扩展`RedisCacheManager`解析`cacheNames`中的TTL信息：
1. **自定义CacheManager**：
   ```java
   public class CustomRedisCacheManager extends RedisCacheManager {
       public CustomRedisCacheManager(RedisCacheWriter writer, RedisCacheConfiguration config) {
           super(writer, config);
       }
   
       @Override
       protected RedisCache createRedisCache(String name, RedisCacheConfiguration config) {
           String[] parts = name.split("#");  // 格式：cacheName#TTL
           if (parts.length > 1) {
               long ttl = Long.parseLong(parts[1]);
               config = config.entryTtl(Duration.ofSeconds(ttl)); // 设置TTL
           }
           return super.createRedisCache(parts[0], config);
       }
   }
   ```
2. **配置Bean**：
   
   ```java
   @Bean
   public CacheManager cacheManager(RedisConnectionFactory factory) {
       RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
           .entryTtl(Duration.ofHours(1)); // 默认TTL
       return new CustomRedisCacheManager(
           RedisCacheWriter.nonLockingRedisCacheWriter(factory), defaultConfig
       );
   }
   ```
3. **使用注解**：
   
   ```java
   @Cacheable(cacheNames = "users#3600", key = "#id") // TTL=3600秒
   public User getUser(Long id) { ... }
   ```
   **优点**：简洁高效，无需修改业务代码[1,2,6](@ref)。


------
### ✨ **自定义注解+AOP**

通过自定义注解（如`@CacheTTL`）和AOP动态设置TTL：
1. **定义注解**：
   
   ```java
   @Target({ElementType.METHOD})
   @Retention(RetentionPolicy.RUNTIME)
   public @interface CacheTTL {
       long value() default 60; // 默认60秒
   }
   ```
2. **AOP拦截**：
   ```java
   @Aspect
   @Component
   public class CacheTTLAspect {
       @Around("@annotation(cacheTTL)")
       public Object applyTTL(ProceedingJoinPoint pjp, CacheTTL cacheTTL) throws Throwable {
           long ttl = cacheTTL.value();
           // 将TTL存入ThreadLocal
           CacheContext.setTTL(ttl);
           return pjp.proceed();
       }
   }
   ```
3. **扩展RedisCache**：
   ```java
   public class CustomRedisCache extends RedisCache {
       @Override
       public void put(Object key, Object value) {
           Long ttl = CacheContext.getTTL(); // 从ThreadLocal获取TTL
           if (ttl != null) {
               // 使用自定义TTL写入Redis
               cacheWriter.put(name, serializeKey(key), serializeValue(value), Duration.ofSeconds(ttl));
           } else {
               super.put(key, value);
           }
       }
   }
   ```
   **优点**：语义明确，支持方法级精细控制[1,6,8](@ref)。


------
### ⚙️ **缓存提供者原生配置**

针对具体缓存中间件配置全局或缓存区TTL：
1. **Redis全局默认TTL**：
   ```java
   @Bean
   public CacheManager cacheManager(RedisConnectionFactory factory) {
       RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
           .entryTtl(Duration.ofMinutes(30)); // 所有缓存默认30分钟
       return RedisCacheManager.builder(factory).cacheDefaults(config).build();
   }
   ```
2. **Ehcache缓存区TTL**：
   ```java
   <!-- ehcache.xml -->
   <cache name="users"
          maxEntriesLocalHeap="1000"
          timeToLiveSeconds="3600"/> <!-- TTL=1小时 -->
   ```
   **适用场景**：TTL统一或按缓存区分组设置[4,7](@ref)。


------
### ⚠️ **注意事项**

1. 
   优先级：
   - 方法级注解TTL > 缓存区配置 > 全局默认TTL[1,6](@ref)。
2. 
   时间单位：
   - Redis默认用秒，Ehcache支持秒/毫秒，需注意单位转换。
3. 
   缓存穿透：
   - 短TTL缓存空值（`unless = "#result == null"`）避免频繁查询DB[1](@ref)。
4. 
   动态刷新：
   - 结合`@Scheduled`+`@CacheEvict`定时刷新热点数据（如提前10秒续期）[1,6](@ref)。


------
### 🔄 **方法对比**

| **方法**           | 适用场景              | 优点                         | 缺点                 |
| ------------------ | --------------------- | ---------------------------- | -------------------- |
| 自定义CacheManager | Redis环境，需快速集成 | 代码侵入小，配置灵活         | 需规范cacheNames格式 |
| 自定义注解+AOP     | 需要方法级精细控制    | 语义清晰，扩展性强           | AOP增加复杂度        |
| 缓存提供者原生配置 | TTL分组或全局统一     | 无需代码改动，依赖中间件能力 | 灵活性低             |
> 💡 **推荐选择**：
>
> - 简单场景 → **自定义CacheManager**（快速生效）[1,2](@ref)；
> - 复杂逻辑 → **自定义注解+AOP**（如动态TTL+自动刷新）[6,8](@ref)。
## 延迟双删

在Spring应用中实现延迟双删策略，需结合缓存注解（如`@CacheEvict`）与异步延迟删除机制，解决高并发下缓存与数据库的数据一致性问题。以下是两种主流实现方案及核心实践：


------
### ⚙️ **延迟双删的核心原理**

**问题场景**：
在并发更新时，若仅删除一次缓存，可能出现：
1. 线程A删除缓存 → 更新数据库（耗时操作）
2. 线程B在A更新完成前读取数据库旧数据 → 将旧数据写入缓存
3. 线程A更新完成，但缓存已被B污染，导致后续请求读取脏数据。
**延迟双删流程**：
1. **首次删除缓存**：更新数据库前删除缓存，防止旧数据被读取。
2. **更新数据库**：执行业务数据更新。
3. **延迟二次删除**：等待一段时间（如500ms）后再次删除缓存，确保并发读操作已完成，避免脏数据残留。


------
### 🛠️ **实现方案一：基于AOP切面 + 自定义注解**

#### **定义自定义注解**

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DelayDoubleDelete {
    String cacheName();  // 缓存名称
    long delay() default 500; // 延迟时间（毫秒）
}
```
#### **实现AOP切面（核心逻辑）**

```java
@Aspect
@Component
public class DelayDoubleDeleteAspect {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Around("@annotation(delayDelete)")
    public Object doDelayDelete(ProceedingJoinPoint joinPoint, DelayDoubleDelete delayDelete) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        
        // 1. 首次删除缓存
        String cacheName = delayDelete.cacheName();
        Set<String> keys = redisTemplate.keys(cacheName + ":*"); // 模糊匹配Key
        redisTemplate.delete(keys);
        
        // 2. 执行数据库更新
        Object result = joinPoint.proceed();
        
        // 3. 延迟二次删除（异步线程）
        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(delayDelete.delay());
                Set<String> keysAgain = redisTemplate.keys(cacheName + ":*");
                redisTemplate.delete(keysAgain);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        return result;
    }
}
```
#### **业务层使用示例**

```java
@Service
public class UserService {
    @DelayDoubleDelete(cacheName = "userCache", delay = 500)
    public void updateUser(User user) {
        userRepository.save(user); // 更新数据库
    }
}
```


------
### 🔌 **实现方案二：增强CacheManager（非侵入式）**

若希望无侵入式集成，可包装Spring Cache的`CacheManager`，自动为`@CacheEvict`添加延迟双删逻辑。
#### **包装Cache与CacheManager**

```java
public class EnhancedCache implements Cache {
    private final Cache delegate;
    private final RedisTemplate<String, Object> redisTemplate;
    private final long delay;

    @Override
    public void evict(Object key) {
        delegate.evict(key); // 首次删除
        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(delay);
                delegate.evict(key); // 延迟二次删除
            } catch (InterruptedException ignored) {}
        });
    }
}

public class EnhancedCacheManager implements CacheManager {
    private final CacheManager delegate;
    private final long delay;

    @Override
    public Cache getCache(String name) {
        return new EnhancedCache(delegate.getCache(name), delay);
    }
}
```
#### **注册增强CacheManager至Spring容器**

```java
@Configuration
public class CacheConfig {
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheManager defaultManager = RedisCacheManager.create(factory);
        return new EnhancedCacheManager(defaultManager, 500); // 延迟500ms
    }
}
```
**效果**：所有使用`@CacheEvict`的方法自动触发延迟双删。


------
### ⚠️ **关键注意事项**

1. **延迟时间设置**
   - 建议**500ms-1000ms**，根据业务SQL平均执行时间调整。
   - 可通过SpEL动态设置：`@DelayDoubleDelete(delay = "#{T(java.lang.Math).min(1000, #user.updateTime)})`。
2. **缓存Key的匹配**
   - 使用`redisTemplate.keys(pattern)`需谨慎，避免模糊匹配导致误删。
   - 推荐**精确Key定位**：在注解中指定Key表达式（如`key = "#user.id"`）。
3. **线程池优化**
   - 异步删除需使用独立线程池，避免阻塞主线程：
     ```
     private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(4);
     executor.schedule(() -> deleteCache(key), delay, TimeUnit.MILLISECONDS);
     ```
4. **适用场景限制**
   - **读多写少**：频繁写操作会导致缓存频繁失效，降低性能。
   - **最终一致性**：延迟双删不保证强一致，适用于容忍毫秒级延迟的业务。


------
### 📊 **方案对比**

| **方案**         | 侵入性 | 灵活性 | 维护性                   | 适用场景          |
| ---------------- | ------ | ------ | ------------------------ | ----------------- |
| AOP + 自定义注解 | 中     | 高     | 需维护切面逻辑           | 需精细控制缓存Key |
| 增强CacheManager | 低     | 中     | 全局生效，无需改业务代码 | 全项目统一策略    |


------
### 💎 **总结**

- **首选AOP方案**：需定制化缓存清理逻辑时（如模糊删除、多级缓存），使用自定义注解更灵活。
- **无侵入方案**：若项目广泛使用`@CacheEvict`，增强`CacheManager`可快速生效。
- **兜底策略**：结合**短TTL**（如30s）确保极端情况下缓存自动失效，双重保障数据一致性。
> 完整代码参考：[GitHub示例](https://github.com/example/delay-double-delete)
## CacheManager 增强

在 Spring 环境下，`EnhancedCache` 的延迟双删机制与事务回滚的冲突核心在于：**事务回滚时数据库操作被撤销，但异步的二次删除仍会执行，导致新写入的缓存被误删**。以下是优化方案与原理说明：


------
### ⚠️ **问题根源**

```
CompletableFuture.runAsync(() -> {
    Thread.sleep(delay);
    delegate.evict(key); // 事务回滚后仍执行二次删除
});
```
- **风险**：若数据库事务回滚，二次删除会清除其他线程写入的新缓存（如新插入的数据），造成数据不一致。


------
### 🔧 **解决方案：绑定二次删除到事务提交**

#### **核心改造思路**

将二次删除操作延迟到事务提交后执行，若事务回滚则取消删除任务：
```
@Override
public void evict(Object key) {
    delegate.evict(key); // 首次删除

    // 仅在事务提交后执行二次删除
    TransactionSynchronizationManager.registerSynchronization(
        new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                scheduleSecondEvict(key); // 提交后调度二次删除
            }
        }
    );
}

private void scheduleSecondEvict(Object key) {
    CompletableFuture.runAsync(() -> {
        try {
            Thread.sleep(delay);
            delegate.evict(key);
        } catch (InterruptedException ignored) {}
    });
}
```
**原理**：
- `TransactionSynchronization.afterCommit()` 确保二次删除仅在事务成功提交后触发。
- 若事务回滚，`afterCommit()` 不会执行，避免误删新缓存。
#### **处理无事务场景**

若当前无事务，直接执行异步删除：
```
@Override
public void evict(Object key) {
    delegate.evict(key); 
    
    if (TransactionSynchronizationManager.isActualTransactionActive()) {
        // 绑定到事务提交
        TransactionSynchronizationManager.registerSynchronization(...);
    } else {
        // 无事务时直接异步删除
        scheduleSecondEvict(key);
    }
}
```


------
### ⚙️ **增强健壮性**

#### **线程池隔离**

使用独立线程池，避免阻塞事务线程：
```
private final ScheduledExecutorService executor = 
    Executors.newScheduledThreadPool(4);

private void scheduleSecondEvict(Object key) {
    executor.schedule(() -> delegate.evict(key), delay, TimeUnit.MILLISECONDS);
}
```
#### **事务回滚补偿**

若事务回滚需撤销首次删除（复杂场景）：
```
@Override
public void evict(Object key) {
    Object cachedValue = delegate.get(key).orElse(null); // 备份旧值
    delegate.evict(key); // 首次删除

    TransactionSynchronizationManager.registerSynchronization(
        new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_ROLLED_BACK) {
                    delegate.put(key, cachedValue); // 回滚时恢复旧缓存
                } else if (status == STATUS_COMMITTED) {
                    scheduleSecondEvict(key); // 提交后二次删除
                }
            }
        }
    );
}
```
**注意**：此方案适用于**强一致性要求**的场景，但需考虑缓存恢复的并发安全问题。


------
### 📊 **方案对比**

| **方案**               | 一致性保障     | 复杂度 | 适用场景              |
| ---------------------- | -------------- | ------ | --------------------- |
| 事务提交后触发二次删除 | 避免误删新缓存 | 中     | 通用场景（推荐）      |
| 回滚时恢复旧缓存       | 强一致性       | 高     | 金融/支付等高敏感业务 |


------
### 💎 **总结**

- **优先事务绑定**：通过 `TransactionSynchronization.afterCommit()` 确保二次删除仅在事务提交后执行。
- **备份恢复慎用**：仅在必要时恢复旧缓存，避免并发冲突。
- **延迟双删本质**：该机制适用于**最终一致性**场景，若需强一致性，建议结合分布式事务（如 TCC）。
> 完整代码示例参考：[GitHub Gist](https://gist.github.com/example)
> 扩展阅读：[Spring 事务与缓存协同设计](https://spring.io/guides)
## AOP

在Spring框架中，通过自定义AOP切面结合自定义注解方案，**可以识别事务是否回滚**，但需依赖Spring的事务管理机制和线程上下文状态。以下是具体实现方案及注意事项：


------
### 🔍 核心实现方案

#### **通过 `TransactionSynchronizationManager` 主动查询事务状态**

在切面中可直接检查当前事务的标记状态：
```java
@Aspect
@Component
public class CustomAspect {
    @Around("@annotation(com.example.CustomAnnotation)")
    public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            Object result = joinPoint.proceed(); // 执行业务方法
            // 检查事务是否被标记为回滚
            if (TransactionSynchronizationManager.isActualTransactionActive() 
                && TransactionAspectSupport.currentTransactionStatus().isRollbackOnly()) {
                System.out.println("【事务已标记回滚】");
            }
            return result;
        } catch (Exception ex) {
            // 若业务方法抛出异常，事务通常已标记回滚
            System.out.println("【事务因异常回滚】");
            throw ex;
        }
    }
}
```
- 原理：
  - `TransactionAspectSupport.currentTransactionStatus().isRollbackOnly()` 返回 `true` 表示事务已被标记为回滚（例如调用 `setRollbackOnly()` 或满足回滚规则的异常）。
  - `TransactionSynchronizationManager.isActualTransactionActive()` 检查当前是否存在活动事务。
- **适用场景**：在方法执行后检测事务状态。


------
#### **注册事务同步回调（推荐）**

通过 `TransactionSynchronization` 监听事务提交或回滚事件：
```java
@Around("@annotation(com.example.CustomAnnotation)")
public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {
    // 注册事务同步器
    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
        @Override
        public void afterCompletion(int status) {
            if (status == STATUS_ROLLED_BACK) {
                System.out.println("【事务已回滚】");
            } else if (status == STATUS_COMMITTED) {
                System.out.println("【事务已提交】");
            }
        }
    });
    return joinPoint.proceed();
}
```
- 原理：
  - `afterCompletion` 回调在事务完成时触发，参数 `status` 标识事务状态（`STATUS_ROLLED_BACK` 或 `STATUS_COMMITTED`）。
- **优势**：无需主动查询，由事务管理器自动通知，准确性高。


------
#### **在切面中直接获取 `TransactionStatus`**

若自定义切面在事务切面**之后**执行（优先级更低），可直接注入事务状态：
```java
@Aspect
@Component
@Order(Ordered.LOWEST_PRECEDENCE) // 确保优先级低于事务切面
public class CustomAspect {
    @Around("@annotation(com.example.CustomAnnotation)")
    public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {
        TransactionStatus status = TransactionAspectSupport.currentTransactionStatus();
        try {
            Object result = joinPoint.proceed();
            if (status.isRollbackOnly()) {
                System.out.println("事务已标记回滚");
            }
            return result;
        } catch (Exception ex) {
            System.out.println("事务因异常回滚");
            throw ex;
        }
    }
}
```
- **注意**：切面优先级必须低于事务切面（`@Order(Ordered.LOWEST_PRECEDENCE)`），否则无法获取正确状态。


------
### ⚠️ 注意事项

#### **切面执行顺序**

- 事务切面默认优先级为 `Ordered.LOWEST_PRECEDENCE`（最低优先级）。
- **问题**：若自定义切面优先级更高且未抛出异常，事务切面无法感知异常，导致回滚失效。
- 解决：
  - 自定义切面优先级需低于事务切面：`@Order(Ordered.LOWEST_PRECEDENCE + 1)`。
  - 在切面中捕获异常后必须重新抛出或调用 `setRollbackOnly()`。
#### **无事务场景**

- 若方法未开启事务（如 `@Transactional(propagation = NOT_SUPPORTED)`），则 `TransactionSynchronizationManager.isActualTransactionActive()` 返回 `false`，需避免空指针异常。
#### **异步线程问题**

- 事务状态绑定于当前线程，若切面内启用新线程，需手动传递事务上下文（如使用 `TransactionContextHolder`）。


------
### 💎 方案对比与选择

| **方案**                                    | 准确性 | 复杂度 | 适用场景                 |
| ------------------------------------------- | ------ | ------ | ------------------------ |
| 主动查询事务状态                            | 中     | 低     | 简单状态检测             |
| 事务同步回调 (`TransactionSynchronization`) | 高     | 中     | 需精准监听事务生命周期   |
| 直接获取 `TransactionStatus`                | 高     | 高     | 切面优先级低于事务切面时 |
> **推荐实践**：优先使用 **事务同步回调** 方案，可靠性最高且与事务生命周期解耦。


------
### 🛠️ 扩展：编程式标记回滚

若需在切面中主动触发回滚（如权限校验失败）：
```
@Around("@annotation(com.example.CustomAnnotation)")
public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {
    if (!checkPermission()) {
        // 标记事务回滚
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        throw new SecurityException("权限不足");
    }
    return joinPoint.proceed();
}
```
此操作会强制事务回滚，且后续事务同步器将收到 `STATUS_ROLLED_BACK` 事件。


------
### 💎 **总结**

在自定义AOP切面中识别事务回滚的关键是：
1. **事务状态查询**：通过 `TransactionAspectSupport.currentTransactionStatus()` 或 `TransactionSynchronizationManager` 主动检测。
2. **事件监听**：注册 `TransactionSynchronization` 回调监听提交/回滚事件。
3. **切面顺序**：确保自定义切面优先级低于事务切面，避免状态误判。
4. **异常处理**：切面内捕获异常后需重新抛出或显式调用 `setRollbackOnly()`。