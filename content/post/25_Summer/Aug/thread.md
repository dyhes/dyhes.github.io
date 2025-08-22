---
title: 【Shopee】Thread
date: 2025-08-20 00:00:00+0000
categories: [snow]
tags: [Shopee]
---

## ConcurrentHashMap

根据你的代码和问题分析，`ConcurrentHashMap`本身是线程安全的，但它**仅能保证自身操作的原子性（如 `put`、`get`等）**，而 **`ConcurrentHashMap`中存储的 `List<BaseEdge>`对象本身并不自动具备线程安全性**。这意味着如果多个线程同时修改同一个 `List`实例，仍会导致数据不一致或并发问题。以下是具体分析和解决方案：

------

### 1. **`ConcurrentHashMap`的线程安全性范围**

- **`ConcurrentHashMap`的线程安全机制**：

  通过 **分段锁（JDK7）或 CAS + `synchronized`节点锁（JDK8+）** 保证其内部结构（如桶数组、链表/红黑树）的线程安全，确保多个线程可以并发读写不同的键值对。

- **存储内容的线程安全不受保护**：

  `ConcurrentHashMap`**仅管理键值对的存储位置**，不保证其值对象（如 `List<BaseEdge>`）的内部操作是线程安全的。若多个线程同时修改同一个 `List`，仍需要额外的同步措施。

------

### 2. **`List<BaseEdge>`的线程风险场景**

假设以下操作可能发生：

```
// 线程A：向某个Class对应的List中添加边
List<BaseEdge> edges = buffer.get(EdgeType.class);
edges.add(new BaseEdge()); // 非原子操作，线程不安全！

// 线程B：同时修改同一个List
buffer.get(EdgeType.class).remove(0);
```

此时，即使通过 `buffer.get()`获取 `List`的操作是线程安全的，但后续对 `List`的 `add`、`remove`等操作**未加锁**，可能导致：

- **数据丢失**（如并发添加时覆盖）
- **状态不一致**（如遍历时结构被修改）
- **`ConcurrentModificationException`**（并发修改触发快速失败）

------

### 3. **解决方案：确保 `List`的线程安全**

#### 方案1：使用线程安全的 `List`实现

- **`CopyOnWriteArrayList`**

  适用于**读多写少**的场景。每次修改时复制整个数组，保证遍历的一致性，但写操作开销较大。

  ```
  buffer.computeIfAbsent(EdgeType.class, k -> new CopyOnWriteArrayList<>())
        .add(new BaseEdge()); // 线程安全
  ```

- **`Collections.synchronizedList()`**

  通过 `synchronized`包装普通 `List`，适合**写操作频繁**但需全局锁的场景。

  ```
  List<BaseEdge> syncList = Collections.synchronizedList(new ArrayList<>());
  buffer.put(EdgeType.class, syncList);
  // 使用时需手动加锁（如遍历时）
  synchronized (syncList) {
      for (BaseEdge edge : syncList) { ... }
  }
  ```

#### 方案2：通过 `ConcurrentHashMap`的原子方法管理 `List`

利用 `ConcurrentHashMap`的原子方法（如 `computeIfAbsent`、`compute`）确保对 `List`的**单次操作**线程安全：

```
buffer.computeIfAbsent(EdgeType.class, k -> new ArrayList<>())
      .add(new BaseEdge()); // 注意：add操作仍不安全！
```

⚠️ 此方法**仅保证获取或创建 `List`的原子性**，后续对 `List`的修改仍需额外同步（如结合 `synchronized`块）。

------

### 4. **最佳实践总结**

| **方案**                       | **适用场景**       | **优点**                 | **缺点**                 |
| ------------------------------ | ------------------ | ------------------------ | ------------------------ |
| `CopyOnWriteArrayList`         | 读多写少（如缓存） | 读操作无锁，安全简单     | 写操作性能低，内存占用高 |
| `Collections.synchronizedList` | 写操作频繁         | 兼容所有 `List`实现      | 需手动加锁，粒度较粗     |
| 原子方法 + `synchronized`      | 需要精细控制       | 灵活性高，可定制同步逻辑 | 代码复杂度高，易出错     |

**推荐选择**：

- 若 `List`**修改不频繁**（如配置加载后只读），优先用 `CopyOnWriteArrayList`。
- 若需**高频修改**，且需兼容旧代码，使用 `Collections.synchronizedList()`并严格同步写操作。
- **避免直接暴露 `List`给外部代码**，封装修改方法（如通过接口限制并发访问）。

------

### 关键结论

> ✅ `ConcurrentHashMap`的线程安全**不覆盖其值对象**。
>
> ✅ 存储的 `List<BaseEdge>`需单独实现线程安全（如 `CopyOnWriteArrayList`或同步包装）。
>
> ✅ 设计时需根据读写比例选择合适方案，并严格测试并发场景。

## 并发列表或队列

在Java多线程环境中，线程安全的列表（List）和队列（Queue）是确保数据一致性和避免并发问题的关键。以下是常见实现及其特点，结合适用场景进行说明：

