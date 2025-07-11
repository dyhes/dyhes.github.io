---
title: 【LeetCode-C】constexpr
date: 2025-02-28 00:00:00+0000
categories: 
- pearl
- temple
tags:
- LeetCode-C
---

C++ 中的 `constexpr` 是一个用于声明 **编译时常量表达式** 的关键字，其核心目标是让编译器在编译阶段完成计算或初始化，从而提升程序性能和安全性。以下是其核心特性和用法：

---

###  **基本概念**
- **编译时求值**：`constexpr` 定义的变量、函数或对象必须在编译期确定值，而非运行时。这使它们能用于需要编译期常量的场景，如数组大小、模板参数等。
- **类型安全**：相比宏和模板元编程，`constexpr` 提供类型检查，避免宏替换导致的意外错误。

---

###  **主要用途**
#### (1) **变量声明**
- **编译期常量**：变量必须在编译时初始化，且初始化表达式必须为常量。
  ```cpp
  constexpr int max_size = 1024;  // 合法
  int array[max_size];            // 数组大小需编译期确定
  ```

#### (2) **函数声明**
- **编译期计算**：函数参数和返回值必须为字面类型（如整型、浮点型），且函数体在 C++11 中仅允许单条 `return` 语句（C++14 放宽，允许循环、局部变量等）。
  ```cpp
  constexpr int factorial(int n) {  // 编译期阶乘计算
      return n <= 1 ? 1 : n * factorial(n-1);
  }
  constexpr int val = factorial(5);  // 编译时计算结果为 120
  ```

#### (3) **类与构造函数**
- **编译期对象构造**：`constexpr` 构造函数和成员函数允许在编译期初始化对象。
  ```cpp
  class Point {
  public:
      constexpr Point(int x, int y) : x_(x), y_(y) {}
      constexpr int x() const { return x_; }
  private:
      int x_, y_;
  };
  constexpr Point origin(0, 0);  // 编译期创建对象
  ```

---

###  **与 `const` 的区别**
| 特性                | `const`                          | `constexpr`                      |
|---------------------|----------------------------------|----------------------------------|
| **初始化时机**       | 可运行时初始化（如函数内）       | 必须编译期初始化                 |
| **核心目的**         | 定义运行时不可修改的值           | 强制编译期计算，优化性能和安全性 |
| **适用场景**         | 运行时常量、成员保护             | 数组大小、模板参数、编译期计算   |
| **函数支持**         | 不能标记函数为编译期计算         | 可标记函数和构造函数             |

例如：
```cpp
const int a = rand();   // 合法，运行时初始化
constexpr int b = 100;  // 合法，编译期初始化
// constexpr int c = rand(); // 错误！必须是编译期常量
```

---

###  **应用场景**
- **优化性能**：将运行时计算转移到编译期，如数学运算（阶乘、斐波那契数列）。
- **类型安全替代宏**：例如编译期平方计算，避免宏展开问题。
- **模板元编程**：简化传统模板代码，如替代递归模板实现编译期计算。
- **复杂数据结构**：C++20 支持 `constexpr` 容器（如 `std::vector`），允许编译期动态内存分配。

---

###  **注意事项**
- **版本兼容性**：C++11 限制较多（如函数体仅单条 `return`），C++14/17/20 逐步放宽。
- **调试技巧**：使用 `static_assert` 验证编译期计算结果。
- **避免过度使用**：复杂计算可能增加编译时间。

---

### 示例代码（综合多个版本）
```cpp
// C++14 允许循环和局部变量
constexpr int pow(int base, int exp) {
    int res = 1;
    for (int i = 0; i < exp; ++i) res *= base;
    return res;
}
constexpr int value = pow(2, 10);  // 编译期计算 2^10 = 1024
```

通过合理使用 `constexpr`，开发者能显著提升代码效率和可维护性，尤其在资源敏感的嵌入式系统或高性能计算中效果显著。