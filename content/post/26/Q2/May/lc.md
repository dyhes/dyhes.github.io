---
title: 【LeetCode-C】 Knowledges May
date: 2026-05-11 00:00:00+0000
categories: 
- pearl
- temple
tags:
- LeetCode-C
---

## 数位 DP

数位 DP（Digit DP）是一种用来解决**与数字的十进制表示（或其他进制）相关**的计数问题的动态规划方法。它的典型应用场景是：给定一个区间 \([L, R]\)，求其中满足某种与“数字的每一位”有关性质的数的个数。

常见的数位 DP 问题：
- \([L,R]\) 内有多少个不含数字 4 的数？
- 有多少个相邻数字之差至少为 2 的数（Windy 数）？
- 有多少个数字的各位之和能被某个数整除？
- 有多少个数字本身能被自己的各位之和整除？
- 数字中是否出现“49”、“13”等特定模式……

这些题目直接枚举会超时（\(R\) 可达 \(10^{18}\) 甚至更大），而数位 DP 可以把复杂度降到与数字位数相关（如 \(O(\text{位数} \times \text{状态数})\)）。

---

### 1. 核心思想：按位枚举 + 状态压缩

我们把一个数 \(x\) 写成一个固定长度的数字序列（高位在前面）。假设最大位数为 \(len\)，我们就从最高位到最低位（第 \(len-1\) 位到第 0 位）一位一位地填数，并在填的过程中维护一些**状态**，例如：
- 前一位填了什么数字（用于判断相邻关系）
- 已经填的数字之和是多少
- 某个模运算的结果

因为很多不同的前缀最终可能归到相同的状态，我们可以用**记忆化搜索**（DFS + 备忘录）来避免重复计算。

---

### 2. 两个关键控制标志：`limit` 与 `lead`

在枚举过程中，我们通常用两个布尔标志来控制搜索。

#### 2.1 上界限制 `limit`
当我们按位构造一个数时，如果前面所有位都**恰好等于**原数 \(x\) 的对应位，那么当前位只能取 \(0 \sim \text{digit}[pos]\)；否则，当前位可以取 \(0 \sim 9\) 而不会超过 \(x\)。
- `limit = true`：当前位受到上界限制。
- `limit = false`：当前位不受限制，可以取满 0~9。

这种限制传递是：只有前面所有高位都贴着上限，这一位才继续贴上限。一旦某一位选的数字小于上限对应位，后面的位就永久解除限制（`limit = false`）。

#### 2.2 前导零 `lead`
很多问题对**前导零**有特殊要求。例如，数字 `013` 的实际值为 `13`，最高位是 `1` 而不是 `0`。如果题目要求“不含前导零”或“计算相邻数字差时前导零不能算作真正的 0”，就需要用 `lead` 标志。
- `lead = true`：当前位之前所有位都是前导零。
- `lead = false`：已经填了非零的最高位。

前导零处理的核心：**在 `lead = true` 时，如果当前位填 0，则下一层的 `lead` 仍为 `true`；一旦填了非零数字，`lead` 变成 `false`。**

---

### 3. 记忆化搜索模板

递归函数通常这样设计（以十进制为例）：

```python
def dfs(pos, ..., limit, lead):
    if pos == -1:          # 所有位都填完了
        return 1 或 某种条件判断的结果

    # 只有不受限制且没有前导零时，才能用记忆化结果
    if not limit and not lead and dp[pos][...] != -1:
        return dp[pos][...]

    up = digit[pos] if limit else 9
    res = 0
    for i in range(0, up + 1):
        # 处理前导零
        if lead and i == 0:
            # 继续传递 lead=True
            res += dfs(pos - 1, ..., limit and i == up, True)
        else:
            # 根据 i 更新状态 ...
            res += dfs(pos - 1, ..., limit and i == up, False)

    if not limit and not lead:
        dp[pos][...] = res
    return res
```

为了计算 \([L, R]\) 内的答案，一般用前缀和思想：
\[
\text{ans} = \text{solve}(R) - \text{solve}(L-1)
\]
其中 `solve(x)` 计算 \([0, x]\)（或 \([1, x]\)）中满足条件的数的个数。

---

### 4. 经典例题详解

#### 4.1 【例题 1】不含数字 4 的数

**题目**：求 \([L, R]\) 中有多少个数的十进制表示中**不包含数字 4**。

**状态设计**：不需要额外状态，只需判断当前位是否选 4。但要注意：前导零不影响。

**DP 数组**：`dp[pos]` 表示在没有限制、没有前导零时，从第 `pos` 位往后任意填且不包含 4 的方案数。

**代码**（Python 示例）：
```python
def solve(x):
    if x < 0: return 0
    digits = list(map(int, str(x)))
    digits.reverse()   # 让低位在索引 0，方便递归
    n = len(digits)

    dp = [-1] * n

    def dfs(pos, limit, lead):
        if pos == -1:
            return 1 if not lead else 0   # 如果全是前导零，就是数字0，算还是不算根据题意。这里假设不算0。
        if not limit and not lead and dp[pos] != -1:
            return dp[pos]

        up = digits[pos] if limit else 9
        res = 0
        for i in range(0, up + 1):
            if i == 4:        # 不允许4
                continue
            if lead and i == 0:
                res += dfs(pos - 1, limit and i == up, True)
            else:
                res += dfs(pos - 1, limit and i == up, False)

        if not limit and not lead:
            dp[pos] = res
        return res

    return dfs(n - 1, True, True)

# 区间询问
L, R = 1, 100
print(solve(R) - solve(L - 1))
```

**分析**：
- 边界 `pos == -1` 时，如果 `lead` 还是 `True`，说明这个数是 `0`。根据题意，`0` 是否包含通常要特殊判断，这里选择不算。
- 记忆化条件 **`not limit and not lead`** 非常重要，因为 `limit` 或 `lead` 为 `True` 时的状态不具备普遍性，不能直接复用。

---

#### 4.2 【例题 2】含有连续 “49” 的数

**题目**：统计 \([L,R]\) 中有多少个数出现过子串 “49”。

**状态设计**：需要记录上一位是什么数字，用来判断是否会形成 “49”。
- `pre`：上一位填的数字。可用 0~9，其中 -1 表示没有上一位（初始态或刚结束前导零）。
- 需要一个状态 `has`（或直接判断）表示是否已经出现 “49”。但这里我们可以直接在 dfs 过程中判断：如果 `pre == 4` 且 `i == 9`，则后续无论填什么都满足条件。可以用一个额外的 flag `ok` 表示当前是否已经包含 “49”。

**DP 状态**：`dp[pos][pre][ok]`，其中 `ok` 是 0/1。

**代码片段**：
```python
def dfs(pos, pre, ok, limit, lead):
    if pos == -1:
        return ok   # 整个数填完，ok=1 表示出现过 49
    if not limit and not lead and dp[pos][pre][ok] != -1:
        return dp[pos][pre][ok]
    up = digits[pos] if limit else 9
    res = 0
    for i in range(up + 1):
        nxt_ok = ok or (pre == 4 and i == 9)
        if lead and i == 0:
            res += dfs(pos - 1, -1, 0, limit and i == up, True)
        else:
            nxt_pre = i if not (lead and i == 0) else -1
            # 其实 lead=False 后 pre 一定不会是 -1
            res += dfs(pos - 1, i, nxt_ok, limit and i == up, False)
    if not limit and not lead:
        dp[pos][pre][ok] = res
    return res
```
> 注意：记忆化时状态 `pre` 维度要能表示 -1（数组下标可以加一偏移）。

---

#### 4.3 【例题 3】Windy 数

**题目**：不含前导零且相邻两个数字之差至少为 2 的数称为 Windy 数。求 \([L,R]\) 中的 Windy 数个数。

**关键点**：
- 前导零：当 `lead=True` 时，最高位实际还没确定，所以“相邻差”条件不应强行判断。
- 首位（即刚脱离前导零的第一位）没有“上一位”来限制，可以直接任意取 1~9。

**状态设计**：`dp[pos][pre]`，`pre` 表示前一位数字（0~9）。如果处于前导零状态，`pre` 可以用特殊值（如 10）表示“还没有前一位”。

**DP 记忆化**：`dp[pos][pre]` 在不限制、无前导零时记录。

**代码核心部分**：
```python
def dfs(pos, pre, limit, lead):
    if pos == -1:
        return 1 if not lead else 0   # 忽略全零的数
    if not limit and not lead and dp[pos][pre] != -1:
        return dp[pos][pre]
    up = digits[pos] if limit else 9
    res = 0
    for i in range(0, up + 1):
        if lead and i == 0:
            res += dfs(pos - 1, pre, limit and i == up, True)
        else:
            if lead:  # 这一位作为第一个非零位
                # 没有 pre 限制，可以直接选
                res += dfs(pos - 1, i, limit and i == up, False)
            else:
                if abs(i - pre) >= 2:
                    res += dfs(pos - 1, i, limit and i == up, False)
    if not limit and not lead:
        dp[pos][pre] = res
    return res
```
初始化 `pre` 可以给一个不影响的值（如 0），因为 `lead=True` 时不会检查 `abs`。

---

#### 4.4 【例题 4】能被自己的数位和整除的数

**题目**：求 \([L,R]\) 中有多少个数，能被自己的各位数字之和整除。  
（例如 12：数位和 3，12 能被 3 整除，符合条件）

**复杂点**：数位和不是固定的，需要在 DP 中同时记录当前数位和以及原数模数位和的结果。但模数随状态改变，不能直接存。  
技巧：**枚举最后的数位和 `sum_mod`**。因为最大数位和不超过 `9 * len`（如 18 位数最大和 162），我们可以外层循环 `sum_mod` 从 1 到 `max_sum`，然后 DP 里计算：
- `sum`: 当前已累计的数位和（不能超过 `sum_mod`）
- `mod`: 当前构成的数对 `sum_mod` 取模的余数

最后 `pos == -1` 时，判断 `sum == sum_mod` 且 `mod == 0`。

**DP 状态**：`dp[pos][sum][mod]`，针对固定的 `sum_mod` 做记忆化（注意不同 `sum_mod` 要清空 dp 数组）。

复杂度为 \(O(\text{位数} \times \text{最大数位和}^3)\)，在合适范围（如 18 位数）内可行。

---

### 5. 实现技巧与注意事项

#### 5.1 记忆化只记录通用状态
`dp` 数组只应该在 `!limit && !lead` 时写入和读取。因为 `limit=true` 的状态严重依赖于原始数字的上界，而 `lead=true` 的状态只在数字起始阶段出现，复用机会很少。

#### 5.2 递推式预处理 + 组合计数
有些简单题（如不含 4）可以不用记忆化搜索，直接预处理 `f[pos][state]` 再用常规的按位统计。  
例如：`f[i][0]` 表示 i 位数中不含 4 的个数，最后扫描上界的每一位。这种方法通常空间更小，但思维要求稍高。记忆化 DFS 写法更直观、不易错。

#### 5.3 处理前导零的通用原则
- 如果题目求的是“正整数的性质”，要注意 0 是否应该计入。通常 `solve(0)` 返回 0 或 1 要结合题义调整。
- 凡涉及“相邻位比较”时，一定要等脱离前导零后再比较。
- 前导零也会影响数字实际长度，如“不含前导零的 3 位数”统计。

#### 5.4 状态压缩
当状态较多时，DP 数组可能多维。可以用字典或 `functools.lru_cache`，但注意 `limit` 和 `lead` 不能缓存。性能上，多维数组直接索引通常更快。

#### 5.5 二进制 / 其它进制
数位 DP 不仅用于十进制，也可以处理二进制表示下的计数（如“二进制中 1 的个数”相关问题）。只需将 `up` 改成相应进制的最大数码。

---

### 6. 总结

数位 DP 的核心是：**把区间计数问题转换成“按位决策”的树上搜索，并通过标志位 `limit` 和 `lead` 控制边界，最后用前缀和差分得到答案**。  
由于大部分状态的限制条件在脱离上限和前导零后会变得普遍一致，记忆化搜索可以极大减少重复计算。

学习路线建议：
1. 先掌握**最简单的不含某数字**的题，理解 `limit` 与记忆化机制。
2. 再练习**带前导零判断**的 Windy 数等。
3. 进阶到**多维状态**（如模运算、数位和、是否出现某模式）。
4. 尝试自己改写为递推，加深理解。

掌握了这些模板和状态设计思路，绝大多数数位 DP 题都可以套用解决。

## 匿名函数

C++ 中的匿名函数（anonymous function）在语言规范里称为 **lambda 表达式**。自 C++11 引入后，它在 STL 算法、回调、并发等场景中极大地简化了代码。下面从基础到高级，详细介绍 C++ lambda。

