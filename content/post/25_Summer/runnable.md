---
title: 【Java】Runnable
date: 2025-06-19 00:00:00+0000
categories: 
- temple
tags:
- Java
---

## Callable & Runnable

在Java多线程编程中，`Runnable`和`Callable`是定义异步任务的两种核心接口，它们的设计目的和功能有显著差异。以下是两者的详细对比：

------

### ⚙️ **1. 方法定义与返回值**

- **`Runnable`**

  - 定义单一方法 `run()`，返回类型为 `void`，**不返回任何结果**。
  - 示例：日志记录、异步通知等无需返回值的任务。

  ```
  Runnable task = () -> System.out.println("Task executed");
  ```

- **`Callable`**

  - 定义方法 `call()`，**支持泛型返回值**（如 `Callable<Integer>` 返回整数）。
  - 示例：计算阶乘、数据库查询等需返回结果的任务。

  ```
  Callable<Integer> task = () -> { return 42; };
  ```

------

### ⚠️ **2. 异常处理机制**

- **`Runnable`**

  - `run()` **不能抛出受检异常（checked exception）**，只能在方法内部通过 `try-catch` 处理。

  ```
  Runnable task = () -> {
      try { Thread.sleep(1000); } 
      catch (InterruptedException e) { e.printStackTrace(); }
  };
  ```

- **`Callable`**

  - `call()` **可抛出受检异常**（如 `throws Exception`），异常会封装在 `Future.get()` 抛出的 `ExecutionException` 中，可通过 `getCause()` 获取原始异常。

  ```
  Callable<Integer> task = () -> { 
      if (invalid) throw new Exception("Error");
      return result;
  };
  ```

------

### 🔌 **3. 执行方式与线程池兼容性**

- **`Runnable`**
  - 可通过 `Thread` 类直接启动（`new Thread(runnable).start()`）或提交给 `ExecutorService`。
  - 提交后返回 `Future<?>`，但 `get()` 始终返回 `null`。
- **`Callable`**
  - **必须通过 `ExecutorService.submit()` 提交**，返回 `Future<V>` 对象，用于获取结果或异常。
  - 无法直接通过 `Thread` 类启动，需借助 `FutureTask` 包装（`new Thread(new FutureTask<>(callable)).start()`）。

------

### 📊 **4. 主要区别对比表**

| **特性**         | **Runnable**                            | **Callable**                       |
| ---------------- | --------------------------------------- | ---------------------------------- |
| **返回值**       | ❌ 无                                    | ✅ 支持泛型返回值                   |
| **异常处理**     | ❌ 不能抛出受检异常                      | ✅ 可抛出受检异常                   |
| **执行方式**     | ✅ 支持`Thread`或线程池                  | ❌ 仅支持线程池提交                 |
| **任务状态跟踪** | ⚠️ 仅能判断是否完成（`Future.isDone()`） | ✅ 可获取结果、异常及取消任务       |
| **引入版本**     | Java 1.0                                | Java 5（`java.util.concurrent`包） |

------

### 🧩 **5. 线程状态监控与结果获取**

- **`Runnable`**
  - 通过 `Future.isDone()` 判断任务完成状态，但无法获取结果或异常详情。
- **`Callable`**
  - 通过 `Future.get()` **阻塞获取结果**，支持超时设置（`get(long timeout, TimeUnit unit)`）。
  - 可捕获 `ExecutionException` 处理任务内部异常，或通过 `Future.cancel()` 取消任务。

------

### 💡 **6. 适用场景**

- **`Runnable`**：
  简单异步任务（如事件日志、线程池基础任务）。
- **`Callable`**：
  需返回结果或严格异常处理的任务（如并行计算、IO操作）。

------

### 📝 **代码示例对比**

```
// Runnable示例
ExecutorService executor = Executors.newSingleThreadExecutor();
Future<?> futureRunnable = executor.submit(() -> System.out.println("Runnable"));
futureRunnable.get(); // 返回null

// Callable示例
Future<Integer> futureCallable = executor.submit(() -> { 
    return 100; 
});
Integer result = futureCallable.get(); // 返回100
```

------

### 💎 **总结**

`Runnable`是轻量级异步任务的基础接口，而`Callable`通过返回值、异常传递和`Future`交互机制，扩展了复杂任务的并发处理能力。选择依据：

- 无需结果 → `Runnable`；
- 需结果/异常控制 → `Callable`。

## Future

以下是关于 Java 中 `Future` 接口的详细解析，结合其核心特性、实现原理、使用场景及注意事项进行系统性说明：

------

### ⚙️ **一、Future 的核心定位与作用**

`Future` 是 Java 并发编程中**异步计算结果的容器**（位于 `java.util.concurrent` 包），代表一个尚未完成的异步任务的结果。其核心价值在于：

- **解耦任务提交与结果获取**：主线程提交任务后继续执行其他逻辑，通过 `Future` 在需要时获取结果。
- **任务生命周期控制**：支持取消任务、检查完成状态及超时机制。

> 💡 **同步 vs. 异步的直观对比**：
>
> - **同步**：类似打电话，必须等待对方接通才能通信（主线程阻塞）。
> - **异步**：类似广播，发送后无需等待回复（主线程非阻塞）。

------

### 🔧 **二、核心方法解析**

