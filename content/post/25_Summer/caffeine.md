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

### 🔥 **一、核心特性**

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

### ⚙️ **二、工作原理与关键技术**

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

### 🚀 **三、适用场景**

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

### ⚖️ **四、与其他缓存库对比**

| **特性**     | **Caffeine**      | **Guava Cache** | **Redis**       |
| ------------ | ----------------- | --------------- | --------------- |
| **算法**     | Window TinyLFU    | LRU             | 多种（如 LRU）  |
| **并发性能** | ⭐⭐⭐⭐（无锁优化）  | ⭐⭐（锁竞争）    | ⭐⭐⭐（网络延迟） |
| **内存管理** | 灵活（权重/大小） | 基础            | 依赖外部配置    |
| **适用场景** | 本地缓存          | 小规模本地缓存  | 分布式缓存      |

------

### 💻 **五、基础代码示例**

```
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

### ⚠️ **六、常见问题与优化**

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

### 📐 **一、多级缓存架构设计**

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

### ⚙️ **二、依赖配置（pom.xml）**

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

### 🔧 **三、多级缓存配置类**

```
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

### 🧩 **四、多级缓存管理器实现**

```
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

### 🛠️ **五、业务层使用示例**

```
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

### 🛡️ **六、关键优化策略**

1. **数据一致性保障**

   - **双删策略**：更新数据后同时清除两级缓存（如上例 `@CacheEvict`）
   - **Pub/Sub 同步**：通过 Redis 发布订阅，通知其他节点失效本地缓存[1](@ref)

   ```
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

   ```
   if (product == null) {
       level2.put(key, NULL_OBJECT, 30, TimeUnit.SECONDS); // 缓存空对象
   }
   ```

3. **防雪崩机制**

   - Redis TTL 添加随机扰动：

   ```
   redisTemplate.opsForValue().set(key, value, 30 + random.nextInt(10), TimeUnit.MINUTES);
   ```

4. **性能监控**

   ```
   // 获取Caffeine统计信息
   CacheStats stats = caffeineCache.getNativeCache().stats();
   log.info("L1命中率: {}", stats.hitRate());
   ```

------

### 💎 **七、适用场景与性能对比**

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

### 🔧 **一、核心配置：创建两类缓存管理器**

#### 1. **多级缓存管理器**（Caffeine + Redis）

```
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

#### 2. **单级Redis缓存管理器**（独立配置）

```
@Bean("pureRedisCacheManager")
public CacheManager pureRedisCacheManager(RedisConnectionFactory factory) {
    RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
        .entryTtl(Duration.ofHours(1));
    return RedisCacheManager.builder(factory).cacheDefaults(config).build();
}
```

------

### 🛠️ **二、业务层使用：按接口指定缓存策略**

#### 1. **多级缓存接口**（热点数据）

```
@Service
public class ProductService {

    // 使用多级缓存（优先查Caffeine，未命中查Redis）
    @Cacheable(cacheManager = "multiLevelCacheManager", value = "hot_products", key = "#id")
    public Product getHotProduct(Long id) {
        return productRepository.findById(id).orElse(null); // 数据库查询[4](@ref)
    }
}
```

#### 2. **单级Redis缓存接口**（普通数据）

```
@Service
public class UserService {

    // 仅用Redis缓存
    @Cacheable(cacheManager = "pureRedisCacheManager", value = "users", key = "#id")
    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null); // 数据库查询[5](@ref)
    }
}
```

#### 3. **动态条件控制**（更精细的粒度）

```
@Cacheable(cacheManager = "multiLevelCacheManager", value = "products", 
           condition = "#isHot == true") // 仅当isHot=true时启用多级缓存
public Product getProduct(Long id, boolean isHot) {
    // ...
}
```

------

### ⚙️ **三、高级场景：自定义注解简化配置**

#### 1. 定义注解 `@MultiLevelCache`

```
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Cacheable(cacheManager = "multiLevelCacheManager")
public @interface MultiLevelCache {
    String value();
    String key();
}
```

#### 2. 在目标接口上使用

```
@MultiLevelCache(value = "orders", key = "#orderId") // 自动走多级缓存
public Order getOrder(String orderId) {
    // ...
}
```

------

### ⚠️ **四、注意事项与优化**

1. **缓存一致性**

   - 更新多级缓存数据时，需同时清除本地和Redis缓存：

     ```
     @CacheEvict(cacheManager = "multiLevelCacheManager", value = "hot_products", key = "#id")
     public void updateProduct(Long id) { ... }
     ```

   - 集群环境下，使用 **Redis Pub/Sub 通知其他节点失效本地缓存**[2,3](@ref)。