---

### 1. 什么是 lambda 表达式？

Lambda 表达式是一个**可调用的无名函数对象**，可以捕获当前作用域中的变量，并在后续被调用。  
编译器会把它展开为一个**匿名的函数对象类**（闭包类），每个 lambda 表达式生成一个独一无二的类。

```cpp
// 最简单的 lambda
auto f = [] { std::cout << "Hello\n"; };
f(); // 调用
```

---

### 2. 基本语法

完整形式：

```
[ capture ] ( parameters ) specifiers -> return_type { body }
```

所有组成部分：
- **capture**：捕获列表，描述如何捕获外部变量。
- **parameters**：参数列表（可为空，可省略括号如果无参数、无 mutable 等）。
- **specifiers**：可选限定符，如 `mutable`、`constexpr`、`noexcept` 等。
- **return_type**：尾置返回类型（可省略让编译器推导）。
- **body**：函数体。

**最简形式**：`[]{}` 是一个合法但什么都不做的 lambda。

---

### 3. 捕获列表（captures）

捕获列表决定了 lambda 体内可以使用哪些外部变量，以及如何访问它们（值或引用）。

#### 3.1 空捕获：`[]`
内部不能使用任何外部局部变量（全局变量、静态变量无需捕获可直接用）。

#### 3.2 值捕获：`[x]`
将变量 `x` 的副本捕获到闭包对象中。默认**不能修改**这个副本（等效闭包类的 `operator()` 为 `const`）。想修改需要用 `mutable`。

```cpp
int a = 10;
auto f = [a] { return a + 1; };          // OK，读取 a 的副本
// auto g = [a] { a++; };                // 错误：不能修改 const 副本
auto h = [a]() mutable { a++; return a; };// 正确，加了 mutable
```

#### 3.3 引用捕获：`[&x]`
捕获引用，内部可以修改外部变量，并且修改会反映到外部。

```cpp
int a = 10;
auto f = [&a] { a += 5; };
f();
// a 变成 15
```

#### 3.4 隐式捕获
- `[=]`：按值捕获所有用到的外部变量（自动推导需要哪些）。
- `[&]`：按引用捕获所有用到的外部变量。

```cpp
int x = 1, y = 2;
auto add = [=] { return x + y; };   // 值捕获 x 和 y
auto inc = [&] { x++; y++; };       // 引用捕获 x 和 y
```

#### 3.5 混合捕获
可以混合默认捕获和显式捕获，但要求：
- 如果默认捕获是 `=`，显式捕获必须是 `&变量`。
- 如果默认捕获是 `&`，显式捕获必须是 `变量`。

```cpp
int x = 1, y = 2;
auto f = [=, &y] { y += x; };   // x 值捕获，y 引用捕获
auto g = [&, x] { x + y; };     // y 引用捕获（隐式），x 值捕获
```

#### 3.6 捕获 `this` 与 `*this`（C++17）
在成员函数内部，可以捕获当前对象：
- `[this]`：捕获 `this` 指针（按值捕获指针，成员按引用访问）。相当于可以修改成员。
- `[*this]`（C++17）：捕获当前对象的副本，lambda 内部对成员的修改不影响原对象。

```cpp
struct Widget {
    int val = 0;
    auto get_lambda() {
        return [*this] { return val; }; // 捕获整个对象的副本
    }
};
```

#### 3.7 初始化捕获（C++14）
允许在捕获列表中直接**定义并初始化一个新变量**，或者**移动外部对象**。

```cpp
auto ptr = std::make_unique<int>(5);
auto f = [p = std::move(ptr)] { return *p; }; // 移动捕获

auto g = [value = 42] { return value; };      // 自定义变量
```

#### 3.8 捕获全局/静态/常量
全局变量、静态局部变量、常量表达式不需要写在捕获列表中，可以直接在 lambda 体中使用。

```cpp
int global = 100;
void test() {
    static int s = 5;
    auto f = [] { return global + s; }; // OK
}
```

---

### 4. 参数列表与返回类型

#### 4.1 参数
和普通函数一样，可以带参数，也可以不带。如果 lambda 没有任何参数且不包含 `mutable`、`noexcept` 等修饰，可以省略参数括号。

```cpp
auto f = [] { return 1; };           // 省略 ()
auto g = [](int a, int b) { return a + b; };
```

#### 4.2 尾置返回类型
大部分情况下编译器可以自动推导返回类型。若 lambda 体内有多个 `return` 语句且类型不同，或想明确指定返回类型，就需要尾置：

```cpp
auto f = [](int x) -> double {
    if (x > 0) return 1.0;
    else return 2.0;     // 必须一致，或显式指定返回类型
};
```

如果省略，且多个 `return` 类型不一致则编译错误。

---

### 5. `mutable` 限定符

前面提到，值捕获的变量副本在默认 `const` 闭包函数中不可修改。加上 `mutable` 后可以修改这些副本，但**不影响外部原变量**。

```cpp
int n = 0;
auto f = [n]() mutable { n++; return n; };
std::cout << f() << '\n'; // 1
std::cout << f() << '\n'; // 2
std::cout << n << '\n';   // 0 (外部不变)
```

注意：当参数列表为空时，如果要加 `mutable`，参数括号不可省略。

```cpp
auto f = [n]() mutable { /*...*/ };
```

---

### 6. 泛型 lambda（C++14）

参数类型可以声明为 `auto`，让 lambda 成为函数模板。编译器会为每次调用生成对应类型的实例化。

```cpp
auto sum = [](auto a, auto b) { return a + b; };
std::cout << sum(1, 2.5) << '\n';     // 3.5
std::cout << sum(std::string("A"), "B"); // "AB"
```

C++20 进一步允许直接使用模板语法：

```cpp
auto f = []<typename T>(const std::vector<T>& v) {
    // ...
};
```

这在需要访问类型本身（而非仅 `auto`）时很有用，例如 `T::value_type`。

---

### 7. `constexpr` lambda（C++17 起）

Lambda 表达式默认隐含 `constexpr`（如果函数体满足常量表达式条件）。也可以显式标记为 `constexpr` 或 `consteval`（C++20）。

```cpp
auto square = [](int n) constexpr { return n * n; };
static_assert(square(10) == 100);
```

在编译期计算时非常方便。

---

### 8. 立即调用的 lambda 表达式（IILE）

定义 lambda 的同时直接调用它，常用于复杂的常量初始化。

```cpp
const auto vec = [] {
    std::vector<int> v;
    for (int i = 0; i < 10; ++i)
        v.push_back(i * i);
    return v;
}();   // 立即调用
```

这种方式可以代替传统的立即执行函数，并且清晰地限定临时变量的作用域。

---

### 9. lambda 与可调用对象的转换

#### 9.1 转换为函数指针
只有**无捕获**（`[]`）的 lambda 能转换为函数指针。

```cpp
void (*fp)(int) = [](int x) { std::cout << x; };
fp(10);
```

有捕获的 lambda 则不能。

#### 9.2 转换为 `std::function`
任何 lambda 都可以存入 `std::function`，但有额外的类型擦除开销。

```cpp
std::function<int(int, int)> f = [](int a, int b) { return a + b; };
```

#### 9.3 作为模板参数（泛型编程）
可以直接用 `auto` 接收 lambda，保持其具体类型，无 `std::function` 开销。标准库算法通常按值接受这样的可调用对象。

```cpp
auto cmp = [](int a, int b) { return a > b; };
std::set<int, decltype(cmp)> s(cmp);
```

---

### 10. 底层实现与性能

编译器为每个 lambda 生成一个**匿名的类**（闭包类型）。该类有：
- 一个 `operator()` 成员函数（默认 `const`，除非有 `mutable`）。
- 捕获的变量作为其数据成员。
- 如果是值捕获，成员通过拷贝初始化；引用捕获则存储引用。

由于类型确定，lambda 的调用通常可以被完全内联优化，性能与手写的函数对象或普通函数无异。  
**开销注意**：
- 按值捕获大量变量会增加闭包对象体积，影响拷贝成本。
- `std::function` 包装会引入间接调用和可能的堆分配，慎用在性能热点。

---

### 11. 常见使用场景

1. **STL 算法**的自定义谓词/操作：
   ```cpp
   std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
   std::for_each(v.begin(), v.end(), [](int &n) { n *= 2; });
   ```

2. **回调函数**：如定时器、事件处理、异步任务等。
   ```cpp
   std::async(std::launch::async, [result = std::move(data)] { process(result); });
   ```

3. **一次性辅助函数**：避免定义独立函数污染命名空间。
   ```cpp
   auto legal = [&](int x) { return x > 0 && x < max_val; };
   if (legal(a) && legal(b)) ...
   ```

4. **惰性求值 / 延迟执行**：将 lambda 存储起来，稍后调用。

5. **自定义删除器**（如智能指针）：
   ```cpp
   std::unique_ptr<FILE, decltype([](FILE* f) { fclose(f); })> fp(fopen("..."), {});
   ```
   （C++20 允许 lambda 在未求值上下文中使用）

---

### 12. 各版本特性速查

| 版本   | 特性                                      |
|--------|-------------------------------------------|
| C++11  | lambda 基础语法、捕获列表、`mutable`      |
| C++14  | 泛型 lambda（`auto` 参数）、初始化捕获    |
| C++17  | `constexpr` lambda、捕获 `*this`          |
| C++20  | 模板 lambda、默认构造/赋值（无捕获）、可以在未求值上下文出现、`consteval` lambda |

---

### 13. 注意事项 & 最佳实践

- **生命周期**：引用捕获时，务必保证被引用的变量在 lambda 调用时仍然存活，避免悬垂引用（尤其是在异步或延迟调用中）。
- **显式优于隐式**：尽量写清楚捕获哪些变量，避免不必要的 `[=]` 或 `[&]` 大面积捕获，降低意外修改的风险。
- **移动捕获**：如果外部对象不可复制或希望转移所有权，用 C++14 初始化捕获 `[p = std::move(ptr)]`。
- **递归 lambda**：需要结合 `std::function` 或使用带有 `auto` 参数与 Y 组合子的技巧（通常用 `std::function` 更简单）。
- **this 捕获**：在成员函数中使用 lambda 并捕获 `this` 时，注意对象生命周期；C++17 的 `*this` 可捕获副本避免该问题。

---

Lambda 表达式是现代 C++ 中不可或缺的组成部分，能写出更简洁、内聚的代码。掌握从基础捕获到 C++20 的高级用法，可以让你在不同场景下都游刃有余。

## 快速选择

快速选择算法（Quickselect）是一种**在未排序序列中查找第 k 小（或第 k 大）元素**的高效选择算法。它与快速排序同源，都基于分治思想，但每次只需递归处理一侧，因此平均时间复杂度为 \(O(n)\)。下面从原理到实现深入解析。

---

### 1. 核心思想

快速选择的核心步骤与快速排序的划分（partition）完全一致：
- 选择一个**基准元素**（pivot）
- 将序列重新排列，使得**小于基准的元素在左边，大于基准的在右边**（等于的元素可左可右或单独处理）
- 此时基准会落在其**最终有序位置**上（假设序列按升序排列），记该索引为 `pivot_index`。

假如要找**第 k 小**的元素（k 从 0 开始计数），那么：
- 若 `pivot_index == k`，基准正是我们要找的元素，直接返回。
- 若 `pivot_index > k`，说明目标元素在基准**左边**，递归进入左半部分继续查找。
- 若 `pivot_index < k`，说明目标元素在基准**右边**，递归进入右半部分，同时将 k 调整为 `k - pivot_index - 1`（或保持全局 k 不变，但只在右部分继续划分）。

**关键优势**：每次递归只需要处理一侧的子序列，平均情况下每次问题规模减半，因此总操作次数为 \(n + n/2 + n/4 + \dots = O(n)\)。

---

### 2. 算法步骤

以寻找**第 k 小**（升序，k 从 0 开始）为例：

1. **边界检查**：若序列为空或 k 非法，返回错误。
2. **选择枢纽元**：通常随机选取或取首/尾/三数中值，避免最坏退化。
3. **执行划分**（partition）：
   - 使用 **Lomuto** 或 **Hoare** 划分方案。
   - 最终将序列分成 `[小于基准] + 基准 + [大于基准]`，并得到基准的最终位置 `p`。
4. **决策**：
   - 如果 `p == k`，返回 `nums[p]`。
   - 如果 `p > k`，递归处理左区间 `[left, p-1]`。
   - 如果 `p < k`，递归处理右区间 `[p+1, right]`。
5. **重复** 直到找到目标。

---

### 3. 与快速排序的关系