| **方法**                                        | **功能说明**                                                 |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `boolean cancel(boolean mayInterruptIfRunning)` | 尝试取消任务。`mayInterruptIfRunning=true` 时，可中断正在执行的任务。 |
| `boolean isCancelled()`                         | 检查任务是否被取消（正常完成前取消返回 `true`）。            |
| `boolean isDone()`                              | 检查任务是否完成（含正常结束、异常终止或取消）。             |
| `V get()`                                       | **阻塞**直到任务完成并返回结果，若任务抛出异常则封装为 `ExecutionException`。 |
| `V get(long timeout, TimeUnit unit)`            | 带超时的结果获取，超时抛出 `TimeoutException`。              |

> ⚠️ **关键行为说明**：
>
> - **阻塞性**：`get()` 方法会阻塞调用线程，直至任务完成或超时。
> - **异常传递**：任务中的异常通过 `ExecutionException` 抛出，需调用 `e.getCause()` 获取原始异常。

------

### ⚡ **三、典型使用场景**

1. **并行计算**
   将大任务拆分为子任务并行执行，通过 `Future` 列表统一收集结果：

   ```java
   ExecutorService executor = Executors.newFixedThreadPool(4);
   List<Future<Integer>> futures = new ArrayList<>();
   for (int i = 0; i < 10; i++) {
       futures.add(executor.submit(() -> compute(i))); // 提交任务
   }
   for (Future<Integer> f : futures) {
       Integer result = f.get(); // 按完成顺序获取结果
   }
   executor.shutdown();
   ```

   **优势**：总耗时 ≈ 最慢子任务的耗时，显著提升效率。

2. **异步 I/O 操作**
   如网络请求或文件读写，主线程提交任务后立即返回，通过 `Future` 后续获取响应：

   ```java
   Future<String> responseFuture = executor.submit(() -> httpClient.fetchData());
   // ... 主线程执行其他逻辑
   String data = responseFuture.get(5, TimeUnit.SECONDS); // 超时控制
   ```

3. **任务取消与超时控制**

   ```java
   Future<?> task = executor.submit(() -> longRunningOperation());
   try {
       task.get(500, TimeUnit.MILLISECONDS); // 超时设置
   } catch (TimeoutException e) {
       task.cancel(true); // 中断正在执行的任务
   }
   ```

------

### 🧩 **四、实现原理与核心类**

#### 1. **状态管理机制**

`FutureTask`（`Future` 的核心实现类）通过 7 种状态管理任务生命周期：

```
private static final int NEW = 0;          // 新建
private static final int COMPLETING = 1;    // 完成中（结果即将设置）
private static final int NORMAL = 2;       // 正常完成
private static final int EXCEPTIONAL = 3;  // 异常结束
private static final int CANCELLED = 4;    // 已取消
private static final int INTERRUPTING = 5; // 中断中
private static final int INTERRUPTED = 6;  // 已中断
```

状态转换通过 **CAS（Compare-And-Swap）** 保证原子性。

#### 2. **核心实现类对比**

| **类名**                | **特点**                                                     | **适用场景**                               |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| **`FutureTask`**        | 同时实现 `Runnable` 和 `Future`，可直接提交给 `Thread` 或线程池执行。 | 需手动管理任务执行与结果获取的简单场景。   |
| **`CompletableFuture`** | Java 8+ 引入，支持链式调用、组合任务、异常回调（非阻塞）。   | 复杂异步流程（如多个任务依赖、结果转换）。 |
| **`ScheduledFuture`**   | 扩展延迟/周期性任务调度能力（需配合 `ScheduledExecutorService`）。 | 定时任务（如心跳检测、周期数据同步）。     |

> 🌰 **`FutureTask` 使用示例**：
>
> ```java
> FutureTask<Integer> futureTask = new FutureTask<>(() -> 42);
> new Thread(futureTask).start(); // 直接启动线程
> // 或提交至线程池：executor.submit(futureTask);
> Integer result = futureTask.get(); // 阻塞获取结果
> ```

------

### ⚠️ **五、注意事项与最佳实践**

1. **线程池关闭**
   务必调用 `executor.shutdown()`，避免线程泄漏。

2. 异常处理

3. 任务内部异常不会自动传播，必须通过 

   ```
   Future.get() 
   ```

   捕获 

   ```
   ExecutionException 
   ```

   并解析：

   ```
   try {
       future.get();
   } catch (ExecutionException e) {
       Throwable realCause = e.getCause(); // 获取原始异常
   }
   ```

4. 避免永久阻塞

   - 始终使用带超时的 `get(long timeout, TimeUnit unit)`。
   - 结合 `isDone()` 轮询检查状态（非实时，需权衡性能）。

5. 资源竞争优化

   - CPU 密集型任务 → 固定大小线程池（`newFixedThreadPool`）。
   - I/O 密集型任务 → 缓存线程池（`newCachedThreadPool`）。

------

### 🔄 **六、演进与替代方案**

#### `Future` 的局限性：

- **阻塞式获取结果**：`get()` 导致线程资源浪费。
- **组合能力弱**：多任务依赖需手动协调（嵌套 `get()` 代码臃肿）。

#### **升级方案：`CompletableFuture`**

支持函数式编程模型，实现非阻塞链式调用：

```java
CompletableFuture.supplyAsync(() -> "Hello")
    .thenApplyAsync(s -> s + " World")    // 异步结果转换
    .exceptionally(e -> "Fallback")       // 异常处理
    .thenAccept(System.out::println);     // 消费结果
```

**优势**：

- **任务组合**：`thenCombine()`、`allOf()` 等协调多任务。
- **回调机制**：完成时自动触发后续操作（无需阻塞等待）。

------

### 💎 **总结**