------

### **一、线程安全列表（List）**

1. **`Vector`**

   - **原理**：所有方法使用`synchronized`修饰，整体加锁。

   - **缺点**：性能差（锁粒度粗），已过时，仅用于兼容旧代码。

   - **示例**：

     ```
     List<String> vector = new Vector<>();
     vector.add("item");
     ```

2. **`Collections.synchronizedList()`**

   - **原理**：通过同步块包装任意`List`，所有操作加锁（锁对象为包装后的List）。

   - **适用场景**：读写操作频率均衡的简单场景。

   - **注意**：迭代时需手动加锁，否则可能抛出`ConcurrentModificationException`。

   - **示例**：

     ```
     List<String> syncList = Collections.synchronizedList(new ArrayList<>());
     synchronized (syncList) {  // 迭代时手动同步
         for (String s : syncList) { ... }
     }
     ```

3. **`CopyOnWriteArrayList`**

   - **原理**：写时复制（写操作复制新数组，替换引用），读操作无锁。

   - **优点**：读性能极高，适合**读多写少**（如配置、缓存）。

   - **缺点**：写操作成本高（复制数组），数据实时性弱（读操作访问旧快照）。

   - **示例**：

     ```
     List<String> cowList = new CopyOnWriteArrayList<>();
     cowList.add("item");  // 写操作加锁复制
     String item = cowList.get(0);  // 读操作无锁
     ```

------

### **二、线程安全队列（Queue）**

#### **非阻塞队列**

1. **`ConcurrentLinkedQueue`**

   - **原理**：基于CAS（无锁算法）的链表队列，支持高并发读写。

   - **特点**：无界、FIFO，适用于高吞吐场景（如任务分发）。

   - **示例**：

     ```
     Queue<Integer> queue = new ConcurrentLinkedQueue<>();
     queue.offer(1);  // 无阻塞
     ```

#### **阻塞队列（实现`BlockingQueue`接口）**

1. **`LinkedBlockingQueue`**

   - **原理**：基于链表的可选有界队列，生产者和消费者使用分离锁。

   - **特点**：默认无界（`Integer.MAX_VALUE`），可指定容量。`put()`和`take()`在队列满/空时阻塞。

   - **适用场景**：生产者-消费者模型（如线程池任务队列）。

   - **示例**：

     ```
     BlockingQueue<String> bq = new LinkedBlockingQueue<>(100);
     bq.put("task");  // 队列满时阻塞
     String task = bq.take();  // 队列空时阻塞
     ```

2. **`ArrayBlockingQueue`**

   - **原理**：基于数组的有界队列，全局一把锁。
   - **特点**：固定容量，支持公平锁策略（减少线程饥饿）。

3. **`PriorityBlockingQueue`**

   - **原理**：基于堆的无界优先级队列，元素需实现`Comparable`。
   - **适用场景**：按优先级处理任务（如紧急任务优先）。

4. **`SynchronousQueue`**

   - **原理**：无内部容量，插入操作必须等待移除操作。
   - **特点**：直接传递任务，适用于低延迟线程协作（如`Executors.newCachedThreadPool()`）。

------

### **三、选择建议**

| **类型**       | **实现类**                     | **适用场景**             | **性能特点**         |
| -------------- | ------------------------------ | ------------------------ | -------------------- |
| **列表**       | `CopyOnWriteArrayList`         | 读多写少（如配置、缓存） | 读无锁，写复制数组   |
|                | `Collections.synchronizedList` | 读写均衡                 | 全操作加锁           |
| **非阻塞队列** | `ConcurrentLinkedQueue`        | 高并发读写，无需阻塞     | CAS无锁              |
| **阻塞队列**   | `LinkedBlockingQueue`          | 生产者-消费者模型        | 分离锁，吞吐量高     |
|                | `ArrayBlockingQueue`           | 固定容量任务队列         | 全局锁，可配置公平性 |
|                | `PriorityBlockingQueue`        | 按优先级处理任务         | 无界，堆排序         |
|                | `SynchronousQueue`             | 线程间直接传递任务       | 无缓冲，配对操作     |

------

### **四、注意事项**

1. **复合操作原子性**：

   - 即使使用线程安全集合，复合操作（如“检查-更新”）仍需额外同步：

     ```
     synchronized (list) {
         if (!list.contains(x)) list.add(x);
     }
     ```

2. **迭代器安全**：

   - `synchronizedList`迭代时需手动同步；`CopyOnWriteArrayList`迭代器为快照，不支持修改。

3. **队列阻塞控制**：

   - 阻塞队列的`put()`/`take()`会永久阻塞，可使用`offer(e, timeout)`/`poll(timeout)`设置超时。

通过合理选择线程安全集合，可显著提升多线程程序的性能和可靠性。实际开发中需根据读写频率、数据实时性要求及容量需求综合权衡。

## 数据库批量插入

