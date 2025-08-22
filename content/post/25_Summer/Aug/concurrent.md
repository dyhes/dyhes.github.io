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