`Future` 是 Java 并发编程的**基础异步控制单元**，适用于简单异步场景。其核心价值在于：
✅ ​**结果容器**​：封装异步计算结果或异常。
✅ ​**任务控制**​：取消、状态查询与超时管理。
✅ ​**线程池集成**​：与 `ExecutorService` 无缝协作。

**演进方向**：

- 简单任务 → `Future` + 线程池。
- 复杂异步流 → `CompletableFuture` 或响应式框架（如 RxJava）。
  ​**生产建议**​：
  ⚠️ 避免无界队列导致的 OOM（优先自定义 `ThreadPoolExecutor`）。
  ⚠️ 超时设置与异常处理是保障系统健壮性的关键。



## FutureTask

是的，`FutureTask` 确实**实现了 `Runnable` 接口**，并且**内部持有一个 `Callable` 类型的字段**。以下是具体分析：

------

### 🔧 **1. 实现 `Runnable` 接口**

`FutureTask` 实现了 `RunnableFuture` 接口，而 `RunnableFuture` 同时继承了 `Runnable` 和 `Future` 接口。因此：

- ✅ **可作为 `Runnable` 使用**：`FutureTask` 可以直接传递给 `Thread` 构造函数或提交给线程池（`ExecutorService`）执行。
- ✅ **执行逻辑**：其 `run()` 方法会调用内部任务的逻辑（如 `Callable.call()` 或 `Runnable.run()`）并将结果存储到 `outcome` 字段中。

```
// 示例：FutureTask 作为 Runnable 使用
Callable<Integer> task = () -> 123;
FutureTask<Integer> futureTask = new FutureTask<>(task);
Thread thread = new Thread(futureTask);  // 直接传递给 Thread
thread.start();
```

------

### 📦 **2. 内部持有 `Callable` 字段**

`FutureTask` 的核心设计是**统一封装任务**：

- ✅ **`Callable` 字段**：源码中声明了 `private Callable<V> callable` 字段，用于存储传入的任务。

- ✅ 支持两种任务类型：

  - 若通过构造函数传入 `Callable` 对象，则直接赋值给 `callable` 字段。

  - 若传入

    ```
    Runnable
    ```

    对象，会通过

    ```
    Executors.callable()
    ```

    将其适配为

    ```
    Callable
    ```

    类型再存储。

    ```
    // Runnable 适配为 Callable 的源码逻辑
    public FutureTask(Runnable runnable, V result) {
        this.callable = Executors.callable(runnable, result);
    }
    ```

------

### 🔄 **3. 任务执行流程**

当调用 `FutureTask.run()` 时：

1. **执行 `callable.call()`**：运行任务逻辑。
2. **存储结果或异常**：结果存入 `outcome` 字段，状态更新为 `NORMAL`（成功）或 `EXCEPTIONAL`（异常）。
3. **唤醒阻塞线程**：通过 `get()` 等待结果的线程会被唤醒并获取结果。

------

### 💎 **总结**

- ✅ **双重身份**：`FutureTask` 既是 `Runnable`（可被线程执行），又是 `Future`（可管理任务状态和结果）。
- ✅ **统一封装**：通过内部 `Callable` 字段统一处理 `Callable` 和 `Runnable` 任务，确保执行逻辑的一致性。
- ✅ **典型应用场景**：需异步执行且获取结果的任务（如并行计算、IO 操作），或需取消任务执行的场景。

## CompleteStage

CompletionStage 是 Java 8 引入的核心异步编程接口（位于 `java.util.concurrent` 包），用于描述异步计算中的一个**阶段性任务**，支持任务之间的链式组合和结果传递。它通过函数式编程模型解决了传统 `Future` 的阻塞调用和任务编排难题，是 `CompletableFuture` 的底层设计基础。以下从核心特性到实践应用展开详解：

------

### ⚙️ **一、核心定位与设计思想**

1. 阶段化任务抽象
   - 一个异步计算流程可拆分为多个相互依赖的 `CompletionStage` 子任务，形成**任务流水线**。
   - 每个阶段封装一个操作（如 `Function`、`Consumer`），并定义其输入/输出行为。
2. 非阻塞回调机制
   - 通过 `thenApply`、`thenAccept` 等方法注册回调，任务完成后自动触发后续操作，**无需阻塞等待**。
3. 时序关系描述
   - 明确表达任务间的**串行、并行、聚合（AND/OR）** 关系，实现声明式编排。

------

### 🧩 **二、核心任务模型与函数式接口**

`CompletionStage` 子任务的操作类型由函数式接口决定，分为三类：

| **函数式接口**      | **特点**       | **回调方法示例**       | **适用场景**             |
| ------------------- | -------------- | ---------------------- | ------------------------ |
| **`Function<T,R>`** | 有输入、有输出 | `thenApply(fn)`        | 数据转换（如字符串处理） |
| **`Consumer<T>`**   | 有输入、无输出 | `thenAccept(consumer)` | 结果消费（如日志打印）   |
| **`Runnable`**      | 无输入、无输出 | `thenRun(action)`      | 清理资源或发送通知       |

**示例**：

```
stage.thenApply(x -> x * 2)      // 输入整数x，输出2x  
     .thenAccept(System.out::println) // 消费结果并打印  
     .thenRun(() -> cleanUp());     // 无参数清理操作
```

------

### ⛓️ **三、任务编排能力详解**

#### 1. **串行关系（Sequential）**

通过 `then*` 系列方法实现阶段顺序执行：

- **`thenApply()`**：接收上阶段结果，转换后输出新值。
- **`thenCompose()`**：扁平化嵌套任务（如将 `CompletionStage<String>` 转换为 `CompletionStage<Integer>`）。

