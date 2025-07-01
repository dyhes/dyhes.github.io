---
title: 【BE】Preparation
date: 2025-06-17 00:00:00+0000
categories: 
- arts
- willow
---

# Preparation

## Java Basics
### 静态方法
**间接调用的方式：**若在静态方法中创建实例或传入实例参数，则可通过实例访问非静态成员：
```java
class Example {
    int nonStaticVar = 10;

    static void staticMethod() {
        Example obj = new Example(); // 创建实例
        System.out.println(obj.nonStaticVar); // 合法
    }
}
```

### String & StringBuffer & StringBuilder
| **特性** | **String** | **StringBuffer** | **StringBuilder** |
|---|---|---|---|
| **可变性** | **不可变**（Immutable） | **可变**（Mutable） | **可变**（Mutable） |
| **线程安全** | 线程安全（天然不可变） | 线程安全（方法用synchronized修饰） | **非线程安全** |
| **性能** | 低（频繁修改产生大量对象） | 中（同步开销） | **高**（无同步开销） |
| **使用场景** | 常量字符串、少量拼接 | 多线程环境下的字符串操作 | 单线程环境下的字符串操作 |
| **内存效率** | 低（频繁操作时） | 较高 | 最高 |

### == & equals()
| **特性** | **==** | **equals()** |
|---|---|---|
| **比较内容** | 基本类型比较**值**，引用类型比较**内存地址** | 默认比较**内存地址**，但可重写为**对象内容比较** |
| **操作符/方法** | 操作符 | Object类方法 |
| **默认行为** | 不可修改 | Object类默认用==，需重写实现逻辑相等 |
| **适用场景** | 基本类型值比较、判断引用是否指向同一对象 | 对象内容逻辑相等比较 |

### equals() & hashCode()
根据 Java 官方规范，若两个对象通过equals()方法判定为相等，则它们的hashCode()**必须返回相同的值**。反之则不一定成立（哈希值相同的对象不一定equals为true）。
> 违反对象契约：两个相等的对象被存入HashSet，会被误判为不同对象，导致重复存储。
```java
public class Person {
    private String name;
    private int age;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age && Objects.equals(name, person.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age); // 基于 name 和 age 生成哈希码
    }
}
```

### 包装类
自动装箱是基本数据类型自动转换为对应的包装类对象（如int→Integer），自动拆箱则是包装类对象转为基本类型（如Integer→int）。该机制由编译器在编译阶段实现，简化代码书写，例如集合存储基本类型时会自动装箱。需注意频繁拆装箱可能影响性能，且拆箱时若对象为null会抛出空指针异常。
```java
// 低效写法（每次循环都装箱）
Long sum = 0L;
for (int i = 0; i < 10000; i++) {
    sum += i; // sum自动拆箱为long，计算后自动装箱为Long
}
```

### 重载与重写
  重载（Overload）是在同一类中方法名相同但参数列表不同（类型、数量、顺序），与返回类型和访问修饰符无关，属于**编译时多态**。重写（Override）是子类覆盖父类方法，要求方法名、参数、返回类型相同，访问权限不能更严格且异常范围不能扩大，属于**运行时多态**。

### 范型
Java泛型是一种类型参数化机制，允许在类、接口和方法中定义类型占位符（如<T>）。它通过**编译时类型检查**确保数据安全，避免了运行时的强制类型转换和ClassCastException。泛型提高了代码重用性，支持集合框架的类型安全操作，并通过类型擦除机制实现向后兼容。
| **通配符类型** | **说明** | **示例** |
|---|---|---|
| <?> | 未知类型（任意类型） | List<?> list = new ArrayList<>(); |
| <? extends T> | 上界通配符（接受T及其子类） | List<? extends Number> numbers; |
| <? super T> | 下界通配符（接受T及其父类） | List<? super Integer> integers; |
> 类型擦除（Type Erasure）是 Java 泛型的核心实现机制，指在**编译阶段移除泛型类型信息**，将其替换为原始类型（如 Object 或其上界类型），以确保与旧版本 Java 代码的兼容性。
> **类型擦除（Type Erasure）在 Java 中是自动完成的**，由 Java 编译器在编译阶段自动执行，开发者无需手动干预。
>
> <?>：禁止写入操作


### 反射
Java反射（Reflection）是Java语言提供的一种**动态机制**，允许程序在运行时获取类的信息、操作类的属性和方法，甚至调用私有成员。这种能力使得Java代码可以突破编译时的限制，实现高度灵活的动态编程。
### 线程安全集合
| **集合类型** | **线程安全实现** | **典型非线程安全集合** |
|---|---|---|
| Map | ConcurrentHashMap | HashMap |
| List | CopyOnWriteArrayList | ArrayList |
| Queue | BlockingQueue实现类 | LinkedList |
| Set | ConcurrentSkipListSet | HashSet |