在“写多读少”且需要线程安全的数据库批量插入场景中，**`ConcurrentLinkedQueue`并非最合适的选择**。虽然它是线程安全的无锁队列，但其设计更侧重于高并发读写均衡或读多写少的场景，而非纯写入密集型任务。以下是详细分析和替代建议：

------

### ⚠️ **ConcurrentLinkedQueue 的局限性**

1. **写多读少的性能瓶颈**

   - **内存占用高**：

     每个写入操作需创建 `Node`对象（含数据和指针），大量写入时可能触发频繁 GC，影响吞吐量 。

   - **CAS 竞争开销**：

     写操作依赖 CAS 更新尾节点。若写入线程过多，CAS 失败重试概率增加，导致 CPU 空转，反而降低性能 。

2. **批量插入的适配性问题**

   - **无阻塞机制**：

     `ConcurrentLinkedQueue`不支持阻塞式批量消费。消费者需主动轮询（`poll`），在队列空时造成 CPU 浪费 。

   - **弱一致性干扰**：

     `size()`和 `isEmpty()`结果不准确，难以精确触发批量插入（例如每积累 100 条数据写入一次）。

3. **与数据库批量写入的协同效率低**

   - **读操作成本**：

     批量插入需遍历队列取出多条数据（如循环 `poll`），而 `ConcurrentLinkedQueue`的遍历效率较低（需处理并发修改的弱一致性）。

   - **缺乏事务整合**：

     无法直接关联队列消费与数据库事务，需额外封装事务边界，增加复杂度 。

------

### ✅ **更优替代方案**

#### 1. **`LinkedBlockingQueue`+ 批量消费者线程**

- **设计原理**：

  - **有界队列**：限制内存占用，避免 OOM（如设置容量 10,000）。
  - **阻塞式消费**：消费者线程调用 `take()`在队列空时自动挂起，减少 CPU 空转 。

- **批量插入实现**：

  ```
  // 消费者线程示例
  while (true) {
      List<Data> buffer = new ArrayList<>(BATCH_SIZE);
      // 阻塞直到获取第一条数据
      Data first = queue.take();
      buffer.add(first);
      // 非阻塞获取剩余数据
      queue.drainTo(buffer, BATCH_SIZE - 1);
      database.batchInsert(buffer); // 批量插入
  }
  ```

  **优势**：

  - 通过 `drainTo`批量转移数据，减少锁竞争 。
  - 结合事务提升插入效率（单事务插入多条）。

#### 2. **手动队列 + 锁同步**

- **适用场景**：

  需极致优化写入性能（如每秒数万条）。

- **实现方式**：

  ```
  // 自定义环形缓冲区（Ring Buffer）
  public class BatchBuffer {
      private final Data[] buffer;
      private int count = 0;
      private final ReentrantLock lock = new ReentrantLock();
  
      public void add(Data data) {
          lock.lock();
          try {
              buffer[count++] = data;
              if (count == BATCH_SIZE) {
                  database.batchInsert(Arrays.copyOf(buffer, count));
                  count = 0;
              }
          } finally {
              lock.unlock();
          }
      }
  }
  ```

  **优势**：

  - 零内存分配（复用数组），避免 GC 压力 。
  - 锁粒度可控，减少竞争（如分段锁优化）。

------

### ⚖️ **方案对比**

| **特性**         | `ConcurrentLinkedQueue`   | `LinkedBlockingQueue`+ 批量消费 | 手动队列 + 锁        |
| ---------------- | ------------------------- | ------------------------------- | -------------------- |
| **写入性能**     | 高（无锁）但 CAS 可能竞争 | 中等（锁优化后）                | 高（锁粒度可控）     |
| **内存控制**     | 无界，易 OOM              | 有界，可控                      | 固定大小，无动态分配 |
| **批量消费支持** | ❌ 需手动轮询              | ✅ `drainTo`高效转移             | ✅ 内置触发机制       |
| **CPU 利用率**   | 高（写竞争时 CPU 空转）   | 低（阻塞式等待）                | 中等（锁竞争可控）   |
| **适用场景**     | 读写均衡的高并发任务      | 写多读少的批量插入              | 超高频写入的定制场景 |

------

### 💎 **结论与建议**

1. **避免使用 `ConcurrentLinkedQueue`**：

   在**写多读少**的数据库批量插入中，其无界特性、内存开销和弱一致性会拖累性能，且无法直接支持高效批量消费。

2. **首选 `LinkedBlockingQueue`**：

   - 通过 **有界容量** 防止内存溢出；
   - 结合 **`drainTo`** 实现零拷贝批量转移；
   - 消费者线程 **阻塞等待** 节省 CPU 。

3. **超高性能场景考虑手动实现**：

   若吞吐量要求极高（如百万级/秒），可基于环形缓冲区和分段锁定制队列，最大化写入效率 。

> **附加优化建议**：
>
> - 在消费者线程中启用数据库事务批量提交（如每 1000 条一提交）；
> - 调整 SQLite WAL 模式或连接池参数，降低写入延迟 。