```
// 查询用户→查询订单（依赖前序结果）
userStage.thenCompose(user -> orderService.getOrders(user.getId()));
```

#### 2. **并行组合（Combination）**

合并多个独立任务的结果：

- **`thenCombine(stage2, fn)`**：合并两个阶段结果（如计算 BMI：体重+身高→指数）。
- **`thenAcceptBoth(stage2, consumer)`**：消费两个结果但无输出。

```
weightStage.thenCombine(heightStage, (w, h) -> w / (h * h));
```

#### 3. **聚合关系（AND/OR）**

控制多个任务的完成触发条件：

| **方法**               | **触发条件**     | **返回类型**                |
| ---------------------- | ---------------- | --------------------------- |
| **`allOf(stages...)`** | 所有任务完成     | `CompletableFuture<Void>`   |
| **`anyOf(stages...)`** | 任意一个任务完成 | `CompletableFuture<Object>` |

```
// 批量下载网页，统计包含关键词的页面数  
CompletableFuture.allOf(urlFutures)  
    .thenApply(v -> urlFutures.stream()  
        .filter(f -> f.join().contains("Java"))  
        .count());
```

#### 4. **异常处理**

支持链式捕获异常，避免中断流水线：

- **`exceptionally(fallbackFn)`**：捕获异常并返回默认值。
- **`handle(biFn)`**：统一处理结果和异常（类似 `try-catch-finally`）。

```
stage.exceptionally(ex -> "Fallback")  
     .handle((res, ex) -> ex != null ? "Error" : res);
```

------

### ⚙️ **四、底层实现机制**

1. 状态驱动
   - 每个 `CompletionStage` 维护任务状态（未完成、完成、异常），通过 **CAS 原子操作**更新。
2. 依赖栈管理
   - 回调方法注册为 **LIFO 栈结构**，任务完成时按注册顺序的**逆序触发回调**（同步模式）。
3. 线程池控制
   - 默认使用 `ForkJoinPool.commonPool()`，可通过 `*Async` 方法后缀（如 `thenApplyAsync`）指定自定义 `Executor`。

------

### 🚀 **五、典型应用场景**

1. 微服务调用链

   异步串行调用鉴权→查询→结果组装，避免线程阻塞：

   ```
   authStage.thenCompose(token -> userService.query(token))  
            .thenApply(user -> buildResponse(user));
   ```

2. **批量并行计算**
   分治任务并行执行（如 MapReduce 模型），通过 `allOf` 聚合结果。

3. 竞速查询优化

   同时请求多个数据源，取首个返回结果（

   ```
   anyOf 
   ```

   \+ 超时控制）：

   ```
   CompletableFuture.anyOf(dbQuery, cacheQuery)  
       .orTimeout(500, TimeUnit.MILLISECONDS);
   ```

4. **流水线数据处理**
   逐阶段转换数据流（如读取→过滤→聚合→存储）。

------

### ⚠️ **六、注意事项**

1. **避免阻塞回调**
   回调中执行阻塞操作（如同步 I/O）会拖慢整个流水线，需改用异步 I/O 或指定专用线程池。
2. **线程池隔离**
   CPU 密集型与 I/O 密集型任务使用独立线程池，防止资源竞争。
3. **异常传播**
   未捕获的运行时异常会导致阶段中断，务必通过 `handle()` 或 `exceptionally()` 处理。

------

### 💎 **总结**

`CompletionStage` 是 Java 异步编程的**范式革新**，核心价值在于：
✅ ​**声明式编排**​：通过链式调用描述任务时序，替代 `Future` 的阻塞轮询。
✅ ​**函数式集成**​：无缝结合 Lambda 表达式，简化回调逻辑。
✅ ​**灵活组合**​：支持 AND/OR 聚合、异常恢复等复杂模式。

**适用场景优先级**：

- 高并发服务编排 → 微服务调用链
- 批处理加速 → 并行计算与聚合
- 响应式系统 → 非阻塞流水线

> **生产建议**：优先使用 `CompletableFuture`（`CompletionStage` 的唯一实现），结合自定义线程池与超时机制，构建健壮异步链路。

## CompletableFuture

CompletableFuture 是 Java 8 引入的异步编程工具，实现了 `Future` 和 `CompletionStage` 接口，提供了比传统 `Future` 更强大的任务编排、链式调用和异常处理能力，极大简化了复杂异步流程的开发。以下从核心特性、工作原理到实践应用展开详解：

------

### 🔧 **一、核心特性与设计定位**

1. **异步结果容器**
   - 表示一个可能未完成的异步计算结果，支持手动设置结果（`complete(T)`）或异常终止（`completeExceptionally(Throwable)`）。
   - 与 `Future` 的阻塞式 `get()` 不同，支持非阻塞回调机制（如 `thenApply`、`thenAccept`）。
2. **任务编排能力**
   - **串行/并行组合**：通过 `thenCompose`（串行依赖）、`thenCombine`（并行合并）、`allOf`/`anyOf`（多任务聚合）等方法构建复杂流水线。
   - **灵活线程控制**：默认使用 `ForkJoinPool.commonPool()`，支持自定义 `Executor` 指定线程池。
3. **异常处理机制**
   - `exceptionally()`：捕获异常并返回默认值。
   - `handle()`：同时处理正常结果和异常，可转换结果类型。

------

### ⚙️ **二、核心 API 详解**

#### **1. 创建异步任务**

| **方法**                   | **功能**                                 |
| -------------------------- | ---------------------------------------- |
| `supplyAsync(Supplier<T>)` | 执行有返回值的异步任务（如数据库查询）。 |
| `runAsync(Runnable)`       | 执行无返回值的异步任务（如日志写入）。   |
| `completedFuture(T)`       | 创建已完成的实例，直接携带结果。         |