| 快速排序（Quicksort） | 快速选择（Quickselect） |
|----------------------|------------------------|
| 每次划分后**左右两侧都要递归** | 每次划分后**只递归一侧** |
| 时间复杂度 平均 \(O(n \log n)\)，最坏 \(O(n^2)\) | 平均 \(O(n)\)，最坏 \(O(n^2)\) |
| 目的是**完全排序**整个序列 | 目的是**找到第 k 小的元素**，其他元素不必有序 |

快速选择相当于快速排序的“减半治之”（decrease and conquer），而快速排序是标准的分治（divide and conquer）。

---

### 4. 时间复杂度分析

#### 4.1 平均情况
假设每次划分都能将序列大致对半分，问题规模递减的规律为：
\[
T(n) = T(n/2) + O(n)
\]
解此递推式：
\[
T(n) = O(n) + O(n/2) + O(n/4) + \dots = O(2n) = O(n)
\]
即使在每次划分比例为 1/3 和 2/3 的情况下，依然有 \(T(n) = T(2n/3) + O(n)\)，等比级数仍收敛于 \(O(n)\)。

#### 4.2 最坏情况
若每次划分极不均匀（如选到最小或最大元素），则可能退化为：
\[
T(n) = T(n-1) + O(n) \implies O(n^2)
\]
例如：已排序的数组且始终选第一个/最后一个元素作为枢纽。

#### 4.3 优化最坏情况的常用手段
- **随机化**：每次从当前区间随机选取一个元素作为枢纽，可使最坏情况发生的概率极低，期望时间复杂度仍为 \(O(n)\)。
- **Median-of-Medians（BFPRT）**：永远选择一个“好”的枢纽，保证划分比例在最坏情况下也有界，从而实现**确定性线性时间** \(O(n)\)。这是快速选择的加强版本，但常数因子较大，实践中随机化更常用。

---

### 5. 空间复杂度

- 递归实现需要额外的**调用栈空间**。平均递归深度为 \(O(\log n)\)，最坏 \(O(n)\)。
- 可轻松改写为**迭代**形式（只需一个循环，每次更新区间边界），此时空间复杂度降为 \(O(1)\)。
- 划分操作在原地进行，不需要额外数组。

---

### 6. 实现细节

#### 6.1 划分函数的选择
- **Lomuto 划分**：将基准放在区间末尾，简单易写，但可能对重复元素效率较低。
- **Hoare 划分**：使用双指针从两端向中间扫描，效率通常更高，且能较好处理大量重复元素。但划分后基准的位置不一定在最终位置，需要小心递归边界。

快速选择通常使用 Lomuto 足够清晰，但推荐随机化的 Hoare 划分以获得更稳定的性能。

#### 6.2 关于 k 的计数
- 通常约定 **k 从 0 开始**，即 k=0 表示最小元素。
- 若要“第 k 大”，可以转换为第 `(n-k)` 小，或者修改比较方向。

#### 6.3 处理重复元素
当存在大量重复值时，Hoare 划分可能不会将等于枢纽的元素全部集中到中间，而是左右都有。这并不影响快速选择的正确性，因为只要保证 **左半部分全部 ≤ 枢纽**，**右半部分全部 ≥ 枢纽**，根据索引与 k 的比较仍能正确决定递归方向。如果使用三路划分（分成小于、等于、大于三区），可以进一步跳过整个“等于”区，提高效率。

---

### 7. 代码示例（C++ 迭代实现，随机化枢纽）

```cpp
#include <vector>
#include <random>
#include <algorithm>

// 随机枢纽的划分（Hoare版）
int partition(std::vector<int>& nums, int left, int right) {
    int rand_idx = left + rand() % (right - left + 1);
    std::swap(nums[rand_idx], nums[right]);      // 将随机枢纽移到末尾
    int pivot = nums[right];
    int i = left;
    for (int j = left; j < right; ++j) {
        if (nums[j] <= pivot) {
            std::swap(nums[i], nums[j]);
            ++i;
        }
    }
    std::swap(nums[i], nums[right]);   // 将枢纽放到正确位置
    return i;
}

int quickselect(std::vector<int>& nums, int k) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int p = partition(nums, left, right);
        if (p == k) return nums[p];
        else if (p > k) right = p - 1;
        else left = p + 1;
    }
    return -1; // 不会到达，除非k非法
}
```

使用方式：
```cpp
std::vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};
int kth_smallest = quickselect(v, 3);  // 第4小的元素（k=3） → 结果为3
```

> 说明：代码采用迭代，无需递归，空间复杂度 \(O(1)\)。每次随机选取枢纽，期望线性时间。

---

### 8. 应用场景

- **求中位数**：直接调用 `quickselect(v, v.size()/2)`，常用于统计学、图像处理、流式数据的分位数估计。
- **Top K 问题**：找到第 k 小的元素后，序列中该元素左侧即为最小的 k 个元素（但不一定有序）。这比完全排序 \(O(n \log n)\) 或堆方法 \(O(n \log k)\) 更优，尤其是当 k 接近 n/2 时。
- **K 分之一位数（Quantile）**：可反复使用快速选择找出多个分位点。
- **作为其他算法的子程序**：如 **BFPRT 线性时间选择算法**，最短路快速选择，或一些数据分块算法。

---

### 9. 与其他选择算法的对比

| 算法               | 平均时间 | 最坏时间 | 额外空间 | 备注 |
|--------------------|----------|----------|----------|------|
| 快速选择（随机化） | \(O(n)\) | \(O(n^2)\)（极低概率）| \(O(1)\) | 实用首选 |
| BFPRT 算法         | \(O(n)\) | \(O(n)\) | \(O(\log n)\)? | 理论最优，实现复杂 |
| 排序后取第 k       | \(O(n \log n)\) | \(O(n \log n)\) | \(O(1)\) 或 \(O(n)\) | 简单但浪费 |
| 最小堆（k 固定）   | \(O(n \log k)\) | \(O(n \log k)\) | \(O(k)\) | 适合 k 很小 |
| 最大堆（全量）     | \(O(k \log n)\)? | 不常用 | — | — |

通常情况下，**随机化快速选择**是实际工程中最常用的平衡解。

---

### 10. 总结

快速选择算法是分治思想在选择问题上的精妙应用。它继承了快速排序的划分逻辑，却通过单边递归将平均复杂度降至线性。通过随机化可以基本避免最坏退化，而结合 BFPRT 又可获得理论保证。其原地迭代版本空间开销极小，是解决“无需全排序，只求第 k 小”问题的利器。在实际开发中，C++ STL 的 `std::nth_element` 就是快速选择的典型工业实现，采用 Introselect（快速选择 + 堆排序兜底）来同时保证平均性能和最坏时间复杂度。

## upper_bound & lower_bound

`std::lower_bound` 和 `std::upper_bound` 是 C++ 标准库中基于**二分查找**的算法，定义在 `<algorithm>` 头文件中。它们用于在**已排序**的序列中快速定位元素，是对数复杂度的高效工具。下面从原理、接口、用法到高级技巧全面介绍。

---

### 1. 核心定义

在一个**升序排列**的区间 `[first, last)` 中，给定一个值 `value`：

| 函数          | 返回的迭代器指向                         | 含义（区间升序）         |
|---------------|-------------------------------------------|--------------------------|
| `lower_bound` | 第一个 **大于等于** `value` 的元素       | 不小于 `value` 的起始点  |
| `upper_bound` | 第一个 **严格大于** `value` 的元素       | 大于 `value` 的起始点    |

**图示**（升序数组）：
```
元素:    1   2   2   3   4   4   5
下标:    0   1   2   3   4   5   6
查找 value = 4:
  lower_bound → 下标 4 (元素4)
  upper_bound → 下标 6 (元素5)
查找 value = 2:
  lower_bound → 下标 1 (第一个2)
  upper_bound → 下标 3 (第一个大于2的元素，即3)
查找 value = 6:
  lower_bound / upper_bound → 下标 7 (end())
```

> 如果 `value` 大于序列中所有元素，则两个函数都返回 `last`。

---

### 2. 函数签名

```cpp
// 使用 operator< 进行默认比较
template< class ForwardIt, class T >
ForwardIt lower_bound( ForwardIt first, ForwardIt last, const T& value );

template< class ForwardIt, class T >
ForwardIt upper_bound( ForwardIt first, ForwardIt last, const T& value );

// 使用自定义比较函数 comp，要求 comp(element, value) 为严格弱序
template< class ForwardIt, class T, class Compare >
ForwardIt lower_bound( ForwardIt first, ForwardIt last, const T& value, Compare comp );

template< class ForwardIt, class T, class Compare >
ForwardIt upper_bound( ForwardIt first, ForwardIt last, const T& value, Compare comp );
```

- `first, last`：已排序的区间（前闭后开）。
- `value`：要查找的值。
- `comp`：二元谓词，当第一个参数应排在第二个参数**之前**（即严格小于）时返回 `true`。对于 `lower_bound`，它寻找第一个使 `comp(element, value)` 为 `false` 的位置；对于 `upper_bound`，寻找第一个使 `comp(value, element)` 为 `true` 的位置（即 `value < element`）。

**返回值**：`ForwardIt`，指向目标位置的迭代器；若所有元素都不满足条件，返回 `last`。

---

### 3. 使用前提

- 区间 **必须根据相同的比较逻辑有序**。例如默认 `operator<` 时，元素必须按升序排列。若使用 `comp`，区间必须按 `comp` 排序（即所有满足 `comp(element, value)` 的元素在不满之前）。
- 如果区间未排序，调用行为是**未定义**的（通常结果错误）。
- 如果区间中存在与 `value` 等价的元素，`lower_bound` 和 `upper_bound` 能准确定位到其边界。

---

### 4. 时间复杂度

- **比较次数**：对于随机访问迭代器为 \(O(\log N)\)，对于其他迭代器（如 `std::set` 的迭代器）比较次数仍是对数，但前进步数是线性的（标准库中 `std::set` 有自己的成员函数 `lower_bound/upper_bound`，时间复杂度 \(O(\log N)\)）。
- 空间复杂度：\(O(1)\)，不需要额外内存。

---

### 5. 底层实现原理

二者均使用二分查找，但循环中判断分支略有不同。

**`lower_bound` 典型实现**：
```cpp
while (first < last) {
    auto mid = first + (last - first) / 2;
    if (*mid < value)      // 或者 comp(*mid, value)
        first = mid + 1;   // 目标在右半区
    else
        last = mid;        // 目标在左半区或就是 mid
}
return first;
```

**`upper_bound` 典型实现**：
```cpp
while (first < last) {
    auto mid = first + (last - first) / 2;
    if (!(value < *mid))   // 即 value >= *mid 或 !comp(value, *mid)
        first = mid + 1;   // 目标在右半区
    else
        last = mid;        // *mid > value，目标在左半区
}
return first;
```

两者配合可以高效求出**等于 `value` 的元素个数**：`upper_bound - lower_bound` 即为等价元素的数量（对于严格弱序定义下的“相等”）。

---

### 6. 常见用例与示例

#### 6.1 基本用法（升序数组）

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {1, 2, 2, 3, 4, 4, 5};
    
    auto lb = std::lower_bound(v.begin(), v.end(), 4);
    auto ub = std::upper_bound(v.begin(), v.end(), 4);
    
    std::cout << "lower_bound(4) at index: " << (lb - v.begin()) << '\n'; // 4
    std::cout << "upper_bound(4) at index: " << (ub - v.begin()) << '\n'; // 6
    std::cout << "number of 4s: " << (ub - lb) << '\n';                   // 2
}
```

#### 6.2 在降序数组中查找

需要传入比较函数，如 `std::greater<int>()`。

```cpp
std::vector<int> v = {5, 4, 4, 3, 2, 2, 1};
// 注意：区间按 greater 排序（降序），value 类型为 int
auto lb = std::lower_bound(v.begin(), v.end(), 4, std::greater<int>());
// lower_bound 此时寻找第一个 **不大于** 4 的元素（即第一个 <=4）
// 升序时：lower_bound 是第一个 >= value；降序时比较逻辑翻转，可理解为第一个 comp(element, value) 为 false 的位置。
// 实际效果：指向第一个 4 或更小的元素，即下标 1 处的 4。
// 更通用的记忆：lower_bound 返回第一个不满足“元素在 value 前”的位置。
```

#### 6.3 自定义结构体排序与查找

```cpp
struct Student {
    std::string name;
    int score;
};

// 按分数升序排列
std::vector<Student> students = {
    {"Alice", 80}, {"Bob", 90}, {"Cathy", 90}, {"David", 100}
};

// 查找第一个分数 >= 90 的学生
auto lb = std::lower_bound(students.begin(), students.end(), 90,
    [](const Student& s, int val) { return s.score < val; });
