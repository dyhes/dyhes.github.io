---
title: 【Shopee】Concurrent Java
date: 2025-08-04 00:00:00+0000
categories: [snow, willow, temple]
tags: [Shopee]
---

## `ExecutorService`

在 Java 8 之前（即 Java 5–7），`ExecutorService` 的实现主要通过 `java.util.concurrent` 包提供，核心类包括 `ThreadPoolExecutor` 和 `ScheduledThreadPoolExecutor`。以下是其关键实现方式及功能：

------

### ⚙️ **1. 核心实现类**

- **`ThreadPoolExecutor`**
  是 `ExecutorService` 的主要实现，用于管理线程池。其构造函数支持配置核心参数：

  - `corePoolSize`：核心线程数（即使空闲也不会回收）。
  - `maximumPoolSize`：最大线程数（当任务队列满时创建新线程）。
  - `keepAliveTime`：非核心线程的空闲存活时间。
  - `workQueue`：任务队列（如 `LinkedBlockingQueue`）。
    ​**示例**​：

  ```
  ExecutorService executor = new ThreadPoolExecutor(
      5, 10, 5000, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>()
  );
  ```

- **`ScheduledThreadPoolExecutor`**
  扩展 `ThreadPoolExecutor`，支持定时任务：

  - `schedule()`：延迟执行单次任务。
  - `scheduleAtFixedRate()`：固定频率执行任务（忽略任务执行时间）。
  - `scheduleWithFixedDelay()`：固定延迟执行任务（任务结束到下一次开始的时间间隔）。
    ​**示例**​：

  ```
  ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
  scheduler.scheduleAtFixedRate(() -> System.out.println("Task"), 1, 5, TimeUnit.SECONDS);
  ```

------

### 🛠️ **2. 创建 `ExecutorService` 的工厂方法**

通过 `Executors` 工具类快速创建线程池（底层仍调用 `ThreadPoolExecutor`）：

- **`newFixedThreadPool(int nThreads)`**
  固定大小线程池（核心线程数=最大线程数），任务队列无界。
- **`newCachedThreadPool()`**
  弹性线程池（核心线程数=0，最大线程数=Integer.MAX_VALUE），空闲线程60秒回收。
- **`newSingleThreadExecutor()`**
  单线程池（保证任务顺序执行）。
- **`newScheduledThreadPool(int corePoolSize)`**
  定时任务线程池（基于 `ScheduledThreadPoolExecutor`）。

> ⚠️ **注意**：`newCachedThreadPool` 可能因任务过多导致线程数激增，需谨慎使用。

------

### 📨 **3. 任务提交与监控**

- **`execute(Runnable task)`**
  提交无返回值的任务（无法获取状态或结果）。

- **

  ```
  submit(Callable<T> task)
  ```

  **

  返回

   

  ```
  Future
  ```

   

  对象，支持：

  - `future.get()`：阻塞获取结果（或捕获异常）。
  - `future.get(timeout, unit)`：设置超时时间（超时抛出 `TimeoutException`）。
  - `future.cancel(true)`：中断任务（需任务响应中断）。

- 

  批量任务方法

  

  - `invokeAll()`：提交所有任务并返回 `Future` 列表。
  - `invokeAny()`：返回任意一个成功任务的结果。

------

### 🔚 **4. 关闭线程池**

- **`shutdown()`**
  停止接受新任务，等待已提交任务完成。

- **`shutdownNow()`**
  尝试立即停止所有任务（返回未执行的任务列表）。

- 

  推荐关闭流程

  （防止资源泄漏）：

  ```
  executor.shutdown();
  try {
      if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
          executor.shutdownNow(); // 超时后强制关闭
      }
  } catch (InterruptedException e) {
      executor.shutdownNow();
  }
  ```

------

### ⚠️ **5. 注意事项**

1. **中断响应**
   任务需检测 `Thread.interrupted()` 或处理 `InterruptedException`，否则无法及时取消。

2. **资源管理**
   避免线程泄漏：确保最终调用 `shutdown()`。

3. 

   队列选择

   

   - `LinkedBlockingQueue`：无界队列（可能导致内存溢出）。
   - `SynchronousQueue`：直接传递任务（`newCachedThreadPool` 使用，无缓冲）。

------

### 💎 **总结**

- **Java 5–7 的 `ExecutorService` 实现已成熟**，核心功能（线程池、任务调度、异步结果）通过 `ThreadPoolExecutor` 和 `ScheduledThreadPoolExecutor` 提供。
- **Java 8 新增的 `CompletableFuture` 优化了异步编程**，但底层仍依赖上述实现。
- **关键实践**：合理配置线程池参数、任务需支持中断、规范关闭流程。

## 超时取消

