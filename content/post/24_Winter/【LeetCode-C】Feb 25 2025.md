---
title: 【LeetCode-C】Feb 25 2025
date: 2025-02-25 00:00:00+0000
categories: 
- pearl
- temple
tags:
- LeetCode-C
---

## const
```cpp
bool operator()(const posLen& a, const posLen& b) const { }
// │         │               │                  │      └─ ③ 成员函数const
// │         │               └─ ① 参数常量引用   └─ ② 参数常量引用
```
### 参数 const
‌作用‌：声明参数为常量引用
效果‌：
* 函数内部无法修改 a 和 b 引用的对象
* 避免拷贝开销的同时保证数据安全
  ‌典型场景‌：用于只读访问大型对象时
### 成员函数 const
‌作用‌：声明为常量成员函数
‌效果‌：
* 函数内不能修改类的非 mutable 成员变量
* 允许在常量对象/常量上下文中调用
## vector 连续 erase
```cpp
#include <vector>
#include <iostream>
 
 
void print_container(const std::vector<int>& c)
{
    for (int i : c)
        std::cout << i << ' ';
    std::cout << '\n';
}
 
int main()
{
    std::vector<int> c{0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
    print_container(c);
 
    c.erase(c.begin());
    print_container(c);
 
    c.erase(c.begin() + 2, c.begin() + 5);
    print_container(c);
 
    // Erase all even numbers
    for (std::vector<int>::iterator it = c.begin(); it != c.end();)
    {
        if (*it % 2 == 0)
            it = c.erase(it);
        else
            ++it;
    }
    print_container(c);
}

```

output
```cpp
0 1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
1 2 6 7 8 9
1 7 9
```

## vector<pair<int, pair<int,int>>>
```cpp
vector<pair<int, pair<int, int>>> vec;

// 报错
vec.emplace_back(1, 2, 3); 
// 可运行
vec.emplace_back(4, std::make_pair(5, 6));  // 可行但效率略低‌:ml-citation{ref="1,2" data="citationList"}

```