**示例**：

```
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello");
```

#### **2. 链式回调方法**

| **方法**                                         | **用途**                                       |
| ------------------------------------------------ | ---------------------------------------------- |
| `thenApply(Function<T,U>)`                       | 转换结果（如字符串拼接）。                     |
| `thenAccept(Consumer<T>)`                        | 消费结果（如打印输出），无返回值。             |
| `thenRun(Runnable)`                              | 任务完成后执行动作，不访问结果。               |
| `thenCompose(Function<T, CompletableFuture<U>>)` | 将当前结果作为输入启动新异步任务（链式依赖）。 |

**示例**：

```
future.thenApply(s -> s + " World")
      .thenAccept(System.out::println); // 输出 "Hello World"
```

#### **3. 多任务组合**

| **方法**                                   | **场景**                               |
| ------------------------------------------ | -------------------------------------- |
| `thenCombine(CompletionStage, BiFunction)` | 合并两个独立任务的结果（如计算 A+B）。 |
| `allOf(CompletableFuture...)`              | 等待所有任务完成（如批量调用 API）。   |
| `anyOf(CompletableFuture...)`              | 任意一个任务完成即触发（如竞速查询）。 |

**示例**：

```
CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> 2);
CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> 3);
future1.thenCombine(future2, (a, b) -> a + b)
       .thenAccept(sum -> System.out.println("Sum: " + sum)); // 输出 5
```

#### **4. 异常处理**

```
CompletableFuture.supplyAsync(() -> {
    if (error) throw new RuntimeException("Error");
    return "Success";
}).exceptionally(ex -> "Fallback")  // 异常时返回默认值
  .handle((res, ex) -> ex != null ? "Recovered" : res); // 统一处理结果和异常
```

------

### ⚡ **三、典型应用场景**

1. **并行计算优化**
   将大任务拆分为子任务并行执行，通过 `allOf` 聚合结果，提升吞吐量：

   ```
   List<CompletableFuture<Integer>> futures = tasks.stream()
       .map(task -> CompletableFuture.supplyAsync(task::compute, executor))
       .toList();
   CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
       .thenApply(v -> futures.stream().map(CompletableFuture::join).sum());
   ```

2. **微服务异步调用链**
   串行调用多个服务（如先鉴权后查询），避免阻塞线程：

   ```
   CompletableFuture<String> authFuture = authService.authAsync(token);
   authFuture.thenCompose(auth -> userService.queryAsync(auth.getUserId()))
             .thenAccept(user -> System.out.println(user.getName()));
   ```

3. **竞速请求与超时控制**
   同时发起多个数据源查询，取首个响应结果：

   ```
   CompletableFuture<Data> source1 = fetchFromSource1();
   CompletableFuture<Data> source2 = fetchFromSource2();
   CompletableFuture.anyOf(source1, source2)
       .orTimeout(500, TimeUnit.MILLISECONDS) // 超时中断
       .thenAccept(data -> System.out.println("First result: " + data));
   ```

------

### ⚠️ **四、注意事项与最佳实践**

1. **线程池选择**
   - **CPU 密集型**：固定大小线程池（`Executors.newFixedThreadPool`）避免过度切换。
   - **I/O 密集型**：缓存线程池（`Executors.newCachedThreadPool`）提高资源利用率。
2. **避免回调地狱**
   链式调用不宜过长，复杂逻辑可拆分为独立方法，或用 `CompletableFuture` 组合器简化。
3. **资源泄漏预防**
   - 自定义线程池需显式关闭（`shutdown()`）。
   - 任务内部捕获异常，防止未处理异常中断线程。
4. **性能监控**
   异步链路较长时，结合 Micrometer 等工具追踪任务耗时和线程池负载。

------

### 💎 **五、与传统 Future 的核心差异**

| **特性**     | **Future**             | **CompletableFuture**                |
| ------------ | ---------------------- | ------------------------------------ |
| **结果获取** | 阻塞式 `get()`         | 非阻塞回调（`thenAccept` 等）        |
| **任务组合** | 需手动协调（嵌套阻塞） | 声明式组合（`thenCombine`/`allOf`）  |
| **异常处理** | 需在 `get()` 中捕获    | 链式处理（`exceptionally`/`handle`） |
| **灵活性**   | 功能基础               | 支持手动完成、超时控制、回调链       |

------

### 🚀 **六、综合应用示例**

```
ExecutorService executor = Executors.newFixedThreadPool(4);

// 异步查询用户信息 + 订单历史
CompletableFuture<User> userFuture = CompletableFuture.supplyAsync(UserService::fetchUser, executor);
CompletableFuture<List<Order>> ordersFuture = userFuture.thenComposeAsync(
    user -> OrderService.fetchOrders(user.getId()), executor
);

// 合并结果并处理异常
CompletableFuture<Void> result = userFuture.thenCombine(ordersFuture, (user, orders) -> {
    return String.format("User: %s, Orders: %d", user.getName(), orders.size());
}).handle((res, ex) -> {
    if (ex != null) return "Error: " + ex.getCause().getMessage();
    return res;
}).thenAcceptAsync(System.out::println, executor);

result.join(); // 等待所有任务完成
executor.shutdown();
```

------

### 💡 **总结**

CompletableFuture 是 Java 异步编程的**核心进化**，通过链式调用和组合操作解决了传统 Future 的阻塞与协作难题。**适用场景**包括：高并发服务编排、批量任务并行化、响应式微服务调用等。**生产建议**：

