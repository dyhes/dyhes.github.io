---
title: 【Java】Object 类方法
date: 2025-06-18 00:00:00+0000
categories: 
- temple
tags:
- Java
---

## finalize() `@deprecated`

`finalize()` 是 Java `Object` 类中的一个受保护方法，用于在对象被垃圾回收（GC）前执行清理操作。尽管其设计初衷是管理资源，但因诸多缺陷，自 **Java 9 起**已被标记为弃用（`@Deprecated`）。以下是其核心机制和注意事项的详细说明：

------

### 🔍 **作用与设计初衷**

1. **资源清理**
   用于释放对象持有的**非内存资源**​（如文件句柄、数据库连接、网络端口等）。例如：

   ```
   protected void finalize() throws Throwable {
       if (fileInputStream != null) {
           fileInputStream.close(); // 确保文件流关闭
       }
   }
   ```

2. **本地资源释放**
   适用于通过 JNI（Java Native Interface）创建的本地对象（如 C/C++ 分配的内存），需在 `finalize()` 中调用原生方法释放（如 `free()`）。

3. **对象复活机制**
   在 `finalize()` 中，可将当前对象重新赋值给一个可达引用（如静态变量），使对象“复活”，避免被 GC 回收。但此机制只能生效一次（后续回收时不再调用 `finalize()`）。

   ```
   protected void finalize() {
       SAVE_HOOK = this; // 对象复活
   }
   ```

------

### ⚙️ **执行原理与生命周期**

当对象不再被引用时，GC 会按以下流程处理：

1. **不可达判定**
   垃圾回收器发现对象从 ​**GC Roots**​ 不可达（即无任何活动线程能访问该对象）。

2. 终结状态检查

   - **未覆盖 `finalize()`**：直接回收内存。
   - **覆盖 `finalize()` 且未执行过**：对象被标记为 `finalizable`，加入 `F-Queue` 队列。

3. **异步执行**
   由 JVM 的低优先级后台线程执行队列中的 `finalize()` 方法（**不保证及时性**）。

4. 二次判定

   执行后再次检查对象可达性：

   - **不可达**：回收内存。
   - **可达**（因“复活”）：对象状态变为 `finalized`，存活至下次不可达时被回收（不再调用 `finalize()`）。

> 📊 **对象状态变迁图**
>
> ```
> graph LR
> A[新建：reachable, unfinalized] -->|失去引用| B[f-reachable/unreachable]
> B -->|GC检测| C[finalizable]
> C -->|入队| D[F-Queue]
> D -->|执行 finalize()| E[可达：finalized]
> E -->|再次不可达| F[回收]
> C -->|无 finalize()| F
> ```

------

### ⚠️ **缺陷与弃用原因**

1. **执行时机不确定**
   - GC 触发时间未知，可能导致资源长期未释放（如文件句柄耗尽）。
   - 程序退出时，未执行的 `finalize()` 会被丢弃。
2. **性能开销**
   - 对象需至少两轮 GC 才能回收（先入队，后回收），延长存活时间。
   - 低优先级线程执行清理可能阻塞 GC，增加停顿时间。
3. **安全风险**
   - 若 `finalize()` 抛出未捕获异常，JVM 会忽略并终止清理，导致资源泄漏。
   - 恶意代码可能通过覆盖 `finalize()` 执行非法操作。
4. **对象复活隐患**
   错误使用复活机制会导致对象生命周期混乱，增加内存泄漏风险。

> ⚠️ **禁用方法**
> `System.runFinalizersOnExit()` 等强制终结方法已被废弃（因死锁和状态不一致问题）。

------

### 🔧 **替代方案**

1. **`try-with-resources` 语句**
   Java 7+ 推荐方式，对实现 `AutoCloseable` 接口的资源自动调用 `close()`：

   ```
   try (FileInputStream fis = new FileInputStream("file.txt")) {
       // 使用资源
   } // 自动关闭，无需 finalize()
   ```

2. **`java.lang.ref.Cleaner`**
   Java 9+ 引入，通过幻象引用（PhantomReference）注册回调，避免对象生命周期被延长：

   ```
   Cleaner cleaner = Cleaner.create();
   cleaner.register(obj, () -> cleanResource()); // 回调清理函数
   ```

3. **显式释放方法**
   提供 `close()` 或 `dispose()` 方法，要求调用者手动释放资源（如 `Socket.close()`）。

------

### 💎 **总结**

| **特性**       | `finalize()`                 | **替代方案**                   |
| -------------- | ---------------------------- | ------------------------------ |
| 调用时机       | 不确定，依赖 GC              | 确定（`try` 块结束或手动调用） |
| 性能影响       | 高（延迟回收，增加 GC 负担） | 低（直接释放）                 |
| 资源释放可靠性 | 低（可能永不执行）           | 高（强制释放）                 |
| 适用场景       | 本地资源（JNI）              | 所有非内存资源                 |

**结论**：
​**避免使用 `finalize()`**，优先采用 `try-with-resources` 或 `Cleaner` 管理资源。仅在需释放 JNI 本地内存等极端场景下考虑其作为补充（但需严格测试）。现代 Java 开发中，其设计已被更可靠机制取代。