在 Java 中为线程池提交的任务设置超时并自动取消，核心是通过 `Future` 对象监控任务状态，结合超时控制机制实现。以下是三种主流方案，均基于线程池（`ExecutorService`）和任务结果监听机制：

------

### ⏳ 方案一：使用 `Future.get()` 设置超时（推荐）

**原理**：提交任务后，通过 `Future.get(timeout, unit)` 阻塞等待结果。若超时则抛出 `TimeoutException`，触发任务取消。
​**步骤**​：

1. 创建线程池（如 `FixedThreadPool`）。
2. 提交任务（`Callable` 或 `Runnable`），获取 `Future` 对象。
3. 调用 `future.get(timeout, unit)` 设置超时时间。
4. 捕获超时异常后，调用 `future.cancel(true)` 中断任务。

```
ExecutorService executor = Executors.newFixedThreadPool(4);

Callable<String> task = () -> {
    Thread.sleep(5000); // 模拟耗时任务（5秒）
    return "Done";
};

Future<String> future = executor.submit(task);

try {
    String result = future.get(1, TimeUnit.SECONDS); // 设置1秒超时
    System.out.println(result);
} catch (TimeoutException e) {
    System.out.println("任务超时，强制取消");
    future.cancel(true); // true：尝试中断正在执行的任务
} catch (Exception e) {
    e.printStackTrace();
} finally {
    executor.shutdown();
}
```

**关键点**：

- `future.cancel(true)` 会向任务线程发送中断信号（需任务响应中断才能退出）。
- 任务需检查中断状态（如 `Thread.interrupted()`），否则可能无法及时终止。

------

### 🔁 方案二：使用 `CompletableFuture`（Java 8+）

**原理**：通过 `CompletableFuture.supplyAsync()` 提交任务，用 `orTimeout()` 或 `completeOnTimeout()` 设置超时策略。
​**示例**​：

```
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    try {
        Thread.sleep(5000);
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
    return "Done";
}).orTimeout(1, TimeUnit.SECONDS) // 1秒超时后抛出TimeoutException
  .exceptionally(ex -> "超时处理结果");

future.thenAccept(System.out::println); // 输出结果或超时提示
```

**优势**：

- 链式调用，无需显式关闭线程池。
- `completeOnTimeout()` 支持超时返回默认值，避免异常。

------

### ⏱️ 方案三：结合 `ScheduledExecutorService` 监控超时

**原理**：启动一个定时任务监控线程，超时后主动取消原任务。
​**适用场景**​：需更精细控制超时逻辑（如批量任务独立超时）。
​**示例**​：

```
ExecutorService taskExecutor = Executors.newFixedThreadPool(4);
ScheduledExecutorService timeoutExecutor = Executors.newScheduledThreadPool(4);

Callable<String> task = () -> {
    Thread.sleep(5000);
    return "Done";
};

Future<String> future = taskExecutor.submit(task);

// 设置1秒后检查任务状态
timeoutExecutor.schedule(() -> {
    if (!future.isDone()) {
        System.out.println("任务超时，取消执行");
        future.cancel(true);
    }
}, 1, TimeUnit.SECONDS);

try {
    String result = future.get(); // 阻塞直到任务完成或取消
} catch (CancellationException e) {
    System.out.println("任务已被取消");
} finally {
    taskExecutor.shutdown();
    timeoutExecutor.shutdown();
}
```

**注意**：

- 需确保监控线程池大小足够，避免任务堆积。
- 适用于需要独立控制每个任务超时的场景。

------

### ⚠️ 关键注意事项

1. **中断响应**：
   任务需检测中断信号（如 `Thread.sleep()`、`Object.wait()` 会抛 `InterruptedException`），否则无法及时退出。

2. **资源清理**：
   超时后调用 `future.cancel(true)`，并确保最终关闭线程池。

3. **批量任务处理**：
   使用 `invokeAll()` 设置统一超时时间：

   ```
   List<Callable<String>> tasks = ...; // 任务列表
   List<Future<String>> futures = executor.invokeAll(tasks, 2, TimeUnit.SECONDS);
   for (Future<String> f : futures) {
       if (!f.isDone()) f.cancel(true);
   }
   ```

4. **避免任务堆积**：
   根据任务类型选择线程池类型（如 `CachedThreadPool` 可自动回收空闲线程）。

------

### 总结建议

- **简单场景**：优先使用 `Future.get()` + 超时异常处理。
- **链式编程**：Java 8+ 项目推荐 `CompletableFuture.orTimeout()`。
- **复杂监控**：需要独立控制每个任务超时时，用 `ScheduledExecutorService` 辅助。
- **任务设计**：确保任务可响应中断（如循环内检查 `Thread.interrupted()`）。

## Java 只读

在Java中，指定方法返回值为“只读”（即调用方无法修改返回的对象或数据）是确保数据封装性、线程安全性和代码健壮性的关键设计。以下是几种核心实现方案，附代码示例和适用场景分析：