- 优先使用 `supplyAsync`/`thenApply` 等链式方法替代阻塞调用；
- 自定义线程池控制资源，避免无界队列导致 OOM；
- 复杂链路结合 `allOf`/`anyOf` 和超时机制提升健壮性。

## Executor vs. ExecutorService

在 Java 并发编程中，`Executor` 和 `ExecutorService` 是线程池管理的核心接口，二者虽有关联但职责和功能存在显著差异。以下是它们的核心区别及适用场景分析：

------

### 🔧 **一、接口层级与设计定位**

1. **`Executor`**

   - **基础接口**：仅定义单一方法 `void execute(Runnable command)`，用于提交 `Runnable` 任务。

   - **核心目标**：解耦任务提交与执行策略（如线程创建、调度），但不涉及任务结果或生命周期管理。

   - 示例代码：

     ```
     Executor executor = command -> new Thread(command).start(); // 自定义执行策略
     executor.execute(() -> System.out.println("Task running"));
     ```

2. **`ExecutorService`**

   - **子接口扩展**：继承 `Executor`，新增任务管理、结果获取和线程池生命周期控制方法。
   - **核心目标**：提供完整的异步任务框架，支持任务取消、结果跟踪及优雅关闭。

------

### ⚙️ **二、核心功能对比**

#### **1. 任务提交方式**

| **功能**         | **Executor**        | **ExecutorService**                     |
| ---------------- | ------------------- | --------------------------------------- |
| **任务类型支持** | 仅 `Runnable`       | `Runnable` 和 `Callable`                |
| **提交方法**     | `execute(Runnable)` | `submit(Runnable)` / `submit(Callable)` |
| **返回值**       | 无                  | 返回 `Future` 对象跟踪结果或异常        |

**示例代码**：

```
// ExecutorService 提交 Callable 任务
ExecutorService executorService = Executors.newFixedThreadPool(2);
Future<Integer> future = executorService.submit(() -> 42);
Integer result = future.get(); // 阻塞获取结果
```

#### **2. 生命周期管理**

| **能力**       | **Executor** | **ExecutorService**                  |
| -------------- | ------------ | ------------------------------------ |
| **关闭线程池** | 需手动实现   | 提供 `shutdown()` 和 `shutdownNow()` |
| **状态检查**   | 不支持       | `isShutdown()` / `isTerminated()`    |
| **等待终止**   | 不支持       | `awaitTermination(timeout, unit)`    |

**关闭流程示例**：

```
executorService.shutdown(); // 停止接收新任务
if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
    executorService.shutdownNow(); // 强制终止剩余任务
}
```

#### **3. 批量任务与高级控制**

- **批量提交**：
  `ExecutorService` 支持 `invokeAll()`（等待所有任务完成）和 `invokeAny()`（任一任务完成即返回）。
- **超时控制**：
  可通过 `Future.get(timeout, unit)` 实现结果获取的超时机制。

------

### 🧩 **三、适用场景分析**

| **场景**                  | **推荐接口**      | **原因**                                            |
| ------------------------- | ----------------- | --------------------------------------------------- |
| 简单异步任务（无需结果）  | `Executor`        | 轻量级提交，无需管理线程池生命周期                  |
| 需获取结果的任务          | `ExecutorService` | 通过 `Future` 获取返回值或异常                      |
| 定时/周期性任务           | `ExecutorService` | 需配合 `ScheduledExecutorService`（子接口）实现调度 |
| 高并发服务（如Web服务器） | `ExecutorService` | 要求线程池动态管理、优雅关闭和资源回收              |

------

### ⚠️ **四、生产实践注意事项**

1. 避免无界队列

   ```
   Executors.newFixedThreadPool() 
   ```

   使用无界队列可能导致 

   ```
   OOM
   ```

   ，建议自定义 

   ```
   ThreadPoolExecutor
   ```

   ：

   ```
   new ThreadPoolExecutor(corePoolSize, maxPoolSize, keepAliveTime, unit, new ArrayBlockingQueue<>(capacity));
   ```

2. **异常处理**
   `Executor` 中未捕获的异常会传递至 `UncaughtExceptionHandler`，而 `ExecutorService` 可通过 `Future.get()`捕获 `ExecutionException`。

3. **资源泄漏预防**
   务必调用 `shutdown()` 关闭线程池，否则 JVM 无法退出。

------

### 💎 **五、总结：核心差异全景图**

| **特性**         | **Executor**      | **ExecutorService**           |
| ---------------- | ----------------- | ----------------------------- |
| **接口关系**     | 父接口            | 子接口（扩展功能）            |
| **任务提交**     | 仅支持 `Runnable` | 支持 `Runnable` 和 `Callable` |
| **结果获取**     | 不支持            | 通过 `Future` 跟踪结果        |
| **生命周期管理** | 无内置方法        | 提供关闭、状态检查等方法      |
| **适用复杂度**   | 简单异步场景      | 生产级高并发管理              |

> 💡 **实际建议**：
> 除非极简场景（如单次异步日志），​**优先使用 `ExecutorService`**。其完备的任务管理、结果跟踪和资源控制能力，更符合生产环境需求。对于定时任务，可进一步使用其子接口 `ScheduledExecutorService`。

## Executors

Executors 是 Java 并发编程中用于**简化线程池创建和管理**的核心工具类（位于 `java.util.concurrent` 包）。它通过静态工厂方法提供预配置的线程池，帮助开发者避免手动管理线程的生命周期和资源分配。以下是其核心特性和使用详解：

