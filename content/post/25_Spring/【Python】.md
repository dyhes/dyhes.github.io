---
title: 【Python】fstring
date: 2025-03-03 00:00:00+0000
categories: 
- temple
tags:
- Python
---

# 【Python】

## f-string
在 Python 中，可以通过 **f-strings**（格式化字符串字面值）实现类似 JavaScript 模板字符串 `a ${variable} bbbb` 的功能。以下是具体用法和对比：

---

### Python 的 f-strings 语法
1. **基本语法**  
   在字符串前添加 `f` 或 `F` 前缀，用 `{}` 包裹变量名即可直接插入值：  
   ```python
   name = "张三"
   greeting = f"你好，{name}！"  # 输出：你好，张三！
   ```

2. **支持表达式**  
   可以在 `{}` 内执行运算、调用函数等：  
   ```python
   price = 100
   total = f"总价：{price * 1.1:.2f}元"  # 输出：总价：110.00元
   ```

3. **多行字符串**  
   通过三引号 `"""` 或 `'''` 实现多行模板字符串：  
   ```python
   user_info = f"""
   姓名：{name}
   年龄：{age}
   """
   ```

---

### 与其他方法的对比
| 方法          | 示例                          | 特点                                  |
|---------------|-------------------------------|---------------------------------------|
| **f-strings**  | `f"Value: {x}"`               | 语法简洁，直接内嵌变量和表达式    |
| **str.format()** | `"Value: {}".format(x)`       | 兼容旧版本，支持复杂格式控制           |
| **% 格式化**   | `"Value: %s" % x`             | Python 2 遗留方法，逐渐被淘汰         |

---

### 与 JavaScript 的差异
1. **符号不同**  
   - JavaScript 使用反引号和 `${}`（如 `` `Hello ${name}` ``）。
   - Python 使用 `f` 前缀和 `{}`（如 `f"Hello {name}"`）。

2. **功能扩展**  
   Python 的 f-strings 支持更丰富的格式控制，例如：  
   ```python
   num = 3.14159
   formatted = f"保留两位小数：{num:.2f}"  # 输出：保留两位小数：3.14
   ```

---

### 最佳实践
- **优先使用 f-strings**：语法简洁，可读性强，且性能优于其他方法（Python 3.6+ 支持）。
- **复杂场景用 str.format()**：例如需要动态生成格式字符串时。

如果需要更详细的字符串操作示例（如连接、类型转换），可参考 Python 变量定义相关教程。