------

### ⚙️ 1. **使用不可变对象（Immutable Objects）**

**核心思路**：通过设计类本身为不可变，确保所有返回值天然只读。

**实现规则**：

- 类声明为 `final`防止继承；

- 所有字段为 `private final`；

- 不提供 setter 方法；

- 若字段为可变对象（如集合），需深度复制或返回其不可变视图。

  **示例**：

```
public final class ImmutablePerson {
    private final String name;
    private final List<String> hobbies; // 可变对象字段
    public ImmutablePerson(String name, List<String> hobbies) {
        this.name = name;
        // 防御性复制：避免外部修改影响内部状态
        this.hobbies = new ArrayList<>(hobbies); 
    }
    // 返回不可变集合
    public List<String> getHobbies() {
        return Collections.unmodifiableList(hobbies);
    }
}
```

**优点**：线程安全、无需同步逻辑；

**缺点**：需手动实现深拷贝，可能增加内存开销。

------

### 📦 2. **返回不可变集合（Unmodifiable Collections）**

**适用场景**：方法返回集合类型（如 `List`、`Map`）时，防止调用方修改原始集合。

**实现方法**：使用 `Collections.unmodifiableXXX()`包装原始集合。

**示例**：

```
public class DataService {
    private List<String> data = new ArrayList<>();
    public List<String> getData() {
        return Collections.unmodifiableList(data); // 只读视图
    }
}
```

**注意**：

- 若原始集合被修改，只读视图会同步变化（浅不可变）；
- 调用方尝试修改时会抛出 `UnsupportedOperationException`。

------

### 📑 3. **返回副本（Defensive Copying）**

**适用场景**：需完全隔离返回对象与原始数据，避免任何关联性修改。

**实现方法**：通过 `clone()`或复制构造函数创建新对象。

**示例**：

```
public class DataHolder {
    private int[] values = {1, 2, 3};
    public int[] getValues() {
        return values.clone(); // 返回数组副本
    }
}
```

**优点**：彻底隔离原始数据；

**缺点**：复制大对象时性能较差。

------

### 🧩 4. **使用只读接口（Read-Only Interface）**

**核心思路**：定义仅包含 getter 方法的接口，返回接口类型而非具体类。

**示例**：

```
public interface ReadOnlyPerson {
    String getName();
}
public class Person implements ReadOnlyPerson {
    private String name;
    public String getName() { return name; }
    public ReadOnlyPerson asReadOnly() {
        return this; // 返回接口类型
    }
}
// 调用方
ReadOnlyPerson person = new Person("Alice").asReadOnly();
```

**优点**：编译时强制只读，无需运行时检查；

**缺点**：需额外定义接口。

------

### ⚡ 5. **代理模式（Proxy Pattern）**

**适用场景**：动态拦截修改操作，适用于复杂对象或需运行时控制的情况。

**实现方法**：通过 `InvocationHandler`拦截 setter 调用并抛出异常。

**示例**：

```
public ReadOnlyPerson createReadOnlyProxy(Person person) {
    return (ReadOnlyPerson) Proxy.newProxyInstance(
        ReadOnlyPerson.class.getClassLoader(),
        new Class[]{ReadOnlyPerson.class},
        (proxy, method, args) -> {
            if (method.getName().startsWith("set")) 
                throw new UnsupportedOperationException("Read-only object");
            return method.invoke(person, args);
        }
    );
}
```

**优点**：灵活控制权限；

**缺点**：反射调用有性能损耗。

------

### 🔍 **方案对比与选型建议**

| **方法**   | **适用场景**               | **性能影响**     | **安全性**       |
| ---------- | -------------------------- | ---------------- | ---------------- |
| 不可变对象 | 简单值对象、高频并发场景   | 低（若无深拷贝） | ⭐⭐⭐⭐⭐            |
| 不可变集合 | 返回集合类数据             | 低               | ⭐⭐⭐⭐（浅不可变） |
| 返回副本   | 小型对象或数组             | 中（大对象差）   | ⭐⭐⭐⭐⭐            |
| 只读接口   | 需编译时检查的复杂对象     | 低               | ⭐⭐⭐⭐             |
| 代理模式   | 动态控制权限的遗留系统适配 | 中               | ⭐⭐⭐              |

> 💡 **最佳实践**：
>
> - 优先选择 **不可变对象**（如 `String`、`LocalDateTime`）或 **不可变集合**；
> - 敏感数据（如数据库连接、配置）使用 **副本** 或 **只读接口**；
> - 避免直接返回原始引用（如 `getHobbies()`应返回不可变视图而非 `ArrayList`）。

通过合理选择上述方法，可有效确保Java方法返回值的只读性，减少副作用并提升代码稳定性。