------

### 🔧 **一、Executors 的核心功能与架构定位**

1. **线程池封装**
   Executors 封装了 `ThreadPoolExecutor` 和 `ScheduledThreadPoolExecutor` 的复杂配置，提供开箱即用的线程池实例。

2. 任务与执行解耦

   基于 Executor 框架的三层模型：

   - **任务**：`Runnable` 或 `Callable` 接口定义工作单元。
   - **执行机制**：通过 `ExecutorService` 管理任务调度和线程资源。
   - **结果处理**：`Future` 或 `FutureTask` 获取异步计算结果。

3. **资源优化**
   复用线程减少创建/销毁开销，提升系统吞吐量（尤其在 I/O 密集型场景）。

------

### 🧩 **二、Executors 提供的线程池类型及特点**

以下是六种常用线程池的对比：

| **工厂方法**                         | **线程池类型**            | **核心机制**                                                 | **适用场景**                       |
| ------------------------------------ | ------------------------- | ------------------------------------------------------------ | ---------------------------------- |
| `newFixedThreadPool(int n)`          | 固定大小线程池            | 核心线程数 = 最大线程数；无界队列（`LinkedBlockingQueue`）   | CPU 密集型任务（如计算、图像处理） |
| `newCachedThreadPool()`              | 可缓存线程池              | 线程数无上限（可回收闲置线程）；同步队列（`SynchronousQueue`） | 短期异步任务（如网络请求）         |
| `newSingleThreadExecutor()`          | 单线程池                  | 仅一个工作线程；无界队列                                     | 需顺序执行的任务（如日志写入）     |
| `newScheduledThreadPool(int n)`      | 定时任务线程池            | 固定核心线程；支持延迟/周期性任务（`DelayedWorkQueue`）      | 心跳检测、定时数据同步             |
| `newSingleThreadScheduledExecutor()` | 单线程定时任务池          | 单线程版 `ScheduledThreadPool`                               | 需顺序执行的定时任务               |
| `newWorkStealingPool(int n)`         | 工作窃取线程池（Java 8+） | 基于 `ForkJoinPool`；并行处理任务；默认使用 CPU 核心数       | 分治任务或并行计算                 |

> ⚠️ **注意**：`FixedThreadPool` 和 `SingleThreadExecutor` 使用**无界队列**，可能导致内存溢出（OOM），生产环境建议自定义 `ThreadPoolExecutor`。

------

### ⚡ **三、适用场景分析**

- **CPU 密集型**（计算逻辑为主）→ `FixedThreadPool`（限制并发线程数）。
- **I/O 密集型**（等待资源为主）→ `CachedThreadPool`（弹性扩缩容）。
- **顺序执行需求** → `SingleThreadExecutor`（避免并发问题）。
- **定时/周期任务** → `ScheduledThreadPool`（替代 `Timer`）。
- **并行分治任务** → `WorkStealingPool`（高效利用多核）。

------

### 💻 **四、基本使用示例**

#### 1. **固定线程池处理并发任务**

```
ExecutorService executor = Executors.newFixedThreadPool(4);
for (int i = 0; i < 10; i++) {
    executor.submit(() -> {
        System.out.println("Task executed by " + Thread.currentThread().getName());
    });
}
executor.shutdown();  // 停止接收新任务
executor.awaitTermination(60, TimeUnit.SECONDS);  // 等待剩余任务完成
```

#### 2. **定时任务调度**

```
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
// 延迟 3 秒执行
scheduler.schedule(() -> System.out.println("Delayed Task"), 3, TimeUnit.SECONDS);
// 周期任务：初始延迟 1 秒，每 2 秒执行一次
scheduler.scheduleAtFixedRate(() -> System.out.println("Periodic Task"), 1, 2, TimeUnit.SECONDS);
```

#### 3. **获取异步结果（Future）**

```
ExecutorService executor = Executors.newCachedThreadPool();
Future<Integer> future = executor.submit(() -> {
    TimeUnit.SECONDS.sleep(1);
    return 42;
});
Integer result = future.get();  // 阻塞直到结果就绪
System.out.println("Result: " + result);  // 输出: 42
```

------

### ⚠️ **五、注意事项与最佳实践**

1. **关闭线程池**
   必须调用 `shutdown()` 或 `shutdownNow()` 避免资源泄漏，推荐结合 `awaitTermination` 等待任务结束。

2. 异常处理

   任务内部需捕获异常，否则线程可能因未处理异常而终止：

   ```
   executor.submit(() -> {
       try { /* 业务代码 */ } 
       catch (Exception e) { e.printStackTrace(); }
   });
   ```

3. **避免无界队列**
   生产环境建议使用 `ThreadPoolExecutor` 自定义队列大小（如 `ArrayBlockingQueue`）。

4. **谨慎使用 `CachedThreadPool`**
   可能因任务激增创建大量线程，导致资源耗尽。

------

### 💎 **总结**

Executors 的核心价值在于**降低并发编程复杂度**，通过预置线程池满足常见场景需求。但需注意：

- ✅ **简单场景**：直接使用 `Executors` 工厂方法快速开发。
- ⚠️ **复杂/生产环境**：改用 `ThreadPoolExecutor` 自定义参数（核心线程数、队列类型、拒绝策略）。
- 🔧 **线程资源管理**：务必关闭线程池并处理任务异常，保障系统稳定性。

## 自定义 ThreadPool

在 Java 中自定义线程池主要通过 `ThreadPoolExecutor` 类实现，相比 `Executors` 提供的预设线程池，自定义方案能规避资源耗尽风险（如无界队列导致内存溢出），并针对业务场景优化性能。以下是详细步骤和关键配置：