### 线程间通信

Object 类中的 `wait()`、`notify()`、`notifyAll()` 以及 Thread 类的 `sleep()` 是 Java 多线程编程的核心方法，用于线程同步与协作。以下是详细解析：

------

### ⚙️ **核心方法功能与区别**

#### **`wait()` 方法**

- **作用**：使当前线程释放对象锁并进入等待状态，直到其他线程调用同一对象的 `notify()`/`notifyAll()` 或超时。

- **调用条件**：必须在 `synchronized` 同步块或方法内调用，否则抛出 `IllegalMonitorStateException`。

- 重载形式

  ：

  - `wait()`：无限期等待；
  - `wait(long timeout)`：等待指定毫秒；
  - `wait(long timeout, int nanos)`：精确到纳秒的超时控制。

#### **`notify()` 方法**

- **作用**：随机唤醒**一个**在该对象上等待的线程（由 JVM 调度选择），被唤醒线程需重新竞争锁。
- **调用条件**：同样需在 `synchronized` 块内调用。

#### **`notifyAll()` 方法**

- **作用**：唤醒**所有**在该对象上等待的线程，线程需竞争锁后才能继续执行。
- **适用场景**：需唤醒全部等待线程时（如资源池释放）。

#### **`sleep()` 方法（Thread 类静态方法）**

- **作用**：暂停当前线程执行指定时间，**不释放锁**，时间结束后线程进入就绪状态。
- **调用位置**：可在任何代码中调用，无需同步块。
- **异常**：需捕获 `InterruptedException`（中断时会抛出）。

------

### ⚖️ **关键对比：`wait()` vs `sleep()`**

| **特性**     | **`wait()`**                        | **`sleep()`**                 |
| ------------ | ----------------------------------- | ----------------------------- |
| **所属类**   | `Object`                            | `Thread`                      |
| **锁释放**   | 释放对象锁                          | 不释放锁                      |
| **调用位置** | 必须在 `synchronized` 块内          | 任意位置                      |
| **唤醒机制** | 需显式调用 `notify()`/`notifyAll()` | 超时自动唤醒                  |
| **异常处理** | 需处理 `InterruptedException`       | 需处理 `InterruptedException` |
| **用途**     | 线程间协作（如条件等待）            | 单纯延迟执行                  |

> 示例：
>
> ```
> // wait() 示例
> synchronized (obj) {
>     while (!condition) {
>         obj.wait(); // 释放锁并等待
>     }
> }
> 
> // sleep() 示例
> Thread.sleep(1000); // 线程暂停1秒，不释放锁
> ```

------

### 🔄 **典型应用场景**

#### **生产者-消费者模型**

- 机制：

  - 缓冲区满时，生产者调用 `wait()` 等待；
  - 消费者消费后调用 `notify()` 唤醒生产者。

- 代码片段：

  ```java
  class Buffer {
      synchronized void produce() {
          while (full) wait(); // 等待缓冲区非满
          // 生产数据
          notifyAll(); // 唤醒所有等待线程
      }
      synchronized void consume() {
          while (empty) wait(); // 等待缓冲区非空
          // 消费数据
          notifyAll(); 
      }
  }
  ```

#### **多线程条件等待**

- 场景：线程 A 需等待线程 B 完成某任务后再执行。

  ```java
  synchronized (taskLock) {
      while (!taskCompleted) {
          taskLock.wait(); // A 线程等待
      }
      // 任务完成后继续执行
  }
  ```

  线程 B 完成后调用

  ```
  taskLock.notify()
  ```

   唤醒 A。

------

### ⚠️ **注意事项与最佳实践**

1. **避免虚假唤醒**：
   - 使用 `while` 而非 `if` 检查条件，防止未满足条件时被意外唤醒。
   - 示例：`while (!condition) wait();`
2. **锁竞争与性能**：
   - `notifyAll()` 会唤醒所有等待线程，可能导致锁竞争激烈，优先使用 `notify()` 除非必要。
3. **中断处理**：
   - `wait()` 和 `sleep()` 均可被 `interrupt()` 中断，需妥善处理 `InterruptedException`（如恢复中断状态）。
4. **超时控制**：
   - 优先使用 `wait(long timeout)` 避免永久等待，防止线程阻塞。
5. **与 `synchronized` 的强依赖**：
   - `wait()`/`notify()` 必须与 `synchronized` 配合，确保线程在持有锁时操作对象监视器。

------

### 💎 **总结**

- **`wait()`/`notify()`/`notifyAll()`**：用于线程间**协作与同步**，需在同步块中调用，依赖锁机制释放与获取。
- **`sleep()`**：用于**延迟执行**，不涉及锁释放，可独立使用。
- 核心原则：
  - 通过 `wait()` 让线程**条件性等待**，通过 `notify()` **精准唤醒**或 `notifyAll()` **全局唤醒**；
  - `sleep()` 仅用于**时间控制**，不参与线程协调。

> 深入理解这些方法的差异与适用场景，是构建高效、安全多线程应用的基础。生产环境中建议结合 `java.util.concurrent` 包的并发工具（如 `Lock`、`Condition`）替代原生方法，以提升可控性。