传统方式：Collections.synchronizedXXX()，通过工具类包装非线程安全集合。
```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());
```
缺点：使用全局锁，性能较差。
### HashMap 底层原理
HashMap 的底层是一个 **哈希表（Hash Table）**，本质是一个动态扩容的数组（称为table），数组的每个元素是一个 **链表**（或 **红黑树**，JDK8 及以后），用于存储哈希冲突的键值对。
| **特性** | **JDK7 实现** | **JDK8 实现** |
|---|---|---|
| 底层结构 | 数组 + 链表（Entry 节点） | 数组 + 链表/红黑树（Node/TreeNode 节点） |
| 冲突解决 | 链表（长度无限制，查找 O(n)） | 链表长度 ≥8 且数组长度 ≥64 时转为红黑树（查找 O(logn)） |
| 插入方式 | 头插法（新节点插入链表头部） | 尾插法（新节点插入链表尾部） |
| 扩容时哈希计算 | 重新计算哈希值（hash()方法） | 通过hash & oldCap判断是否需要移动（无需重新计算哈希） |
| 死循环问题 | 多线程扩容时可能导致链表成环（死循环） | 尾插法避免了死循环，但仍存在数据覆盖问题（线程不安全本质未变） |
### ConcurrentHashMap 线程安全实现方式
ConcurrentHashMap通过分段锁+CAS机制实现线程安全：
1.JDK7采用Segment分段锁，不同段可并发操作；
2.JDK8改为Node数组+链表/红黑树，使用synchronized锁单个桶节点；
3.volatile保证变量可见性；
4.CAS实现无锁化原子操作；
5.扩容时多线程协同迁移数据。
| **维度** | **JDK 7**              | **JDK 8**                        |
|--------|------------------------|----------------------------------|
| 底层结构   | 数组 + 链表 + 分段锁（Segment） | 数组 + 链表/红黑树 + CAS + synchronized |
| 锁粒度    | 段级锁（每个 Segment 独立加锁）   | 节点级锁（仅锁定链表头或红黑树根节点）              |
| 并发性能   | 中等（支持多段并发）             | 高（细粒度锁 + 无锁读）                    |
| 扩容机制   | 全量扩容（单线程完成）            | 并发扩容（多线程协作）                      |

### Object 类
| **方法** | **作用** | **常见场景** |
|---|---|---|
| toString() | 返回对象的字符串表示形式 | 调试、日志输出 |
| equals(Object obj) | 判断两个对象是否“逻辑相等” | 自定义对象内容比较 |
| hashCode() | 返回对象的哈希码（用于哈希表存储） | 集合类（如HashMap、HashSet） |
| getClass() | 返回对象的运行时类（Class对象） | 反射、类型检查 |
| clone() | 创建并返回对象的副本（浅拷贝） | 对象复制 |
| finalize() | 对象被垃圾回收前调用（已废弃） | 资源清理（不推荐使用） |
| wait()、wait(long timeout)、wait(long timeout, int nanos) | 让当前线程进入等待状态（需在同步块中使用） | 线程间通信（生产者-消费者模型） |
| notify()、notifyAll() | 唤醒等待该对象锁的线程（需在同步块中使用） | 线程间通信 |
### 拷贝
* **引用拷贝**：复制对象引用地址，新旧变量指向同一对象。
* **浅拷贝**：创建新对象，**复制基本类型值**，引用类型仍指向原对象，需实现**Cloneable**接口
* **深拷贝**：完全复制对象及关联的所有子对象，新旧对象完全独立。
| **类型** | **定义** | **特点** | **示例** |
|---|---|---|---|
| **引用拷贝** | 两个变量指向**同一个堆内存对象**（本质是引用的赋值） | 修改任意变量会影响另一个变量 | Person p1 = new Person();<br>Person p2 = p1; |
| **浅拷贝** | 创建一个新对象，并**复制原对象的字段值**（基本类型复制值，引用类型复制地址） | 新对象与原对象共享内部引用类型字段的实例 | Person p2 = p1.clone();<br>（未深拷贝内部的Address对象） |
| **深拷贝** | 创建一个新对象，并**递归复制所有内部引用对象的字段值** | 新对象与原对象完全独立，不共享任何引用类型字段的实例 | Person p2 = p1.deepClone();<br>（内部Address对象也被复制） |
### 序列化
序列化是将对象转换为可存储或传输的格式（如字节流、JSON），便于保存或网络传输。反序列化是逆向过程，将序列化后的数据恢复为原始对象结构，实现数据的重构和使用。两者常用于数据持久化、缓存或跨平台通信场景。
1. **Java序列化**  
   * 实现`Serializable`接口，使用`ObjectOutputStream`/`ObjectInputStream`  
   * **缺点**：生成二进制流不可读，跨语言兼容性差  
2. **文本协议**  
   * **JSON/XML**：可读性强，适合Web API（如RESTful接口）  
   * **YAML**：结构化配置文件常用（如Spring Boot的`application.yml`）  
3. **二进制协议**  
   * **Protocol Buffers (Protobuf)**：Google开发，高效紧凑，适合RPC通信  
   * **MessagePack**：混合文本与二进制，性能优于JSON  
4. **框架支持**  
   * **Java**：Jackson/Gson（JSON序列化库）  
   * **Python**：Pickle（原生序列化工具，注意安全风险）  