------

### 🔧 一、核心参数配置（7大核心参数）

`ThreadPoolExecutor` 的构造函数包含以下参数，需根据业务需求调整：

1. **`corePoolSize`（核心线程数）**

   - 线程池常驻的最小线程数，即使空闲也不会销毁（除非设置 `allowCoreThreadTimeOut=true`）。
   - **建议**：CPU 密集型任务设为 `CPU 核数`（`Runtime.getRuntime().availableProcessors()`），IO 密集型任务参考公式：`线程数 = CPU核数 / (1 - 阻塞系数)`（阻塞系数取 0.8~0.9）。

2. **`maximumPoolSize`（最大线程数）**

   - 线程池允许创建的最大线程数（包含核心线程）。
   - **建议**：IO 密集型任务可设为 `corePoolSize * 2`，避免突发流量导致任务堆积。

3. **`keepAliveTime` + `unit`（线程空闲超时）**

   - 非核心线程空闲超过此时间会被回收。
   - **建议**：设为 30~60 秒（如 `TimeUnit.SECONDS`），平衡资源复用与释放。

4. **`workQueue`（任务队列）**

   - 存储待执行任务的阻塞队列，**必须使用有界队列**（如 `LinkedBlockingQueue(capacity)`）防止 OOM。
   - 队列类型选择：
     - `ArrayBlockingQueue`：固定容量，公平锁。
     - `LinkedBlockingQueue`：默认无界，需显式指定容量（如 `new LinkedBlockingQueue<>(100)`）。
     - `SynchronousQueue`：直接移交任务，配合 `maximumPoolSize` 使用（适合短任务）。

5. **`threadFactory`（线程工厂）**

   - 自定义线程名称、优先级、守护状态等，便于监控和排查问题：

     ```java
     public class NamedThreadFactory implements ThreadFactory {
         private final AtomicInteger counter = new AtomicInteger(1);
         private final String prefix;
     
         public NamedThreadFactory(String prefix) { this.prefix = prefix; }
     
         @Override
         public Thread newThread(Runnable r) {
             Thread t = new Thread(r, prefix + "-" + counter.getAndIncrement());
             t.setDaemon(false); // 非守护线程
             t.setPriority(Thread.NORM_PRIORITY);
             return t;
         }
     }
     ```

6. **`handler`（拒绝策略）**

   - 当任务队列满且线程数达上限时触发，内置策略有：

     - `AbortPolicy`（默认）：抛出 `RejectedExecutionException`。
     - `CallerRunsPolicy`：由提交任务的线程直接执行。
     - `DiscardPolicy`：静默丢弃任务。
     - `DiscardOldestPolicy`：丢弃队列最旧的任务，重试提交。

   - 自定义策略（如记录日志或降级处理）：

     ```java
     public class LogRejectedHandler implements RejectedExecutionHandler {
         @Override
         public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
             System.err.println("Task rejected: " + r.toString());
             // 可选：重试或持久化任务
         }
     }
     ```

------

### ⚙️ 二、完整配置示例

```java
import java.util.concurrent.*;

public class CustomThreadPool {
    public static ThreadPoolExecutor createPool() {
        int corePoolSize = Runtime.getRuntime().availableProcessors(); // CPU核数
        int maxPoolSize = corePoolSize * 2;
        BlockingQueue<Runnable> queue = new LinkedBlockingQueue<>(100); // 有界队列
        ThreadFactory factory = new NamedThreadFactory("business-pool");
        RejectedExecutionHandler handler = new ThreadPoolExecutor.CallerRunsPolicy();

        return new ThreadPoolExecutor(
            corePoolSize, 
            maxPoolSize,
            60, TimeUnit.SECONDS, 
            queue, 
            factory, 
            handler
        );
    }

    // 使用示例
    public static void main(String[] args) {
        ThreadPoolExecutor executor = createPool();
        executor.submit(() -> System.out.println("Task executed by: " + Thread.currentThread().getName()));
        executor.shutdown(); // 程序结束前关闭线程池
    }
}
```

------

### 🛠️ 三、高级优化技巧

1. **动态参数调整**
   通过 `setCorePoolSize()` 和 `setMaximumPoolSize()` 运行时调整线程数，适应流量波动。

2. **监控线程池状态**
   定期采集指标（如任务数、活跃线程数、队列大小）：

   ```
   executor.getTaskCount();     // 总任务数
   executor.getCompletedTaskCount(); // 已完成任务数
   executor.getQueue().size(); // 队列积压量
   ```

3. **优雅关闭**
   确保任务执行完毕再退出程序：

   ```
   executor.shutdown(); // 停止接收新任务
   if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
       executor.shutdownNow(); // 强制终止剩余任务
   }
   ```

------

### ⚠️ 四、生产环境建议

- **避免使用无界队列**：防止任务堆积导致 OOM。
- **线程命名规范**：通过自定义 `ThreadFactory` 明确线程用途（如 `order-thread-1`），简化日志排查。
- 拒绝策略选择：
  - 核心业务用 `CallerRunsPolicy` 保证可用性。
  - 非关键任务用 `DiscardPolicy` 减轻负载。
- **资源隔离**：不同业务线使用独立线程池，避免互相影响。

------

> 通过自定义 `ThreadPoolExecutor`，开发者可精准控制线程资源，在**高并发**、**异步任务调度**及**资源敏感型应用**中实现性能与稳定性的平衡。相比 `Executors` 的预设方案，自定义线程池是生产环境的必选项。
