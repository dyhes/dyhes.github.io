---
title: 【LeetCode-C-Container】unorered_map & unorered_set & map & set
date: 2025-04-09 00:00:00+0000
categories: 
- pearl
- temple
tags:
- LeetCode-C
---
## `operator[]=`
C++ STL 的 `unordered_map` 支持 `[]=` 操作符。
本质为（**[operator\[\]](https://en.cppreference.com/w/cpp/container/map/operator_at)** 【unordered_set和set无此操作符】与元素的 operator=叠加所得）
该操作符具有**插入和修改元素的双重功能**，具体行为如下：
---
###  **`[]=` 操作符的核心功能**
- **键存在时**：通过 `map[key] = value` 可以直接修改该键对应的值。
- **键不存在时**：会自动插入一个以该键为索引的新元素，并将值初始化为默认类型（如 `int` 会初始化为 `0`，类对象调用默认构造函数），随后再赋值为 `value`。

示例代码：
```cpp
std::unordered_map<std::string, int> umap;
umap["apple"] = 10;  // 插入键 "apple"，值为 10
umap["apple"] = 20;  // 修改键 "apple" 的值为 20
```

---

### **与 `insert()` 的区别**
- **`[]=` 的强制覆盖性**：无论键是否存在，都会执行赋值操作。而 `insert()` 仅在键不存在时插入新元素，若**键已存在则保留原值**。
- **性能差异**：`[]=` 在键不存在时会先构造默认值再赋值，可能涉及**额外开销**；`insert()` 或 `emplace()` 更适合直接构造键值对。

示例：
```cpp
umap.insert({"banana", 5});  // 仅当键不存在时插入
```

---

### **底层实现与注意事项**
- **哈希表机制**：`[]=` 操作依赖哈希函数计算键的存储位置，若哈希冲突较多（例如键分布不均匀），可能导致性能下降。
- **默认值风险**：若键不存在，直接读取 `map[key]` 会插入默认值，**可能引发意外行为**。建议使用 `find()` 或 `count()` 检查键是否存在后再操作。

---

### **适用场景**
- **动态更新值**：例如统计词频时，可以直接通过 `map[word]++` 快速更新计数。
- **快速初始化**：适用于需要灵活插入或修改键值对的场景，但需注意默认值的初始化逻辑。

---
### 总结
`unordered_map` 的 `[]=` 操作符提供了便捷的键值操作方式，但其隐式的插入行为需要谨慎处理。在需要高性能或严格避免无效键插入时，建议结合 `find()` 或 `emplace()` 使用。

## 遍历

在C++中，`std::map`和`std::unordered_map`的遍历方法高度相似，但由于底层实现不同（红黑树 vs 哈希表），需要注意顺序问题。以下是具体方法及适用场景：

---

### 通用遍历方法（适用于所有版本）
1. **范围for循环（C++11+）**  
   最简洁的现代语法，直接遍历键值对：  
   ```cpp
   for (const auto& pair : container) {
       std::cout << "Key: " << pair.first << ", Value: " << pair.second << "\n";
   }
   ```  
   *适用场景*：只需顺序访问元素，无需修改键值。

2. **迭代器遍历**  
   传统方法，支持正向和反向遍历（反向仅限`std::map`）：  
   ```cpp
   // 正向遍历
   for (auto it = container.begin(); it != container.end(); ++it) {
       std::cout << "Key: " << it->first << ", Value: " << it->second << "\n";
   }
   // 反向遍历（仅map）
   for (auto rit = container.rbegin(); rit != container.rend(); ++rit) {
       // 访问方式同上
   }
   ```  
   *适用场景*：需要灵活控制遍历过程（如条件删除元素）。

3. **`std::for_each`算法**  
   结合Lambda表达式实现函数式编程：  
   ```cpp
   #include <algorithm>
   std::for_each(container.begin(), container.end(), [](const auto& pair) {
       std::cout << "Key: " << pair.first << ", Value: " << pair.second << "\n";
   });
   ```  
   *适用场景*：需要对元素进行统一处理（如批量修改值）。

---

### 进阶方法（C++17+）
4. **结构化绑定结构化绑定**  
   解构键值对，提升代码可读性：  
   ```cpp
   for (const auto& [key, value] : container) {
       std::cout << "Key: " << key << ", Value: " << value << "\n";
   }
   ```  
   *适用场景*：需要分离键和值的操作（如仅处理键或值）。

5. **键/值视图（C++20+）**  
   通过`std::views::keys`或`std::views::values`遍历单一部分：  
   ```cpp
   for (const auto& key : container | std::views::keys) {
       std::cout << "Key: " << key << "\n";
   }
   ```  
   *适用场景*：仅需遍历键或值。

---

### 注意事项
1. **顺序差异**  
   - `std::map`按键升序排列，支持反向迭代。  
   - `std::unordered_map`无固定顺序，反向迭代不可用。

2. **安全性**  
   - 遍历时插入或删除元素可能导致迭代器失效，需谨慎操作。

3. **性能**  
   - `std::unordered_map`的遍历速度通常更快，但受哈希冲突影响。

---

### 方法对比
| 方法               | 适用容器           | C++版本   | 特点                     |
|--------------------|--------------------|-----------|--------------------------|
| 范围for循环        | 全部              | C++11+    | 简洁直观                 |
| 迭代器             | 全部              | C++98+    | 灵活控制                 |
| 结构化绑定         | 全部              | C++17+    | 解构键值对               |
| 键/值视图          | 全部              | C++20+    | 仅遍历键或值             |

根据需求选择：若需顺序访问且代码简洁，优先用范围for循环；若需条件操作元素，用迭代器或`std::for_each`；若仅处理键或值，可用C++20的视图功能。

## Pair

### `map`与`unordered_map`的键值对存储方式  
在C++中，`std::map`和`std::unordered_map`的底层确实使用`std::pair`来存储键值对。每个元素的类型为`std::pair<const Key, T>`，其中`Key`是键的类型，`T`是值的类型。  
- **`std::map`**：基于红黑树实现，元素按键的升序排列，键不可修改。  
- **`std::unordered_map`**：基于哈希表实现，元素无序存储，键通过哈希函数映射到桶中。  

两者在插入、查找等操作中均通过`pair`对象管理键值对。例如：  
```cpp
std::map<int, std::string> m;
m.insert(std::make_pair(1, "apple"));  // 使用pair插入键值对
```

---

### `std::pair`的创建方法  
`std::pair`是C++标准库中的模板类，用于将两个值组合成单一实体。以下是其常见的创建方法：  

####  **直接构造**  
通过构造函数初始化键值对：  
```cpp
std::pair<std::string, int> p1("apple", 3);  // 显式指定键值对类型
std::pair p2("banana", 5);                   // C++17起支持自动类型推导（CTAD）
```

####  **使用`make_pair`函数**  
无需显式指定类型，自动推导类型：  
```cpp
auto p3 = std::make_pair("orange", 7);  // 类型为std::pair<const char*, int>
```

####  **拷贝构造与赋值**  
通过已有`pair`对象初始化新对象：  
```cpp
std::pair p4(p3);       // 拷贝构造
std::pair p5 = p3;      // 赋值操作
```

####  **通过`emplace`或`insert`隐式构造**  
在容器中直接构造`pair`（无需显式创建对象）：  
```cpp
std::unordered_map<std::string, int> umap;
umap.emplace("pear", 2);          // 在容器内部构造pair
umap.insert({"grape", 4});        // 使用初始化列表隐式转换为pair
```

####  **结构化绑定（C++17+）**  
从容器遍历时解构`pair`：  
```cpp
for (const auto& [key, value] : umap) {  // 将pair解构为key和value
    std::cout << key << ": " << value << "\n";
}
```

---

### `pair`的扩展用法  
1. **自定义比较规则**  
   若需自定义排序或哈希函数（如`unordered_map`中键为自定义类型），需为`pair`提供哈希和比较方法。  
2. **通过`tie`解构返回值**  
   当函数返回`pair`时，可用`std::tie`直接解构接收值：  
   ```cpp
   std::string name; int age;
   std::tie(name, age) = getPerson();  // 假设getPerson返回pair<string, int>
   ```

---

### 方法对比  
| 方法               | 适用场景                            | 特点                               |
|--------------------|-----------------------------------|------------------------------------|
| 直接构造           | 类型明确时                        | 代码直观，需显式指定类型           |
| `make_pair`        | 类型自动推导                      | 简化代码，适用于模板编程           |
| 拷贝构造/赋值      | 基于已有对象创建新对象            | 依赖原对象的类型和值               |
| 容器隐式构造       | 直接插入到`map`或`unordered_map` | 高效，避免临时对象拷贝             |

---

## Range-Based Loop
是的，在 C++ 中，`std::set` 完全支持使用**基于范围的 for 循环**（range-based for loop）进行遍历，且这是 C++11 及后续版本中推荐的简洁方式。

---

### **语法实现**
通过 `for (const auto& element : set_name)` 的语法可直接遍历 `std::set` 的所有元素。例如：
```cpp
#include <iostream>
#include <set>

int main() {
    std::set<int> my_set = {5, 2, 3, 1, 4};
    for (const auto& num : my_set) {  // 按升序输出：1 2 3 4 5
        std::cout << num << " ";
    }
    return 0;
}
```
- **特点**：无需手动操作迭代器，语法简洁且可读性强。
- **推荐使用 `const auto&`**：避免元素拷贝，提升性能（尤其对大型对象）。

---

### **底层原理**
`std::set` 是基于红黑树实现的有序容器，遍历时会**自动按升序输出元素**（默认使用 `<` 运算符排序）。例如：
```cpp
std::set<std::string> words = {"apple", "banana", "cherry"};
for (const auto& word : words) {  // 输出顺序：apple → banana → cherry
    std::cout << word << " ";
}
```

---

### **与其他遍历方式的对比**
| 方法                | 适用场景                         | 特点                            | 引用来源       |
|---------------------|--------------------------------|--------------------------------|---------------|
| **范围 for 循环**    | C++11 及以上版本                | 语法简洁，无需显式迭代器操作      |  |
| **迭代器遍历**       | C++98 及以上版本                | 兼容旧代码，支持手动控制遍历逻辑  |       |
| **std::for_each**    | 需结合算法库操作（如统计、修改）  | 支持函数式编程风格               |           |

---

### **注意事项**
- **元素唯一性**：`std::set` 会自动去重，遍历时不会出现重复元素。
- **不可修改元素**：`std::set` 中的元素是常量（`const`），遍历时不可直接修改其内容。
- **性能**：遍历的时间复杂度为 O(n)，与元素数量成线性关系。

---

### **示例扩展**
若需在遍历时输出索引（仅作参考，实际不推荐）：
```cpp
size_t index = 0;
for (const auto& num : my_set) {
    std::cout << "元素[" << index++ << "]: " << num << std::endl;
}
```

---

### 总结
对于 `std::set` 的遍历，**基于范围的 for 循环是最佳实践**。若需兼容旧版本代码（C++98 之前），可改用迭代器遍历。所有方法均能保证元素的有序性和唯一性。