// 结果指向 Bob

// 查找第一个分数 > 90 的学生
auto ub = std::upper_bound(students.begin(), students.end(), 90,
    [](int val, const Student& s) { return val < s.score; });
// 结果指向 David
```

注意：`upper_bound` 的自定义比较签名是 `comp(value, element)`。上面传入的 lambda 正确表达了 `value < element` 的含义。

#### 6.4 检查元素是否存在

可以使用 `lower_bound` 加判断：
```cpp
auto it = std::lower_bound(v.begin(), v.end(), target);
if (it != v.end() && *it == target) {
    // 存在
}
```
或者直接用 `std::binary_search`。

---

### 7. `equal_range` 与两者的关系

`std::equal_range` 返回一个 `std::pair`，其 `first` 等同于 `lower_bound`，`second` 等同于 `upper_bound`。它是一次二分查找得到两个边界的便捷函数。

```cpp
auto [lb, ub] = std::equal_range(v.begin(), v.end(), value);
// lb == lower_bound, ub == upper_bound
```

---

### 8. C++20 中的 ranges 版本

C++20 引入了 range 适配，可以直接作用于容器，无需传递迭代器对，代码更简洁。

```cpp
#include <ranges>
#include <algorithm>

std::vector<int> v = {1, 2, 2, 3, 4};
auto it = std::ranges::lower_bound(v, 3);   // 返回迭代器
// 还有 std::ranges::upper_bound 等
```

同时也支持投影（projection）和自定义比较。

---

### 9. 注意事项与常见错误

- **未排序的序列**：绝对不要对无序序列使用这两个函数，结果未定义。
- **比较函数不一致**：排序和查找必须使用相同的比较逻辑，否则二分查找的前提被破坏。
- **`upper_bound` 的比较参数顺序**：自定义比较时，`upper_bound( first, last, value, comp )` 的 `comp` 应该接受 `(value, element)` 并返回 `true` 当 `value < element`。这和 `lower_bound` 的 `comp(element, value)` 参数顺序不同，容易写错。一个安全习惯：用 `equal_range` 或始终统一使用“元素与值比较”的 lambda，并通过调整参数位置来实现 upper_bound。
- **容器自带成员函数**：关联容器（`std::set`、`std::map` 等）拥有自己的 `lower_bound` 和 `upper_bound` 成员函数，它们利用内部红黑树结构，时间复杂度为 \(O(\log N)\) 且比泛型算法更快。对于这类容器，应优先使用成员函数。
- **严格弱序**：自定义比较必须满足严格弱序（类似 `<` 的性质），否则行为未定义。

---

### 10. 总结对比表

| 函数            | 条件（默认升序）               | 返回位置          |
|-----------------|--------------------------------|-------------------|
| `lower_bound`   | 第一个 `>= value`              | 插入到最左边保持序 |
| `upper_bound`   | 第一个 `> value`               | 插入到最右边保持序 |
| `binary_search` | 是否存在 `== value`            | `bool`            |
| `equal_range`   | `[lower_bound, upper_bound)`   | 等价元素范围       |

熟练掌握 `lower_bound` 和 `upper_bound` 是高效处理有序数据、实现插入位置查找、统计频次等操作的基础，也是理解二分查找思想的重要一步。

## vector capacity

C++ 的 `std::vector` 没有提供类似 `set_capacity()` 这样的直接方法，但可以通过几个成员函数和惯用法来**增加**或**减少**其容量，从而控制内存分配。下面从概念到技巧全面梳理。

---

### 1. 基本概念：`size` 与 `capacity`

- **`size()`**：容器中实际存储的元素个数。
- **`capacity()`**：容器当前已分配内存能容纳的元素总数（不重新分配的前提下最多可容纳多少元素）。

`capacity >= size` 恒成立。当插入新元素导致 `size > capacity` 时，vector 会自动重新分配一块更大的内存，并将原有元素拷贝/移动到新空间——这耗时且会使原有迭代器、指针、引用失效。

---

### 2. 查看当前容量

```cpp
std::vector<int> v;
std::cout << v.capacity() << '\n';   // 通常为 0
```

---

### 3. 增加容量：`reserve(n)`

`reserve(n)` **保证** vector 的 `capacity()` 至少为 `n`（如果 `n` 大于当前容量，则重新分配；否则**可能什么都不做**，标准不强制缩小）。

- **不会改变** `size()`，也不会添加元素。
- 如果发生重新分配，所有迭代器、指针、引用失效。
- 常用于**预分配**，避免后续插入时多次重新分配。

```cpp
std::vector<int> v;
v.reserve(1000);           // 容量至少 1000
for (int i = 0; i < 1000; ++i)
    v.push_back(i);        // 这 1000 次 push_back 不会引发重新分配
```

**注意**：
- `reserve(n)` 如果 `n <= capacity()` 则通常不做任何事（实现可能忽略，也可能收缩？标准不要求收缩，所以不能依赖它来减少容量）。
- 若 `n` 很大（如 `reserve(v.size() + 1)` 后马上 `shrink_to_fit()` ？），需合理预估，避免浪费内存。

---

### 4. 减少容量

#### 4.1 `shrink_to_fit()` （C++11 起）

**请求**容器释放未使用的多余内存，使得 `capacity()` 尽可能接近 `size()`。

- **非强制**：这是一个**请求**，具体实现可以选择忽略，依赖实现。
- 若发生重新分配，迭代器等失效；否则可能失效也可能不失效（若实现采用原地收缩则不失效，但极少）。

```cpp
std::vector<int> v(100);
v.resize(10);               // size = 10, capacity 仍可能为 100
v.shrink_to_fit();          // 请求 capacity 接近 10
```

#### 4.2 经典 `swap` 惯用法（C++11 之前及现在仍适用）

创建一个与 `v` 具有相同元素的**临时 vector**，然后与之交换。临时 vector 的容量恰等于其大小，交换后原 `v` 拥有该紧凑容量，临时对象被销毁。

```cpp
std::vector<int> v(100, 0);
v.resize(10);                       // 希望缩减容量
std::vector<int>(v).swap(v);       // 现在 v.capacity() == v.size()
```

**C++11 之后**同样可以用，而且 `shrink_to_fit` 内部通常也实现为类似操作。这种方式**保证**容量降低到 `size()`。

#### 4.3 `clear()` 不改变容量

```cpp
v.clear();      // size = 0, capacity 不变
```

若想清空同时释放内存，用 `clear()` + `shrink_to_fit()` 或与空 vector 交换：

```cpp
std::vector<int>().swap(v);     // v 变为空，capacity 通常为 0
// 或
v.clear();
v.shrink_to_fit();
```

---

### 5. 构造时“设置”容量

vector 的构造函数**不能直接指定 capacity**，只能指定初始 `size` 或提供元素范围。

- `vector<int> v(100)`：创建含有 100 个元素的 vector（全部为 0），`size = 100`，`capacity` 至少为 100。
- `vector<int> v; v.reserve(100)`：`size = 0`，`capacity >= 100`，适合后续 `push_back`。

如果既想预分配容量，又不想构造多余元素，先默认构造再 `reserve` 是最佳选择。

---

### 6. 其他影响容量的操作

- **`push_back` / `emplace_back` / `insert`**：若 `size == capacity` 则会触发扩容，通常容量增加为原来的两倍或类似因子（具体由实现决定）。
- **`resize(n)`**：
  - 若 `n > capacity()`，则会重新分配使容量至少为 `n`。
  - 若 `n <= capacity()`，`capacity()` 通常不变。
- **`assign`**：可能重新分配，取决于新元素数量和现有容量，但不保证会缩小容量。
- **移动构造 / 移动赋值**：源 vector 的容量通常被**偷走**（目标获得源的容量，源变成空，有的实现下源依然保留一些容量，但常见是源被清空容量为 0 或实现定义）。注意标准仅规定移动操作后源处于“有效但未指定状态”，一般使用前应重新 `reserve` 或确认。

---

### 7. 常用场景与最佳实践

| 目的                     | 方法                                        |
|--------------------------|---------------------------------------------|
| 预分配内存，避免反复分配 | `vec.reserve(N);`                           |
| 释放多余内存             | `vec.shrink_to_fit();` 或 `vector<T>(vec).swap(vec);` |
| 清空所有元素并释放内存   | `vector<T>().swap(vec);`                    |
| 构造后立即分配容量       | `vector<int> v; v.reserve(100);`            |

---

### 8. 示例代码综合演示

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    std::cout << "初始 capacity: " << v.capacity() << '\n';   // 0

    v.reserve(10);
    std::cout << "reserve(10) 后 capacity: " << v.capacity() << ", size: " << v.size() << '\n';  // 10, 0

    for (int i = 0; i < 5; ++i) v.push_back(i);
    std::cout << "插入5个元素后 capacity: " << v.capacity() << ", size: " << v.size() << '\n'; // 10, 5

    v.shrink_to_fit();
    std::cout << "shrink_to_fit 后 capacity: " << v.capacity() << '\n';   // 可能 >= 5

    // swap 惯用法精确缩减
    std::vector<int>(v).swap(v);
    std::cout << "swap 后 capacity: " << v.capacity() << '\n';            // 5

    // 彻底清空并释放内存
    std::vector<int>().swap(v);
    std::cout << "与空 vector 交换后 capacity: " << v.capacity() << '\n'; // 0
}
```

---

### 9. 注意事项

- **迭代器失效**：任何导致容量改变的操作（`reserve`、`shrink_to_fit` 等）都可能使所有迭代器、指针和引用失效。小心在循环中操作。
- **`shrink_to_fit` 的非强制性**：如果需要可靠地释放内存，请使用 swap 惯用法。
- **移动后的 vector**：移后源 vector 的容量未定义，不要依赖其值，使用前重新 `reserve` 或直接丢弃。
- **空间开销**：`vector<bool>` 特化特殊，`capacity` 和普通 `vector` 语义有差异，但一般讨论不涉及它。

掌握了 `reserve`、`shrink_to_fit` 和 swap 技巧，就能灵活控制 `vector` 的内存容量，既避免频繁分配提升性能，又能在需要时及时释放内存。

## iterator

在 C++ 中，反向迭代器 `std::reverse_iterator` 是一个**适配器**，它包装一个正向迭代器，使其遍历方向反转。要将一个正向迭代器转换为反向迭代器，通常使用 `std::reverse_iterator` 的构造函数或 `std::make_reverse_iterator`。但这个过程有许多关键细节，尤其是**迭代器类型要求**和**解引用的偏移关系**，下面详细展开。

---

### 1. 什么是反向迭代器？

`std::reverse_iterator<It>` 是一个迭代器适配器，它持有一个类型为 `It` 的**正向迭代器**（称为 `base`），并重载了 `operator*`、`operator++`、`operator--` 等，使得向“前”移动实际调用的是正向迭代器的向“后”移动。例如：
- `++rit` 会调用 `--base`；
- `--rit` 会调用 `++base`；
- `*rit` 返回的是 `*(base - 1)`（即正向迭代器前一个位置的值）。

因此，**所有反向迭代器的遍历都基于一个正向迭代器**。容器的 `rbegin()` 和 `rend()` 就是通过这种适配产生的：
- `rbegin()` 相当于 `std::reverse_iterator(end())`；
- `rend()` 相当于 `std::reverse_iterator(begin())`。

---

### 2. 必要条件：正向迭代器必须是双向迭代器

尽管模板参数常被命名为 `ForwardIt`，但 `std::reverse_iterator` **要求底层的正向迭代器至少是双向迭代器**（BidirectionalIterator），因为它需要在内部执行 `--` 操作。如果你的迭代器只是前向迭代器（如 `std::forward_list` 的迭代器），则无法构造 `reverse_iterator`，会导致编译错误。

```cpp
#include <forward_list>
#include <iterator>

std::forward_list<int> fl = {1,2,3};
// 编译错误：forward_list 的迭代器不支持 --
// std::reverse_iterator<std::forward_list<int>::iterator> rit(fl.end());
```

只有**双向或随机访问迭代器**（如 `std::list`、`std::vector`、`std::deque` 的迭代器，以及原生指针）才能生成反向迭代器。

---

### 3. 从正向迭代器构造反向迭代器

### 方法一：直接构造
```cpp
std::vector<int> v = {1, 2, 3, 4, 5};
auto it = v.begin() + 2;          // 指向元素 3

// 构造反向迭代器，传入正向迭代器
std::reverse_iterator<decltype(it)> rit(it);
// 或使用模板推导 (C++17 CTAD)
std::reverse_iterator rit2(it);
```

### 方法二：使用 `std::make_reverse_iterator` (C++14 起)
```cpp
auto rit = std::make_reverse_iterator(it);  // 自动推导类型
```