2. **内存控制**

   - 本地缓存（Caffeine）限制 `maximumSize`，避免 OOM。
   - 非热点数据禁止使用多级缓存，减少内存压力。

3. **监控区分**

   - 独立监控两类缓存命中率：

     ```
     // 多级缓存监控
     caffeineCacheManager.getCache("hot_products").getNativeCache().stats().hitRate();
     // Redis缓存监控
     redisTemplate.opsForValue().get("users::123");
     ```

------

### 💎 **五、方案对比与选型**

| **场景**                   | **策略**            | **配置方式**                                        | **优势**                  |
| -------------------------- | ------------------- | --------------------------------------------------- | ------------------------- |
| 高频热点数据（如商品详情） | 多级缓存            | `@Cacheable(cacheManager="multiLevelCacheManager")` | 纳秒级响应，降低Redis压力 |
| 低频普通数据（如用户信息） | 单级Redis           | `@Cacheable(cacheManager="pureRedisCacheManager")`  | 节省内存，保证数据一致性  |
| 条件化缓存（动态决策）     | 注解+SpEL条件表达式 | `condition = "#isHot"`                              | 灵活控制缓存层级          |

------

### 🔍 **六、扩展：解决多级缓存的典型问题**

- 缓存穿透：在多级缓存的 get 方法中，对空值进行短时间缓存：

  ```
if (value == null) {
      redisCache.put(key, NULL_OBJECT, 30, TimeUnit.SECONDS); // 缓存空值[5](@ref)
}
  ```

- 

  缓存雪崩

  ：为 Redis 的 TTL 添加随机扰动：

  ```
  .entryTtl(Duration.ofMinutes(30 + ThreadLocalRandom.current().nextInt(10)));
  ```

------

通过以上设计，**热点接口**（如秒杀商品查询）享受本地缓存的速度优势（<10ms），**普通接口**（如用户信息）保持 Redis 的全局一致性，同时避免内存浪费。实际部署时，建议结合 **Spring Actuator** 监控缓存指标，并根据业务流量动态调整缓存策略。

## 自定义TTL

在Spring Boot中，`@Cacheable`本身不直接支持TTL设置（因其为抽象层，不依赖具体缓存实现），但可通过以下方法实现自定义TTL：

------

### ⏳ **一、自定义CacheManager（推荐）**

通过扩展`RedisCacheManager`解析`cacheNames`中的TTL信息：

1. **自定义CacheManager**：

   ```
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

   ```
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

   ```
   @Cacheable(cacheNames = "users#3600", key = "#id") // TTL=3600秒
   public User getUser(Long id) { ... }
   ```

   **优点**：简洁高效，无需修改业务代码[1,2,6](@ref)。

------

### ✨ **二、自定义注解+AOP**

通过自定义注解（如`@CacheTTL`）和AOP动态设置TTL：

1. **定义注解**：

   ```
   @Target({ElementType.METHOD})
   @Retention(RetentionPolicy.RUNTIME)
   public @interface CacheTTL {
       long value() default 60; // 默认60秒
   }
   ```

2. **AOP拦截**：

   ```
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

   ```
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

### ⚙️ **三、缓存提供者原生配置**

针对具体缓存中间件配置全局或缓存区TTL：

1. **Redis全局默认TTL**：

   ```
   @Bean
   public CacheManager cacheManager(RedisConnectionFactory factory) {
       RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
           .entryTtl(Duration.ofMinutes(30)); // 所有缓存默认30分钟
       return RedisCacheManager.builder(factory).cacheDefaults(config).build();
   }
   ```

2. **Ehcache缓存区TTL**：

   ```
   <!-- ehcache.xml -->
   <cache name="users"
          maxEntriesLocalHeap="1000"
          timeToLiveSeconds="3600"/> <!-- TTL=1小时 -->
   ```

   **适用场景**：TTL统一或按缓存区分组设置[4,7](@ref)。

------

### ⚠️ **注意事项**

1. 

   优先级

   ：

   - 方法级注解TTL > 缓存区配置 > 全局默认TTL[1,6](@ref)。

2. 

   时间单位

   ：

   - Redis默认用秒，Ehcache支持秒/毫秒，需注意单位转换。

3. 

   缓存穿透

   ：

   - 短TTL缓存空值（`unless = "#result == null"`）避免频繁查询DB[1](@ref)。

4. 

   动态刷新

   ：

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
