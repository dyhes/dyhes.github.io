---
title: 【LeetCode-C】二分查找
date: 2025-03-07 00:00:00+0000
categories: 
- pearl
- temple
tags:
- LeetCode-C
---

在 C++ STL 中，std::vector 结合 <algorithm> 头文件提供的二分查找算法可实现快速二分查找。
* `std::lower_bound‌`
  返回第一个 ‌**不小于目标值**‌ 的元素的迭代器。若未找到，返回 end()‌
  ```cpp
  auto it = std::lower_bound(vec.begin(), vec.end(), target);
  ```
* `std::upper_bound‌`
  返回第一个 ‌**大于目标值**‌ 的元素的迭代器‌
* `std::binary_search`
  返回布尔值，表示目标值是否存在‌
* `‌std::equal_range`
  返回一个迭代器对，表示等于目标值的元素范围‌

## 自定义比较函数
### 仿函数（推荐）
```cpp
struct CustomCompare {
    bool operator()(const Element& a, const int& b) const {
        return a.key < b; // 假设按key升序排序
    }
};
```
### 函数指针
```cpp
bool customCompare(const Element& a, const int& b) {
    return a.key < b;
}
```
### 调用示例
```cpp
std::vector<Element> vec = {/* 已按key升序排列的元素 */};
int target = 42;

// 使用仿函数
auto it1 = std::lower_bound(vec.begin(), vec.end(), target, CustomCompare());

// 使用函数指针
auto it2 = std::lower_bound(vec.begin(), vec.end(), target, customCompare);
```
### 注意事项
* 参数顺序一致性‌自定义比较函数的参数顺序必须与排序时使用的比较规则完全一致‌
* ‌避免隐式类型转换‌若目标值与容器元素类型不同，需确保比较函数能正确处理类型差异，必要时构造临时对象‌
* ‌性能优化‌优先使用仿函数（而非函数指针），因编译器更易内联优化‌
* 当自定义比较函数 comp(a, b) ‌返回 **true‌** 时，意味着元素 **a ‌应排在 b 之前**‌（即下标更低的位置）‌，若未显式指定 comp，默认使用 < 运算符，此时 a < b 返回 true 表示 a 应排在 b 前‌。

## pair 默认比较函数
std::pair ‌有默认的比较函数‌，但需要满足两个条件：
* 其成员 first 和 second 的类型‌自身支持比较运算符‌
* 比较逻辑遵循‌字典序规则‌（先比较 first，相等时再比较 second）

**‌1. 默认比较运算符的触发条件**
当 std::pair<T1, T2> 的成员类型 T1 和 T2 ‌均已实现以下运算符‌时：
```cpp
operator<, operator==, operator<=, operator>, operator>=, operator!=
```
则 std::pair 会自动生成对应的比较函数。
**‌2. 默认比较规则‌**
比较逻辑为‌字典序‌（类似字符串排序）：
```cpp
// 伪代码解释 operator<
if (a.first < b.first) return true;
if (b.first < a.first) return false;
return a.second < b.second;
```

**‌3. 典型用例**
```cpp
std::pair<int, std::string> p1{1, "apple"};
std::pair<int, std::string> p2{2, "banana"};
std::cout << (p1 < p2); // 输出 1（true），因为 1 < 2
```