这两种方式完全等价，`make_reverse_iterator` 仅是为了便利和类型推导。

---

### 4. 核心陷阱：`base()` 与解引用偏移

这是最容易犯错的地方：**反向迭代器内部存储的正向迭代器（通过 `base()` 获取）并不指向反向迭代器“逻辑上”指向的那个元素**，而是指向该元素的**下一个位置**（正向次序中的下一个）。

更精确地说，若 `rit` 是一个反向迭代器，那么：
- `rit.base()` 返回内部正向迭代器；
- `*rit` 返回 `*(rit.base() - 1)`。

**为什么要这样设计？**  
这是为了保持“前闭后开”的半开区间约定。以 `rbegin()` 和 `rend()` 为例：
- `rbegin()` 的内部正向迭代器是 `end()`，其解引用得到的是最后一个元素 `*(end()-1)`。
- `rend()` 的内部正向迭代器是 `begin()`，表示反向遍历的终止位置（不包含 `begin()` 指向的元素）。

所以，如果你拿到了一个指向元素 `x` 的正向迭代器 `pos`，直接用它构造 `reverse_iterator(pos)`，那么**反向迭代器逻辑上指向的是 `x` 的前一个元素**，而不是 `x` 本身！

**示例**：
```cpp
std::vector<int> v = {10, 20, 30, 40, 50};
auto it = std::find(v.begin(), v.end(), 30);   // it 指向 30
auto rit = std::make_reverse_iterator(it);     // rit 内部存储 it，但逻辑指向 20
std::cout << *rit << '\n';                     // 输出 20！
```

如果你想从 `30` 开始反向遍历（包含 `30`），就需要让反向迭代器的内部正向迭代器指向 `30` 的**下一个位置**，即 `it + 1`：
```cpp
auto rit_from_30 = std::make_reverse_iterator(it + 1);  // 逻辑上指向 30
// 现在遍历：
while (rit_from_30 != v.rend())
    std::cout << *rit_from_30++ << ' ';   // 输出 30 20 10
```

**通用规则**：
- 若正向迭代器 `pos` 表示某个元素的开始位置，你希望反向遍历**包含**该元素，则传给 `reverse_iterator` 的参数应当是 `std::next(pos)`（或 `pos + 1` 对于随机迭代器）。
- 若 `pos` 就是 `end()`，则直接传 `end()` 就能得到 `rbegin()`，自然包含最后一个元素。
- 若 `pos` 是 `begin()`，则 `reverse_iterator(begin())` 等于 `rend()`，表示反向遍历的终点（不包含第一个元素）。

---

### 5. 完整示例：正向查找后反向输出

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>

int main() {
    std::vector<int> v = {5, 12, 8, 3, 7, 3, 21};

    // 正向查找第一个 3
    auto it = std::find(v.begin(), v.end(), 3);
    if (it == v.end()) return 1;

    // 我们希望从找到的 3（包含）开始反向输出直到 vector 开头
    // 因为反向迭代器内部需要指向元素的下一个位置，所以传入 it+1
    auto rit = std::make_reverse_iterator(it + 1);   // 逻辑指向第一个 3

    std::cout << "反向输出从第一个3开始: ";
    while (rit != v.rend()) {
        std::cout << *rit << ' ';
        ++rit;    // 注意 ++rit 是向“前”移动，即向容器头部方向
    }
    // 输出：3 8 12 5 （因为第一个3之前的元素是 8,12,5）

    return 0;
}
```

---

### 6. 反向迭代器转回正向迭代器

随时可以通过 `base()` 取回原始的正向迭代器：
```cpp
auto reverse_it = v.rbegin();       // 类型为 std::reverse_iterator<...>
auto forward_it = reverse_it.base(); // 得到 end() 迭代器
```
注意 `base()` 会反向偏移一次，所以 `rbegin().base() == end()`。

---

### 7. 总结

| 转换需求 | 代码 | 注意事项 |
|----------|------|----------|
| 正向迭代器 → 反向迭代器 | `std::reverse_iterator<It>(it)` 或 `std::make_reverse_iterator(it)` | `it` 必须是**双向迭代器**。反向迭代器逻辑上指向 `*(it-1)`。 |
| 希望反向遍历包含 `pos` 指向的元素 | 传入 `std::next(pos)` 或 `pos+1` | 否则会漏掉该元素。 |
| 从容器的正向迭代器获取反向视图 | 直接使用 `v.rbegin()`, `v.rend()` | 安全可靠，无需手动转换。 |
| 反向迭代器 → 正向迭代器 | `rit.base()` | 返回的内部迭代器是“下一个位置”。 |

反向迭代器是遍历有序容器的利器。理解其底层正向迭代器的偏移关系，是在算法中混合使用正反向迭代器的关键。

## GNU GCC bits/stdc++.h

`bits/stdc++.h` 是一个在竞赛编程和某些快速开发场景中广为人知的非标准 C++ 头文件。它不是 C++ 标准的一部分，而是 **GNU GCC 编译器提供的一个实现细节**。下面从原理、内容、优缺点、移植性、编译时影响等角度，对其做一次全面剖析。

---

### 1. 它是什么？

`bits/stdc++.h` 实质上是一个**预编译头文件的变体**，包含了几乎所有 C++ 标准库头文件。GCC 将其放在编译器安装路径的 `bits/` 子目录下，因此带上了 `bits/` 前缀。

其典型实现是一个长长的 `#include` 列表，将 `<iostream>`、`<vector>`、`<algorithm>`、`<string>`、`<map>`、`<set>` 等全部包含进来，同时为了兼容性，可能还会根据编译器版本定义一些宏来避免重复错误。

---

### 2. 它包含什么？

以下取自 GCC 12 中的典型内容（简化示意）：

```cpp
#ifndef _GLIBCXX_BITS_STDCXX_H
#define _GLIBCXX_BITS_STDCXX_H 1

#pragma GCC system_header

#include <cassert>
#include <cctype>
#include <cerrno>
#include <cfloat>
#include <ciso646>
#include <climits>
#include <clocale>
#include <cmath>
#include <csetjmp>
#include <csignal>
#include <cstdarg>
#include <cstddef>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <cwchar>
#include <cwctype>

// C++ 标准库头文件
#include <algorithm>
#include <any>
#include <array>
#include <atomic>
#include <barrier>
#include <bit>
#include <bitset>
#include <charconv>
#include <chrono>
#include <codecvt>
#include <compare>
#include <complex>
#include <concepts>
#include <condition_variable>
#include <coroutine>
#include <deque>
#include <exception>
#include <execution>
#include <expected>
#include <filesystem>
#include <format>
#include <forward_list>
#include <fstream>
#include <functional>
#include <future>
#include <initializer_list>
#include <iomanip>
#include <ios>
#include <iosfwd>
#include <iostream>
#include <istream>
#include <iterator>
#include <latch>
#include <limits>
#include <list>
#include <locale>
#include <map>
#include <memory>
#include <memory_resource>
#include <mutex>
#include <new>
#include <numbers>
#include <numeric>
#include <optional>
#include <ostream>
#include <queue>
#include <random>
#include <ranges>
#include <regex>
#include <scoped_allocator>
#include <semaphore>
#include <set>
#include <shared_mutex>
#include <source_location>
#include <span>
#include <sstream>
#include <stack>
#include <stdexcept>
#include <stop_token>
#include <streambuf>
#include <string>
#include <string_view>
#include <syncstream>
#include <system_error>
#include <thread>
#include <tuple>
#include <type_traits>
#include <typeindex>
#include <typeinfo>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <valarray>
#include <variant>
#include <vector>
// ... 还可能包含扩展如 <ext/...>
#endif
```

它几乎包含了 C++ 标准库（包括 C 标准库包装）的所有标准头文件，以及部分编译器扩展。文件本身很大，包含后会把几万行代码引入编译单元。

---

### 3. 为什么它在竞赛编程中流行？

1. **极速编码**：不需要逐个记忆和 `#include` 所需头文件，一行代码即可使用整个标准库，不会出现“忘记包含某个头文件导致编译错误”的问题。
2. **比赛环境兼容**：大多数在线判题系统（如 Codeforces、AtCoder、HDU 等）使用 GCC 编译器，默认包含该头文件，选手无需担忧移植问题。
3. **思维负担小**：专注于算法实现而非库的导入细节。

---

### 4. 主要缺点与潜在风险

#### 4.1 非标准，不可移植
`bits/stdc++.h` 是 GCC 的特有文件，**只存在于 GCC 编译环境**。在以下环境中编译会直接失败：
- MSVC（Visual Studio）
- Clang 如果不配合 GCC 的标准库（libstdc++），或者未特意提供该文件
- Apple Clang + libc++ 环境（macOS 默认）
- 其它非 GCC 工具链

一旦你需要将代码迁移到不同编译器或不同平台，就需要逐一替换为标准头文件。

#### 4.2 显著增加编译时间
包含 `bits/stdc++.h` 会一次性展开大量头文件（超过几十万行代码），每次编译都要处理所有这些符号，导致编译极慢。即使你只使用了 `std::vector`，也会把所有标准库的声明都拉进来，严重影响增量编译和构建速度。

#### 4.3 命名污染
该头文件将整个 `std` 命名空间（甚至某些内部名字）暴露在全局作用域，可能导致意料之外的命名冲突。虽然标准库名字多在 `std` 内，但宏（如 `max`/`min`）或 C 库遗留符号可能造成干扰。

#### 4.4 不利于工程实践
- 破坏了模块化原则，无法从包含的头文件明确看出代码的依赖。
- 在一些严格代码规范（如 MISRA、公司准则）中会被禁止。
- 无法利用 C++20 模块带来的隔离优势（该头文件本身依然基于古老的文本包含模型）。

#### 4.5 版本依赖与内部实现可能变更
既然不是标准，GCC 随时可能修改或移除该文件（尽管概率极低）。事实上，GCC 开发人员曾多次表示它只是一个内部快捷方式，不保证稳定性。

---

### 5. 与标准预编译头、模块的对比

| 特性 | `bits/stdc++.h` | 标准预编译头 (PCH) | C++20 模块 |
|------|----------------|-------------------|------------|
| 是否标准 | 否 | 编译器扩展支持 | 是 (C++20) |
| 编译速度 | 极慢（全量包含） | 可快（预编译缓存） | 快（符号隔离） |
| 可移植性 | 仅 GCC | 依赖编译器 | 理论上跨编译器 |
| 显式依赖 | 无 | 无（由构建系统管理） | 显式 `import` |
| 污染风险 | 高 | 中 | 低 |

在真正的软件开发中，若想提升编译速度，应使用预编译头（包含常用的标准库头文件，如 `<vector>`, `<string>` 等）或 C++20 模块，而不是依赖这个非标准的大杂烩。

---

### 6. 能否在 Windows 上使用？

如果你在 Windows 上使用 **MinGW-w64** 或 **Cygwin**（它们都基于 GCC + libstdc++），那么 `bits/stdc++.h` 是可用的。但在 Visual Studio（MSVC）中无法直接使用。有些使用者会手动创建一个同名文件，放入搜索路径，内容仿照 GCC 版本，但这是**极不推荐**的做法，因为 MSVC 的标准库头文件结构不同，强行打包会导致各种宏重定义和编译错误。

---

### 7. 最佳实践建议

- **竞赛编程**：如果确定判题环境为 GCC 且时间宽松，可以使用。但注意某些比赛已经开始限制其使用（如 Google Code Jam 在某些规则中提醒不要依赖）。
- **日常练习 / 算法学习**：也可以使用它快速测试想法，但建议在养成习惯后逐步转换为显式包含必要的标准头文件。
- **工程与生产代码**：**严禁使用**。应该遵循 `include what you use` 原则，每个源文件只包含实际用到的标准库头文件。
- **替代方案**：可以自己维护一个项目级的 `common.hpp` 或预编译头，包含常用头文件（`<bits/stdc++.h>` 的极度精简版），但务必明确此头文件是项目的一部分，不涉及系统私有路径。

---

### 8. 示例与总结

