---
title: 【LeetCode-C】struct & class
date: 2025-02-27 00:00:00+0000
categories: 
- pearl
- temple
tags:
- LeetCode-C
---


在C++中，`struct`和`class`都可以用来定义类，**核心区别在于默认的成员访问权限和默认继承方式**。以下是两者的详细对比：

## **核心区别**
| 特性               | `struct`                          | `class`                          |
|--------------------|-----------------------------------|----------------------------------|
| **默认成员访问权限** | `public`                         | `private`                        |
| **默认继承方式**     | `public` 继承                    | `private` 继承                   |

#### 示例代码
```cpp
// struct 示例
struct MyStruct {
    int x;     // 默认 public
    void foo(); // 默认 public
};

// class 示例
class MyClass {
    int x;     // 默认 private
    void foo(); // 默认 private
};
```


## **使用场景与惯例**
| 场景               | `struct`                          | `class`                          |
|--------------------|-----------------------------------|----------------------------------|
| **典型用途**        | 数据聚合（如 POD 类型、数据传输对象） | 封装数据和行为（如业务逻辑对象） |
| **代码风格**        | 成员直接暴露（如坐标点、配置参数）   | 成员私有化，通过方法控制访问     |

#### 示例代码
```cpp
// 用 struct 定义数据聚合
struct Point {
    int x;
    int y;
    // 无复杂方法
};

// 用 class 封装对象
class BankAccount {
private:
    double balance;
public:
    void deposit(double amount) { /* 逻辑 */ }
    void withdraw(double amount) { /* 逻辑 */ }
};
```


## **继承行为差异**
| 继承方式           | `struct` 默认行为               | `class` 默认行为                |
|--------------------|---------------------------------|---------------------------------|
| 派生类对基类成员的访问 | `public` 继承（基类成员保持原访问权限） | `private` 继承（基类成员在派生类中变为 `private`） |

#### 示例代码
```cpp
// struct 继承（默认 public）
struct BaseStruct {
    int publicVar;
};
struct DerivedStruct : BaseStruct { 
    // publicVar 在派生类中仍为 public
};

// class 继承（默认 private）
class BaseClass {
    int privateVar;
public:
    int publicVar;
};
class DerivedClass : BaseClass { 
    // publicVar 在派生类中变为 private
    // privateVar 不可访问
};
```


## **其他注意事项**
1. **模板参数声明**  
   在模板中，`class`和`typename`可以互换，但`struct`不能替代它们：
   ```cpp
   template <class T>  // 合法
   template <struct T> // 非法！
   ```

2. **兼容性**  
   C语言中的`struct`只能包含数据成员，而C++的`struct`可以包含成员函数、访问控制等，与`class`完全等价（除默认权限外）。

3. **显式指定访问权限**  
   无论用`struct`还是`class`，均可显式指定访问权限：
   ```cpp
   struct MyStruct {
   private:  // 显式声明 private
       int hiddenData;
   public:
       void showData() { /* 访问 hiddenData */ }
   };
   ```


## **总结**
| 维度       | `struct`                          | `class`                          |
|------------|-----------------------------------|----------------------------------|
| **核心用途** | 轻量级数据聚合（默认开放）        | 复杂对象封装（默认封闭）         |
| **默认行为** | 成员公有化、继承公有化            | 成员私有化、继承私有化           |
| **代码风格** | 面向数据（无封装强制要求）        | 面向对象（强调封装性）           |

**实际开发建议**：  
- 优先用`class`表示需要封装和行为的对象。  
- 用`struct`表示纯数据集合（如DTO、配置参数等）。  
- 无论用哪种，显式写明访问权限（`public`/`private`）和继承方式，避免依赖默认行为。