竞赛常见写法：
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<int> a = {3, 1, 4, 1, 5};
    sort(a.begin(), a.end());
    // ...
}
```

推荐的标准写法：
```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> a = {3, 1, 4, 1, 5};
    std::sort(a.begin(), a.end());
    // ...
}
```

**结论**：`bits/stdc++.h` 是 GCC 赠送的一把双刃剑，它带来了便利的编码体验，但以牺牲可移植性、编译速度和工程清晰度为代价。理解它的本质，在合适的场合谨慎使用，并清楚它的局限，才是明智的态度。

## Compiler

常用的 C/C++ 编译环境涵盖编译器、集成开发环境（IDE）、轻量级编辑器配合构建工具，以及在线平台。不同的操作系统和项目需求会对应不同的选择，以下按类别逐一介绍。

---

### 1. 主流编译器工具链

这是编译环境的核心，将源代码变成可执行程序。三大主力：

- **GCC (GNU Compiler Collection)**  
  Linux 上的标准 C/C++ 编译器（命令 `gcc` / `g++`）。在 Windows 上可通过 **MinGW-w64**（提供原生 Windows 二进制）或 **Cygwin**（模拟 POSIX 环境）使用。特点是成熟、标准支持及时，几乎所有开源项目默认兼容。

- **Clang / LLVM**  
  macOS 的默认编译器（命令 `clang` / `clang++`）。前端 Clang 提供极清晰的错误和警告信息，编译速度快；后端 LLVM 擅长优化。它跨平台，Windows 上也能配合 MSVC 或 MinGW 的库使用。许多现代化项目（如 Chromium、Firefox）都用它编译。

- **MSVC (Microsoft Visual C++)**  
  Windows 原生编译器，集成在 Visual Studio 或独立的 **Build Tools** 中。命令为 `cl.exe`。对 Windows API 支持最佳，是开发 Windows 桌面应用、游戏（DirectX）的首选。

此外，还有 **Intel oneAPI DPC++/C++ Compiler**（前身是 ICC，现基于 LLVM，在 Intel 硬件上优化强）等，但日常使用较少。

---

### 2. 集成开发环境（IDE）

提供代码编辑、调试、编译、项目管理的一体化图形界面。

- **Visual Studio (Windows)**  
  被誉为 Windows 上最强大的 C++ IDE。社区版免费，功能包含高级调试器、性能分析器、图形化界面设计器。编译器为 MSVC，但也支持安装 Clang/LLVM 工具集。适合大型项目、Windows 平台开发。

- **CLion (跨平台)**  
  JetBrains 出品，智能代码补全、重构、一站式调试。它强制使用 **CMake** 构建系统。商业软件，有面向学生和开源项目的免费许可。适合跨平台 C++ 项目。

- **Qt Creator (跨平台)**  
  主要围绕 Qt 框架，但也可以纯粹作为 C++ IDE 使用。内建对 CMake、qmake 的支持，自带 UI 设计器。免费开源，是开发图形界面程序的不错选择。

- **Eclipse CDT (跨平台)**  
  老牌 IDE，可通过插件管理。略显沉重，但在 Java 生态中仍有用户，对 C++ 支持尚可，能集成多种编译器。

- **Code::Blocks (跨平台)**  
  轻量级免费 IDE，安装包即可直接使用（自带 MinGW）。配置简单，适合初学者和中小型项目。

- **Dev-C++ (Windows)**  
  经典轻量 IDE，最初由 Bloodshed 开发，现由 **Orwell Dev-C++** 接手维护，集成了 MinGW。适合学习算法和入门教学，不适合大规模工程。

- **Xcode (macOS)**  
  苹果官方开发环境，用于开发 macOS/iOS 应用。编译器为 Clang，界面与苹果生态深度绑定。仅限 Mac 平台。

---

### 3. 轻量级编辑器 + 命令行工具

很多开发者偏好代码编辑器加自行配置编译调试环境。

- **Visual Studio Code (跨平台)**  
  安装 `C/C++` 或 `clangd` 扩展后，可提供智能提示、调试支持。配合 **CMake Tools** 插件，可直接调用 CMake 构建项目。底层编译器可任意选择（MSVC、GCC、Clang）。

- **Vim / Neovim** 与 **Emacs**  
  高级用户喜爱，通过插件（如 YouCompleteMe、coc.nvim）可实现 IDE 级功能。编译时在终端直接调用 `g++`、`make` 或 `cmake`。

- **其他**  
  Sublime Text、Atom 等也可配置 C++ 编译环境，但现在较少作为首选。

---

### 4. 在线编译环境

无需本地安装，浏览器中写代码并运行，适合快速测试、教学分享、代码片段调试。

- **Compiler Explorer (godbolt.org)**  
  神器，可同时使用多个编译器（不同版本）并即时查看生成的汇编代码，是理解编译优化的利器。

- **Replit / JDoodle / OnlineGDB / Wandbox**  
  支持多种语言，提供简单编辑界面，可直接运行。其中 **Wandbox** 支持众多编译器版本和 Boost 库，非常实用。

- **GitHub Codespaces / GitPod**  
  云端开发环境，提供完整的远程 Linux 容器，可自由配置任何编译工具链，相当于远程的 VS Code。

---

### 5. 构建系统与包管理器（编译环境的重要补充）

现代 C++ 开发离不开构建系统和依赖管理。

- **CMake**：事实上的跨平台标准，大多数 IDE 和编辑器直接支持。
- **Make / Ninja**：更底层的构建执行器，常由 CMake 生成。
- **MSBuild**：Visual Studio 的构建引擎。
- **vcpkg / Conan**：C++ 包管理器，帮你轻松安装和管理第三方库（如 Boost、OpenSSL），与 CMake、MSBuild 等良好集成。

---

### 总结与选择建议

| 用户场景 | 推荐编译环境 |
|----------|--------------|
| Windows 初学者 / 学生 | **Visual Studio Community** 或 **Code::Blocks** + MinGW |
| Linux 开发者 | 系统自带 GCC + **VS Code** / **Vim** + CMake |
| macOS 开发者 | Xcode（若开发苹果应用），或 **CLion** / **VS Code** + Clang |
| 跨平台项目 | **CLion** + CMake，或 **VS Code** + 相应编译器 |
| 追求极致性能或底层优化 | **Compiler Explorer** 搭配 GCC/Clang/MSVC 比较汇编 |
| 快速线上测试 | **Wandbox** 或 **Godbolt** |

“编译环境”并不只是编译器，而是**编译器 + 编辑器/IDE + 构建系统 + 调试器**的集合。根据你的平台和项目复杂度，选择顺手且生态良好的组合即可。

## Clang


## split

C++ 标准库不像 Python 或 Java 那样提供一个内建的 `split` 函数，但由于字符串处理的灵活性，有多种方式可以实现字符串分割，并且现代 C++ 标准（C++17/20）提供了越来越便捷和高效的工具。下面从传统的标准库方法到 C++20 的现代方案全面介绍。

---

### 1. 使用 `std::string::find` + `substr`（最经典的手工实现）

这种写法适用于所有 C++ 版本，可以精确控制分隔逻辑。

```cpp
#include <string>
#include <vector>
#include <iostream>

std::vector<std::string> split(const std::string& s, char delimiter) {
    std::vector<std::string> tokens;
    size_t start = 0;
    size_t pos = s.find(delimiter);
    while (pos != std::string::npos) {
        tokens.push_back(s.substr(start, pos - start));
        start = pos + 1;
        pos = s.find(delimiter, start);
    }
    tokens.push_back(s.substr(start)); // 最后一段
    return tokens;
}

// 使用示例
// std::string s = "one,two,three";
// auto v = split(s, ',');
// v -> {"one", "two", "three"}
```

**特点**：
- 逻辑清晰，完全可控。
- 性能较好（仅遍历一次字符串），且不依赖高级特性。
- 可轻松改造为支持**多字符分隔符**或**空白分隔**。

---

### 2. 使用 `std::istringstream` + `std::getline`

将字符串包装成流，利用 `getline` 按分隔符读取，语法简洁。

```cpp
#include <sstream>
#include <string>
#include <vector>

std::vector<std::string> split(const std::string& s, char delimiter) {
    std::vector<std::string> tokens;
    std::istringstream iss(s);
    std::string token;
    while (std::getline(iss, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}
```

**注意**：这种方法对于**末尾带分隔符**会丢失空字符串，例如 `"a,b,"` 默认只得到 `{"a", "b"}`，若需保留空段，需要额外处理。

---

### 3. 使用 `std::regex_token_iterator`（支持正则分隔符）

C++11 引入的正则库提供了强大的分割功能，尤其适用于分隔符较复杂（如多个空白、标点组合）的场景。

```cpp
#include <regex>
#include <string>
#include <vector>

std::vector<std::string> split(const std::string& s, const std::regex& sep = std::regex{"\\s+"}) {
    std::vector<std::string> tokens(
        std::sregex_token_iterator(s.begin(), s.end(), sep, -1),
        std::sregex_token_iterator()
    );
    return tokens;
}

// 使用：auto v = split("hello  world \t foo");  -> {"hello","world","foo"}
```

- 第四个参数 `-1` 表示提取分隔符之间的子序列。
- 可以传入正则表达式，如 `std::regex("[,\\s]+")` 表示逗号或空白。
- 性能相比前两种方法略低，但优势在于表达能力。

---

### 4. C++17：利用 `std::string_view` 避免拷贝

`std::string_view` 可以持有字符串的“视图”，分割后的结果可以不拷贝原始字符串，大幅提高效率。

```cpp
#include <string_view>
#include <vector>
#include <iostream>

std::vector<std::string_view> split(std::string_view sv, char delimiter) {
    std::vector<std::string_view> tokens;
    size_t pos = 0;
    while (pos < sv.size()) {
        size_t next = sv.find(delimiter, pos);
        if (next == std::string_view::npos) {
            tokens.push_back(sv.substr(pos));
            break;
        }
        tokens.push_back(sv.substr(pos, next - pos));
        pos = next + 1;
    }
    return tokens;
}
```

**注意**：返回的 `string_view` 集合仅在原始字符串存在期间有效，不能超出原字符串的生命周期。

---

### 5. C++20：`std::ranges::split_view` / `views::split`

C++20 引入了 ranges 库，可以直接对字符串进行惰性分割，不生成中间容器。

```cpp
#include <iostream>
#include <ranges>
#include <string_view>

int main() {
    std::string_view sv = "one,two,three";
    auto delimiter = ',';

    for (auto word : sv | std::views::split(delimiter)) {
        // word 是一个 ranges::subrange，可以用 std::string_view 封装
        std::string_view part(word.begin(), word.end());
        std::cout << part << '\n';
    }
}
```

- 完全惰性：不创建临时 vector。
- 返回的是 subrange，可以手动构造 `std::string_view` 或 `std::string`。
- 分隔符可以是单个字符、字符数组或另一个 range。

**转为传统容器**（若需要随机访问）：
```cpp
auto splitted = sv | std::views::split(',') 
                   | std::views::transform([](auto r) { 
                        return std::string_view(r.begin(), r.end()); 
                     });
std::vector<std::string_view> v(splitted.begin(), splitted.end());
```

---

### 6. 使用 Boost 库：`boost::split`

如果项目已经使用了 Boost，`boost::algorithm::split` 是最直接的解决方案。

```cpp
#include <boost/algorithm/string.hpp>
#include <string>
#include <vector>

std::string s = "one,two,three";
std::vector<std::string> tokens;
boost::split(tokens, s, boost::is_any_of(","));
// tokens: {"one", "two", "three"}
```

- 支持灵活的分隔谓词（`is_any_of`, `is_space` 等）。
- 可以用 `boost::token_compress_on` 选项忽略连续分隔符。

---

### 7. C 风格：`std::strtok`

不推荐在现代 C++ 中使用，因为它修改原始字符串（需要可写缓冲区），且非线程安全。

```cpp
#include <cstring>
#include <vector>
#include <string>

char s[] = "one,two,three";  // 必须可修改
std::vector<std::string> tokens;
for (char* p = strtok(s, ","); p; p = strtok(nullptr, ",")) {
    tokens.push_back(p);
}
```

---

### 8. 各方法对比

| 方法                     | 标准版本 | 是否拷贝 | 支持正则分隔 | 性能   | 易用性 |
|--------------------------|----------|----------|--------------|--------|--------|
| `find` + `substr`        | C++98    | 是       | 需自己实现   | 高     | 中     |
| `stringstream` + `getline` | C++98  | 是       | 否           | 中     | 高     |
| `regex_token_iterator`   | C++11    | 是       | 是           | 较低   | 高     |
| `string_view` + `find`   | C++17    | 视图     | 否           | 极高   | 中     |
| `ranges::split_view`     | C++20    | 视图/惰性| 否           | 高     | 高     |
| `boost::split`           | 第三方   | 是       | 灵活谓词     | 高     | 极高   |
| `strtok`                 | C 标准   | 原地修改 | 否           | 高     | 低（危险） |

---

### 9. 推荐策略

- **C++17 前**，并且不需要正则：使用 `find` + `substr` 手写，或 `getline` 简写。
- **C++17 及以上**，追求零拷贝：使用 `std::string_view` 自定义分割。
- **C++20**，代码简洁性与惰性求值：直接使用 `std::views::split`。
- **分隔符复杂**（如正则）：使用 `std::sregex_token_iterator`。
- **已在项目中引入 Boost**：`boost::split` 是最佳选择。

对于大多数日常需求，简单封装一个 `find` + `substr` 或 `string_view` 版本就足够高效，且不依赖外部库。如果你需要处理空串保留、多个连续分隔符等细节，可以在循环中稍加判断，非常灵活。

## isdigit & isalpha

C 和 C++ 提供了 `isdigit` 与 `isalpha` 这两个字符分类函数，它们定义在 `<ctype.h>`（C）或 `<cctype>`（C++）中。尽管看似简单，但正确使用它们涉及参数类型、编码安全性、本地化等一系列细节，下面全面解析。

---

### 1. 函数原型

```c
// C 语言 <ctype.h>
int isdigit(int ch);
int isalpha(int ch);
```

```cpp
// C++ <cctype>
int isdigit(int ch);
int isalpha(int ch);
```

参数 `ch` 的类型是 `int`，**不是** `char`。这是历史原因形成的，因为它们需要能够容纳 `unsigned char` 的所有取值以及特殊值 `EOF`（通常为 -1）。

---

### 2. 函数功能与返回值

#### 2.1 `isdigit`
- **功能**：检查参数 `ch` 是否是一个**十进制数字字符**（即 `'0'`～`'9'`）。
- **返回值**：如果 `ch` 是数字字符，返回一个**非零值**（通常是 1，但不保证）；否则返回 0。

在默认的 `"C"` 语言环境下，只有字符 `'0'`（ASCII 48）到 `'9'`（ASCII 57）会使 `isdigit` 返回真。其他任何值，包括字母、标点、EOF 等，都返回 0。

#### 2.2 `isalpha`
- **功能**：检查参数 `ch` 是否是一个**字母字符**。
- **返回值**：若为字母，返回非零值；否则返回 0。

在 `"C"` 语言环境下，字母包括大写字母 `'A'`～`'Z'`（ASCII 65~90）和小写字母 `'a'`～`'z'`（ASCII 97~122）。其他语言环境可能将带变音符号的字符（如 `'é'`、`'ü'`）也视为字母，具体依赖 locale 设置。

---

### 3. 参数的正确传递方式（重要！）

`isdigit` 和 `isalpha` 的形参类型是 `int`，但能接受的合法值是**范围在 `unsigned char` 内的整数值**或**宏 `EOF`**。  
如果你直接传入一个 `char` 类型的变量，而 `char` 在平台上是带符号的（如 x86 GCC），那么负数（如 0x80 以上的字节）会被符号扩展为负 `int`，这时函数的行为是**未定义的**。

**安全的调用方式**：
```cpp
char c = '0';
if (isdigit(static_cast<unsigned char>(c))) {
    // ...
}
```
或
```cpp
if (isdigit(static_cast<unsigned char>(c))) ...
```

如果从文件中读取字符，使用 `fgetc` 之类的函数返回 `int`，它会返回 `unsigned char` 范围的数值或 `EOF`，这时可直接传递给这些函数：
```c
int ch = fgetc(fp);
if (isdigit(ch)) { ... }   // 安全，因为 ch 已经是 unsigned char 或 EOF
```

**错误的例子**（可能导致未定义行为）：
```cpp
char c = 'é';  // 在 UTF-8 编码下可能为负值
if (isdigit(c)) { ... }  // 未定义行为！
```

---

### 4. C++ 中的两个版本：C 库函数与 `std::locale` 版本

除了继承自 C 的 `<cctype>` 全局函数外，C++ 还提供了面向对象的本地化版本：

```cpp
#include <locale>

bool std::isdigit(char ch, const std::locale& loc);
bool std::isalpha(char ch, const std::locale& loc);
```
- 参数是 `char`，不再是 `int`。
- 返回 `bool`，更直观。
- 可以传入不同的 `locale` 对象，例如支持中文、德语等本地化判断。

使用示例：
```cpp
#include <locale>
#include <iostream>

int main() {
    std::locale loc("de_DE.UTF-8");
    char c = 'ä';
    if (std::isalpha(c, loc)) {
        std::cout << c << " 是字母\n";  // 在德语 locale 下输出
    }
}
```

---

### 5. 相互关系与组合

- `isdigit(c)` 只认数字，`isalpha(c)` 只认字母。
- `isalnum(c)` 等价于 `isalpha(c) || isdigit(c)`。
- `isxdigit(c)` 检查十六进制数字（0-9, A-F, a-f），包含了 `isdigit` 的范围，另加大写 A-F 和小写 a-f。

常见字符分类函数一览（均需相同安全转换）：

| 函数        | 检查内容（C locale）                    |
|-------------|-----------------------------------------|
| `isdigit`   | 十进制数字 `'0'`-`'9'`                 |
| `isalpha`   | 大写字母和小写字母                      |
| `isalnum`   | 字母或数字（`isalpha` \|\| `isdigit`）  |
| `isxdigit`  | 十六进制数字                            |
| `isspace`   | 空白字符（空格、换行、制表等）          |
| `isupper`   | 大写字母                                |
| `islower`   | 小写字母                                |
| `ispunct`   | 标点符号                                |
| `isprint`   | 可打印字符（含空格）                    |
| `isgraph`   | 可打印字符（不含空格）                  |
| `iscntrl`   | 控制字符                                |

---

### 6. 实际应用示例

#### 6.1 验证字符串是否为纯数字

```cpp
#include <cctype>
#include <string>
#include <algorithm>

bool is_all_digits(const std::string& str) {
    return !str.empty() && std::all_of(str.begin(), str.end(),
        [](unsigned char c) { return std::isdigit(c); });
}
```

#### 6.2 统计字符串中字母和数字的个数

```cpp
#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string s = "Hello 2024!";
    int letters = 0, digits = 0;
    for (char c : s) {
        if (std::isalpha(static_cast<unsigned char>(c))) ++letters;
        else if (std::isdigit(static_cast<unsigned char>(c))) ++digits;
    }
    std::cout << "字母: " << letters << ", 数字: " << digits << '\n';
    // 输出: 字母: 5, 数字: 4
}
```

#### 6.3 从流中安全读取并判断

```cpp
#include <cstdio>
#include <cctype>

int main() {
    int ch;
    while ((ch = std::getchar()) != EOF) {
        if (std::isdigit(ch))
            std::putchar('D');
        else if (std::isalpha(ch))
            std::putchar('A');
        else
            std::putchar(ch);
    }
}
```

#### 6.4 使用 C++ locale 实现本地化

```cpp
#include <iostream>
#include <locale>

int main() {
    std::locale loc(""); // 用户默认 locale
    std::string test = "Fiancée 99";
    for (char c : test) {
        if (std::isalpha(c, loc))
            std::cout << c << " is alpha\n";
        else if (std::isdigit(c, loc))
            std::cout << c << " is digit\n";
    }
}
```

---

### 7. 常见陷阱与注意事项

- **不要对 `char` 直接调用**：始终通过 `unsigned char` 转换或确保值是 0~127 范围内（纯 ASCII）。
- **返回值不是 `bool`**：C 版函数返回非零/零，不要写 `if (isdigit(c) == true)`，直接使用 `if (isdigit(c))` 或 `if (isdigit(c) != 0)`。
- **EOF 的处理**：若传入 `EOF`，函数返回 0，表示既不是数字也不是字母，这合乎预期。
- **多字节编码**：`isdigit`/`isalpha` 只能处理单字节字符。在 UTF-8 等多字节编码下，一个字符可能由多个字节组成，单独检查每个字节没有意义。此时应考虑使用 C++ locale 或第三方库（如 ICU）。
- **宽字符版本**：C 标准库还有 `iswdigit`、`iswalpha`，用于 `wint_t` 类型的宽字符，头文件 `<wctype.h>` / `<cwctype>`。

---

### 8. 总结

`isdigit` 和 `isalpha` 是字符分类的基础设施，功能单一但须小心使用：
- 参数类型 `int`，只接受 `unsigned char` 或 `EOF`；
- 返回值非零代表真，零代表假；
- 在 C++ 中可通过 `std::locale` 获得更丰富且安全的本地化支持；
- 性能极佳，通常以查表实现。

掌握其用法和边界条件，可以避免许多潜在的移植性 bug 和未定义行为。

## s.find

`std::string::find` 是 C++ 中 `std::string` 类的核心成员函数，用于在字符串内**正向搜索**子串或字符。其功能强大、重载丰富，几乎涵盖了所有常见的查找需求。下面从函数签名、参数、返回值、使用示例、性能特征到高级技巧进行全面讲解。

---

### 1. 基本概念

`find` 在字符串中从前向后查找**第一次出现**的目标（子串、字符或字符数组），返回一个 `std::string::size_type` 类型的索引（通常是 `size_t`）。如果未找到，则返回一个特殊常量 `std::string::npos`。

**函数定义**（以 C++17 为例）：
```cpp
// 1. 查找子串
size_type find(const basic_string& str, size_type pos = 0) const noexcept;
// 2. 查找 C 风格字符串
size_type find(const char* s, size_type pos, size_type count) const;
// 3. 查找 C 风格字符串（完整长度）
size_type find(const char* s, size_type pos = 0) const;
// 4. 查找单个字符
size_type find(char ch, size_type pos = 0) const;
// 5. 查找 string_view（C++17）
size_type find(std::string_view sv, size_type pos = 0) const noexcept;
```

> 注意：`basic_string` 是 `string` 的模板基类（`std::string` 就是 `std::basic_string<char>`）。上面签名适用于 `std::string`。

---

### 2. 参数详解

| 重载 | 参数 | 含义 |
|------|------|------|
| `find(str, pos)` | `str`：要搜索的 `string` 子串；`pos`：开始搜索的位置（默认为 0）| 从 `pos` 处开始查找与 `str` 完全匹配的子串 |
| `find(s, pos, count)` | `s`：指向字符数组的指针；`count`：要比较的字符个数；`pos`：起始位置 | 用 `s` 的前 `count` 个字符构造一个临时“子串”，然后查找 |
| `find(s, pos)` | `s`：以空字符结尾的 C 字符串；`pos`：起始位置 | 等价于 `find(s, pos, Traits::length(s))` |
| `find(ch, pos)` | `ch`：单个字符；`pos`：起始位置 | 查找第一次出现字符 `ch` 的位置 |
| `find(sv, pos)` (C++17) | `sv`：`std::string_view`；`pos`：起始位置 | 无需构造临时 `string`，避免拷贝 |

**`pos` 参数**：表示搜索的起始索引，必须在 `[0, size()]` 范围内。若 `pos == size()`，则搜索范围为 `[size(), size())`（空范围），此时 `find` 永远返回 `npos`。若 `pos > size()`，C++17 前为未定义行为，C++17 起改为**始终返回 `npos`**（更安全）。

---

### 3. 返回值

- **成功**：返回第一个匹配子串/字符的起始索引（`size_type`）。
- **失败**：返回 `std::string::npos`。`npos` 是一个静态常量，定义为 `-1`（转换为 `size_type` 即最大可能值）。

检查是否找到的惯用写法：
```cpp
if (s.find("abc") != std::string::npos) {
    // 找到了
}
```
因为 `npos` 是一个很大的无符号数，不能直接与 0 或 `true`/`false` 比较。

---

### 4. 基本使用示例

```cpp
#include <string>
#include <iostream>

int main() {
    std::string str = "Hello, world! Hello, universe!";

    // 1. 查找子串
    auto pos1 = str.find("Hello");        // 返回 0
    auto pos2 = str.find("Hello", 1);     // 从索引 1 开始找，返回 14

    // 2. 查找单个字符
    auto pos3 = str.find('w');            // 返回 7
    auto pos4 = str.find('z');            // 返回 npos

    // 3. 查找 C 字符串部分长度
    auto pos5 = str.find("world!", 0, 3); // 只比较 "wor"，返回 7

    // 4. C++17 string_view 避免拷贝
    std::string_view sv = "universe";
    auto pos6 = str.find(sv);             // 返回 21

    // 检查
    if (pos4 == std::string::npos)
        std::cout << "字符 'z' 未找到\n";
}
```

---

### 5. 搜索方向与边界

`find` 是**正向**搜索（从左到右）。若需要反向搜索，应使用 `rfind`。

当 `pos` 不为 0 时，搜索区间为 `[pos, size())`。注意：搜索时考虑的子串可以**跨越 `pos` 之后的所有字符**，但 `pos` 是起始检查点。例如：
```cpp
std::string s = "abcabc";
s.find("abc", 1);   // 返回 3，不是 0，因为从索引1开始检查，跳过第一个abc
```

---

### 6. 查找空字符串的特殊行为

无论什么版本，查找**空字符串**时行为一致：**空字符串被认为在任何位置都能找到**，包括 `pos == size()` 时。
- `s.find("", pos)` 返回 `pos`（如果 `pos <= size()`）；否则（`pos > size()`）C++17 起返回 `npos`。
- `s.find(std::string_view{}, pos)` 同样返回 `pos`。
- `s.find('a', pos)` 中的 `'a'` 不是空，自然不受此规则影响。

示例：
```cpp
std::string s = "test";
auto p1 = s.find("");        // 返回 0
auto p2 = s.find("", 2);     // 返回 2
auto p3 = s.find("", 4);     // 返回 4
auto p4 = s.find("", 5);     // C++17前UB，C++17后返回npos
```

---

### 7. 性能与时间复杂度

- **最坏情况**：无优化时是 \(O(N \cdot M)\)，其中 `N = size()`，`M` 为子串长度。很多标准库实现使用了优化的搜索算法（如双向搜索、Boyer-Moore 的简化版、SSE 加速等），但对一般短子串仍是朴素匹配。
- **C++17 引入的 `std::boyer_moore_searcher`**：可以配合 `std::search` 使用更高性能的搜索，但不直接作用于 `find`。这意味着 `find` 在极致性能要求下可能不是最优选择。
- **常见实践**：`find` 的单字符版本通常非常快（直接遍历，可利用 SIMD 指令），子串版本对于中等长度也能胜任，通常无须过早优化。

---

### 8. 相关函数族

与 `find` 同一系列的还有其他成员函数，它们共享相似的接口：

| 成员函数 | 搜索方向 | 说明 |
|----------|----------|------|
| `find` | 正向 | 查找第一次出现 |
| `rfind` | 反向 | 查找最后一次出现（参数类似） |
| `find_first_of` | 正向 | 查找参数中**任意字符**第一次出现的位置 |
| `find_last_of` | 反向 | 查找参数中任意字符最后一次出现的位置 |
| `find_first_not_of` | 正向 | 查找第一个**不在参数中**的字符 |
| `find_last_not_of` | 反向 | 查找最后一个不在参数中的字符 |

这些函数都支持 `pos` 参数（对 `rfind` 系列，`pos` 通常表示搜索的**右边界**，从该位置向左搜索）。

---

### 9. 与其他查找方式对比

- **`std::search`**：泛型算法，可用于任意容器，但通常比 `string::find` 慢（因为无法利用字符串的连续内存特性）。
- **`std::string_view::find`**：C++17 起 `string_view` 也有完全相同的 `find` 成员函数，可用来在不拷贝的情况下搜索另一个视图。
- **`std::regex_search`**：支持正则表达式，功能强大但性能开销大，适合复杂模式匹配。
- **手动循环 + 下标**：容易出错，不推荐，除非有特殊需求。

---

### 10. C++11/14/17 的变化小结

| C++版本 | 变化 |
|---------|------|
| C++98 | 最初的基本重载 |
| C++11 | 增加右值引用、noexcept；部分成员函数转为 noexcept |
| C++14 | 无明显更改 |
| C++17 | 1. 增加 `string_view` 重载，避免临时 `string` 创建；2. `pos > size()` 行为从 UB 改为返回 `npos`；3. 部分重载添加 `noexcept` |

---

### 11. 常见陷阱与最佳实践

1. **返回值测试**：始终与 `npos` 比较，不要写成 `if (s.find("a"))`（如果 `"a"` 在索引 0 找到，返回 0，条件为假）。
2. **`pos` 参数越界**：C++17 之前的代码应保证 `pos <= size()`，否则导致未定义行为。升级到 C++17 或手动检查边界。
3. **空字符串陷阱**：注意 `find("")` 永远成功，返回 `pos`。有时用于循环中可能造成无限循环。
4. **效率与临时变量**：如果频繁查找同一个字符串字面值，可以考虑将其存为 `string_view` 或 `const char*`，减少构造开销。C++17 引入 `string_view` 重载正是为此。
5. **与 `rfind` 混淆**：`find` 是正向，`rfind` 是反向。明确需求。
6. **多字节/UTF-8**：`find` 按字节搜索，不能直接识别 Unicode 字符边界。处理 Unicode 时，需先将字符串转换为宽字符或其他编码，或使用专门的库。
7. **大小写敏感**：`find` 是大小写敏感的。若要大小写不敏感，需要先转换字符串（如使用 `std::tolower`）或自定义搜索。

---

### 12. 完整实例：解析键值对

```cpp
#include <iostream>
#include <string>
#include <vector>

std::vector<std::pair<std::string, std::string>> parse(const std::string& data) {
    std::vector<std::pair<std::string, std::string>> result;
    size_t pos = 0;
    while (pos < data.size()) {
        auto end = data.find(';', pos);
        if (end == std::string::npos) end = data.size();
        std::string token = data.substr(pos, end - pos);
        auto eq = token.find('=');
        if (eq != std::string::npos) {
            std::string key = token.substr(0, eq);
            std::string value = token.substr(eq + 1);
            result.emplace_back(key, value);
        }
        pos = end + 1;
    }
    return result;
}

int main() {
    std::string input = "name=John;age=30;city=New York";
    for (const auto& [k, v] : parse(input))
        std::cout << k << " -> " << v << '\n';
}
```

---

### 13. 总结

`std::string::find` 是处理字符串查找的基本工具，功能直观且高效。正确理解它的多重重载、`pos` 控制、`npos` 返回值和空字符串行为，是写出健壮且高效字符串处理代码的关键。在现代 C++ 中，结合 `string_view` 和适当算法，可以让查找逻辑既清晰又零开销。

## s.substr

`std::string::substr` 是 C++ 标准库中 `std::string` 最重要的成员函数之一，用于**从原字符串中提取一个子串**，并**返回一个新的 `std::string` 对象**。它不修改原字符串，而是生成一个独立的副本。下面从语法、语义、版本演进、性能、最佳实践等角度进行详细介绍。

---

### 1. 函数原型

从 C++98 到 C++20，`substr` 的重载集不断丰富，当前标准（C++20）共有两个重载：

```cpp
// 1. 基本形式：指定起始位置和长度
string substr(size_type pos = 0, size_type count = npos) const;

// 2. C++20 新增：右值引用限定的重载（高效移动版本）
string substr(size_type pos = 0, size_type count = npos) &&;
```

- 第一个重载处理**左值**（如一个命名的 `string` 变量），返回新副本。
- 第二个重载处理**右值**（临时 `string` 对象），可以**直接复用源对象的内存**，避免分配和拷贝，效率极高。

---

### 2. 参数详解

| 参数 | 类型 | 含义 |
|------|------|------|
| `pos` | `size_type` (通常 `size_t`) | 子串起始索引（从 0 开始）。默认值为 0，表示从字符串开头截取。 |
| `count` | `size_type` | 要包含的字符个数。默认值为 `npos`，这是一个非常大的值（静态常量 `-1` 转换的无符号数），表示从 `pos` 开始直到字符串末尾的所有字符。 |

---

### 3. 返回值

返回一个**新构造的 `std::string` 对象**，其内容为原字符串从 `pos` 开始、长度为 `min(count, size() - pos)` 的子串。  
如果 `pos == size()`，返回空字符串（`""`）。  
如果 `pos > size()`，则抛出异常（见下）。

---

### 4. 异常（何时抛出 `std::out_of_range`）

当 `pos` **大于** 原字符串的 `size()` 时，`substr` 会抛出 `std::out_of_range` 异常。  
这是唯一的异常情况。`count` 无论多大都不会抛出异常，它会被安全裁剪。

```cpp
std::string s = "hello";
auto sub = s.substr(10, 3);   // 抛出 std::out_of_range （10 > 5）
```

因此，安全调用通常需要提前检查 `pos <= s.size()`。

---

### 5. 长度裁剪规则（重要）

实际返回的子串长度 = `min(count, size() - pos)`。  
- 若 `count` 大于从 `pos` 到末尾的长度，子串只到末尾。
- 若 `count == npos`，子串到末尾。
- 若 `pos + count` 超过 `size()`，安全裁剪。

示例：
```cpp
std::string s = "abcde";
auto s1 = s.substr(2, 10);    // 从索引2开始，期望10个字符，实际只能取3个："cde"
auto s2 = s.substr(2);        // 默认 count == npos："cde"
auto s3 = s.substr(5);        // pos == size()，空字符串 ""
```

---

### 6. 底层行为与内存分配

- `substr` 通常会**分配新内存**并拷贝字符，时间复杂度为 O(count)。
- 返回的 `string` 和原字符串**完全独立**，修改子串不影响原串。
- 对于小字符串（短于 SSO 阈值），可能会在栈上分配（Small String Optimization），不涉及堆操作。

---

### 7. C++20 移动优化

C++20 引入的右值引用重载 `substr() &&` 允许从**临时对象**中“窃取”数据。  
若原字符串是右值且子串恰好是从头部开始的整个字符串，可能会避免拷贝。标准规定该重载**可能**通过移动赋值或直接复用存储来实现，但实现细节由库决定。典型行为：如果 `pos == 0` 且 `count >= size()`，则移动原字符串；否则可能需要部分拷贝，但可以复用已分配的内存。

示例：
```cpp
std::string s = "Hello World";
auto sub = std::move(s).substr(0, 5);  // 调用 substr() &&，可能高效移动
// s 处于合法但未指定状态，不应再使用
```

对于日常编程，这个优化大多由编译器自动启用（如临时返回的 `string`）。

---

### 8. 基本使用示例

```cpp
#include <string>
#include <iostream>

int main() {
    std::string s = "Hello, World!";
    
    // 提取 "Hello"
    auto sub1 = s.substr(0, 5);   // pos=0, count=5
    
    // 提取 "World!"
    auto sub2 = s.substr(7);      // pos=7, count默认npos，到末尾
    
    // 空子串
    auto empty_sub = s.substr(s.size()); // OK，返回""
    
    std::cout << sub1 << '\n' << sub2 << '\n';
    // 输出:
    // Hello
    // World!
}
```

---

### 9. 与其他取子串方式的比较

| 方法 | 返回类型 | 是否拷贝 | 性能 | 用途 |
|------|----------|----------|------|------|
| `string::substr` | `string` | 是 | O(count) | 需要独立拥有子串 |
| `string_view::substr` (C++17) | `string_view` | 否 | O(1) | 只读访问，不拥有数据 |
| `string::copy` | 拷贝到外部缓冲区 | 是 | O(count) | 向 C 风格数组拷贝 |
| `assign` / `insert` 等组合 | 修改现有字符串 | 可能 | 根据需求 | 就地修改 |
| 手动迭代器构造 `string` | `string` | 是 | O(count) | 从迭代器范围构造 |

如果不需要修改子串，且原字符串生命周期可控，使用 `std::string_view::substr` 可以**零开销**提取子串视图。

---

### 10. 常见陷阱与最佳实践

1. **`pos` 越界**：调用前确保 `pos <= s.size()`，或使用 `try/catch`，或先比较。
2. **返回空字符串不抛异常**：`pos == size()` 是合法的，返回空串。这与很多其他语言不同。
3. **`count` 不是硬限制**：它不是要精确截取的长度，如果超过实际可用长度，只取到末尾。不要依赖 `count` 来检查长度。
4. **临时字符串的优化**：如果是临时对象，C++20 的右值重载会自动优化。C++17 及之前可用 `std::move` + `substr` 然后在下一行丢弃原变量，但优化不一定有。
5. **避免无谓的拷贝**：当只需要“观察”一部分内容时，考虑 `std::string_view`（C++17），或直接使用 `const char*` + 长度（需保证原串存活）。
6. **异常安全**：`substr` 的异常只会因 `pos` 越界抛出，如果已经检查，可以标记 `noexcept` 或忽略。
7. **不要与 `replace` 的区间混淆**：`substr(pos, count)` 是提取，`replace(pos, count, ...)` 是替换，参数含义一致，便于记忆。

---

### 11. 扩展使用示例：解析文件扩展名

```cpp
std::string get_extension(const std::string& filename) {
    auto dot_pos = filename.rfind('.');
    if (dot_pos == std::string::npos)
        return "";
    return filename.substr(dot_pos + 1); // 从点之后到末尾
}
```

---

### 12. 总结

`std::string::substr` 是一个非常直观且安全的成员函数，遵循**起始位置 + 长度**的设计。它通过返回新字符串提供了语义清晰的子串提取，代价是需要一次内存拷贝。在现代 C++ 中，如果不需要拷贝，可以搭配 `string_view` 以获得零开销视图。了解其边界行为和 C++20 的移动优化，可以帮助你写出更高效、更健壮的代码。