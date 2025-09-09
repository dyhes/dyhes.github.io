---
title: 【NowCoder】CPP
date: 2025-09-09 00:00:00+0000
categories: [arts, temple]
tags: [NowCoder, CPP]
---

## 运算符重载

C++ 的运算符重载功能允许你为用户自定义类型（如类或结构体）赋予与内置类型相似的操作行为。下面通过一个表格汇总了可重载与不可重载的运算符，并解释了相关规则和注意事项。

| 类别               | 可重载的运算符                                               | 不可重载的运算符                                             |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **算术运算符**     | `+`, `-`, `*`, `/`, `%`, `++`, `--`, `+=`, `-=`, `*=`, `/=`, `%=` |                                                              |
| **关系运算符**     | `==`, `!=`, `<`, `>`, `<=`, `>=`                             |                                                              |
| **位运算符**       | `&`, `                                                       | `,`^`（按位异或）,`~`（按位取反）,`<<`（左移）,`>>`（右移）,`&=`,` |
| **逻辑运算符**     | `!`（逻辑非）, `&&`（逻辑与）, `                             |                                                              |
| **其他运算符**     | `[]`（下标）, `()`（函数调用）, `->`（成员指针访问）, `,`（逗号）, `=`（赋值）, `new`, `delete`, `new[]`, `delete[]`, `.*`（成员指针访问，**只能作为成员函数重载**） |                                                              |
| **不可重载运算符** |                                                              | `::`（作用域解析）, `.*`（成员对象选择？）, `.`（成员访问）, `?:`（三目条件）, `sizeof`, `typeid` |

⚠️ **重载运算符的核心规则**

- **不改变优先级和结合性**：重载不会改变运算符原有的优先级和结合性。
- **不改变操作数个数**：例如，重载的 `+`运算符仍然是二元运算符。
- **至少一个用户定义类型**：重载运算符的函数其参数中必须至少有一个是用户自定义的类型（类或结构体）。
- **不能创建新运算符**：只能重载 C++ 语言中已有的、允许重载的运算符。
- **保持语义一致性**：重载的运算符应与其原有功能类似，避免滥用导致代码可读性下降（例如，不应使用 `+`运算符来实现减法操作）。

📝 **如何重载运算符**

运算符重载可以通过两种方式实现：

1. **成员函数形式**：
   - 二元运算符的参数列表中只有一个显式参数（另一个是隐含的 `this`指针），一元运算符则没有显式参数。
   - 例如：`ClassName operator+(const ClassName& other) const;`
   - 赋值运算符(`=`)、下标运算符(`[]`)、函数调用运算符(`()`)、成员访问运算符(`->`) **必须**作为成员函数重载。
2. **非成员函数形式（通常声明为友元）**：
   - 二元运算符需要两个显式参数，一元运算符需要一个显式参数。
   - 通常需要将其声明为类的 `友元（friend）`函数以便访问私有成员。
   - 这种形式对于需要**对称性**的操作（如 `(你的类对象 + 整数)`和 `(整数 + 你的类对象)`）或当左操作数不是该类对象时（如重载 `<<`用于输出）非常有用。

💡 **一些实用建议**

- **成对重载**：例如，如果重载了 `==`，通常也应重载 `!=`；重载了 `<`，往往也应考虑重载 `>`、`<=`、`>=`。
- **注意返回值**：赋值运算符（`=`, `+=`, `-=`等）通常应返回当前对象的引用（`ClassName&`）以支持链式赋值（如 `a = b = c`）。
- **前后缀区分**：重载前置 `++`和后置 `++`时，后置版本接受一个额外的 `int`类型占位参数以示区分。

运算符重载能极大提升代码的可读性和易用性，但务必谨慎使用，确保其行为符合直觉，并严格遵守 C++ 的规则。

## 友元运算符

在 C++ 中，将运算符重载为**友元函数**还是**成员函数**，主要区别在于封装性、参数传递方式以及对操作数位置的灵活性上。下面这个表格汇总了核心差异，方便你快速了解：

| 特性                 | 友元运算符重载 (Friend Operator Overloading)       | 成员函数运算符重载 (Member Function Operator Overloading)    |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| **基本定义**         | 全局函数，使用 `friend`关键字在类内声明            | 类的成员函数                                                 |
| **`this`指针**       | 没有 `this`指针                                    | 隐含 `this`指针，指向左操作数                                |
| **参数个数**         | 双目运算符需两个显式参数，单目运算符需一个显式参数 | 双目运算符需一个显式参数（左操作数由 `this`指出），单目运算符无需参数 |
| **左操作数类型限制** | 可以是任意类型（包括非类类型）                     | 必须是该类的对象                                             |
| **对称性操作支持**   | ⭐ 支持（如 `obj + 3`和 `3 + obj`都可行）           | ❌ 不支持（若左操作数非该类对象则无法编译）                   |
| **访问私有成员**     | 声明为友元后可以访问                               | 天然可以访问                                                 |
| **封装性**           | 会破坏封装性（因其不是成员函数却可访问私有部分）   | 良好地封装在类内部                                           |
| **某些运算符的限制** | 不能重载 `=`, `()`, `[]`, `->`为友元函数           | 赋值运算符(`=`)、下标运算符(`[]`)、函数调用运算符(`()`)、成员访问运算符(`->`) **必须**作为成员函数重载 |

📌 **如何选择友元还是成员函数形式**

- **优先考虑友元函数的情况**：
  - 需要**支持对称性运算**（例如 `a + b`和 `b + a`都应有效），尤其是左操作数可能是基本类型或其他类类型时。
  - 运算符的**左操作数不是当前类的对象**（例如重载 `<<`用于输出时，左操作数是 `std::ostream`对象，必须使用友元或非成员函数）。
  - **关系运算符**（如 `==`, `!=`, `<`, `>`等）通常也建议重载为友元函数以实现对称性。
- **优先考虑成员函数的情况**：
  - **赋值类运算符**，如 `=`, `+=`, `-=`, `*=`, `/=`等，因为它们通常直接修改左操作数对象的状态。
  - **一元运算符**，如 `++`（前置和后置）、`--`（前置和后置）、`*`（解引用）、`->`（成员访问）等，通常也使用成员函数形式重载。
  - 当运算符**自然地将左操作数作为当前对象**，且不需要对称性时。
  - 希望**保持良好的封装性**，避免友元机制带来的封装突破。

💡 **一个简单例子**

```
#include <iostream>

class MyNumber {
private:
    int value;
public:
    MyNumber(int v = 0) : value(v) {}
    
    // 成员函数重载：MyNumber + int
    MyNumber operator+(int rhs) const {
        return MyNumber(value + rhs);
    }
    
    // 友元函数重载：int + MyNumber (需要访问私有成员value，故声明为友元)
    friend MyNumber operator+(int lhs, const MyNumber& rhs);
    
    void print() const {
        std::cout << value << std::endl;
    }
};

// 友元函数实现：int + MyNumber
MyNumber operator+(int lhs, const MyNumber& rhs) {
    return MyNumber(lhs + rhs.value);
}

int main() {
    MyNumber num(5);
    MyNumber result1 = num + 10; // 使用成员运算符：MyNumber + int
    MyNumber result2 = 10 + num; // 使用友元运算符：int + MyNumber
    
    result1.print(); // 输出 15
    result2.print(); // 输出 15
    return 0;
}
```

⚡ **重要提醒**

1. **谨慎使用友元**：友元关系会**破坏封装性**，应仅在必要时使用。
2. **无法重载为友元的运算符**：`=`、`()`、`[]`、`->`这些运算符**不能**被重载为友元函数，它们**必须**作为类的成员函数。
3. **一致性**：重载运算符时，应确保其行为符合该运算符的直观含义，避免滥用导致代码难以理解。

希望这些解释能帮助你更好地理解 C++ 中友元运算符重载和成员函数运算符重载的区别。

## 类型转换

C++ 中的类型转换机制丰富且各有其特定用途，理解它们对编写安全且高效的代码至关重要。下面我将为你系统介绍 C++ 中的各种类型转换方式。

### 🔄 一、隐式类型转换 (Implicit Conversion)

隐式转换由**编译器自动完成**，无需程序员显式指定。常见于以下几种情况：

- **算术转换 (Arithmetic Conversion)**：在表达式中不同类型数据运算时，精度较低的类型通常会转换为精度较高的类型。例如 `int`与 `double`运算时，`int`会被转换为 `double`。
- **赋值转换**：将一种类型的值赋给另一种类型的变量时发生。
- **函数调用转换**：传递实参给形参时，若类型不匹配，会尝试隐式转换。
- **初始化转换**：用不同类型初始化变量时可能发生转换。
- **派生类向基类转换**：在继承关系中，派生类的指针或引用可以安全地转换为基类的指针或引用（向上转型）。

**注意**：隐式转换虽然方便，但可能导致**精度损失**或**意想不到的行为**，应密切关注。

### ⌨️ 二、显式类型转换 (Explicit Conversion)

当需要明确控制转换过程时，需使用显式转换。

#### 1. C 风格转换 [(type)expression]

C 风格转换使用 `(目标类型)`的语法，功能强大但**不够安全**，因其几乎允许任何类型间的转换，容易引发未定义行为，且转换意图不够清晰。

```
double d = 3.14;
int i = (int)d; // C 风格转换，将 double 转换为 int
```

#### 2. 函数式转换 [type(expression)]

函数式转换在 C++ 中也可用，但与 C 风格转换存在类似的安全性问题。

```
int i = int(d); // 函数式风格转换
```

#### 3. C++ 命名强制转换运算符 (Named Cast Operators)

C++ 引入了四种显式的强制转换运算符，更安全且意图更清晰：

| 转换运算符             | 主要用途                                       | 检查时机 | 安全性                                                       | 常见应用场景                                                 |
| ---------------------- | ---------------------------------------------- | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **`static_cast`**      | 相关类型间的转换                               | 编译时   | 相对安全，但下行转换（基类→派生类）可能不安全                | 基本类型转换、向上转型、空指针转换                           |
| **`dynamic_cast`**     | 多态类型间的安全向下转换和交叉转换             | 运行时   | 安全，转换失败返回 `nullptr`（指针）或抛出 `bad_cast`异常（引用） | 在继承层次中进行安全的向下转型                               |
| **`const_cast`**       | 添加或移除 `const`或 `volatile`限定符          | 编译时   | 需谨慎使用，修改原常量对象是未定义行为                       | 去除常量性以适配函数参数（但不应修改常量对象）               |
| **`reinterpret_cast`** | 低级别的重新解释位模式，几乎不受限制的类型转换 | 编译时   | 非常不安全，高度依赖平台和编译器                             | 指针与整数间的转换、不同类型指针间的转换（如网络数据包处理） |

下面是这四种转换的详细说明和示例：

- **static_cast**

  用于相关类型之间的转换，是最通用且最常用的 C++ 转换方式。

  ```
  double d = 3.14;
  int i = static_cast<int>(d); // 基本数据类型转换
  
  class Base {};
  class Derived : public Base {};
  Derived* derivedPtr = new Derived;
  Base* basePtr = static_cast<Base*>(derivedPtr); // 向上转型，安全
  // Base* basePtr2 = new Base;
  // Derived* derivedPtr2 = static_cast<Derived*>(basePtr2); // 向下转型，不安全！
  ```

- **dynamic_cast**

  专门用于**含有虚函数**的多态类体系，在运行时进行类型检查，确保转换安全。

  ```
  class Base { virtual void dummy() {} }; // 至少有一个虚函数
  class Derived : public Base {};
  
  Base* basePtr = new Derived;
  Derived* derivedPtr = dynamic_cast<Derived*>(basePtr); // 安全向下转型
  if (derivedPtr) { // 检查是否转换成功
      // 转换成功，使用 derivedPtr
  } else {
      // 转换失败
  }
  delete basePtr;
  ```

- **const_cast**

  主要用于**添加或移除 `const`**（或 `volatile`）限定符。

  ```
  const int ci = 10;
  int* modifiable = const_cast<int*>(&ci); // 移除 const 限定
  // *modifiable = 20; // 危险！原对象是常量，这是未定义行为
  
  void print(char* str);
  const char* msg = "hello";
  print(const_cast<char*>(msg)); // 合法使用：适配函数参数（但函数不应修改 msg）
  ```

- **reinterpret_cast**

  提供低级别的重新解释，**不进行任何类型检查**，极其不安全，应谨慎使用。

  ```
  int i = 42;
  int* p = &i;
  uintptr_t addr = reinterpret_cast<uintptr_t>(p); // 将指针转换为整数
  char* charPtr = reinterpret_cast<char*>(p); // 将 int* 重新解释为 char*
  ```

### 🧪 三、用户定义的类型转换 (User-Defined Conversions)

用户可以为自定义类型（类）定义转换行为，主要通过两种方式：

#### 1. 转换构造函数 (Conversion Constructor)

一个只有一个参数（或多个参数但只有第一个无默认值）的非 explicit 构造函数，可以从参数类型隐式转换为该类类型。

```
class Meter {
public:
    Meter(double value) : m_value(value) {} // 允许从 double 到 Meter 的转换
    double getValue() const { return m_value; }
private:
    double m_value;
};

void printLength(Meter m) {
    std::cout << m.getValue() << " meters" << std::endl;
}

int main() {
    Meter m = 5.5; // 隐式转换：double -> Meter
    printLength(10.2); // 隐式转换：double -> Meter
    return 0;
}
```

使用 `explicit`关键字可以防止隐式转换，避免意外行为。

#### 2. 类型转换运算符 (Type Conversion Operator)

允许将类类型对象转换为其他类型。

```
class Inch {
public:
    Inch(double value) : m_value(value) {}
    explicit operator double() const { // 显式定义从 Inch 到 double 的转换
        return m_value;
    }
    operator Meter() const { // 隐式定义从 Inch 到 Meter 的转换（可能不推荐）
        return Meter(m_value * 0.0254);
    }
private:
    double m_value;
};

int main() {
    Inch i(12);
    double d = static_cast<double>(i); // 显式调用 operator double()
    Meter m = i; // 隐式调用 operator Meter()
    return 0;
}
```

同样，`explicit`关键字可用于转换运算符以防止隐式转换。

### 💡 四、类型转换的选择指南与最佳实践

1. **优先使用 C++ 风格转换**：相比 C 风格转换，`static_cast`, `dynamic_cast`, `const_cast`, `reinterpret_cast`更安全，意图更清晰，便于检查和维护。
2. **谨慎使用隐式转换**：注意隐式转换可能带来的精度损失或意想不到行为，对单参数构造函数考虑使用 `explicit`关键字。
3. **向下转型时优先使用 `dynamic_cast`**：在继承层次中进行向下转型时，`dynamic_cast`提供运行时检查，比 `static_cast`更安全。
4. **敬畏 `reinterpret_cast`**：这是最不安全的转换，除非底层编程（如硬件交互、特定系统编程）等必需场景，否则尽量避免。
5. **尊重 `const`正确性**：不要轻易使用 `const_cast`来修改常量对象，这常导致未定义行为。主要用于适配旧接口等特殊场景。
6. **避免转换歧义**：为用户自定义类型定义转换函数时，确保转换路径唯一，避免编译器因多个转换路径而无法抉择。

### ⚙️ 五、其他类型转换工具

- **`std::any_cast`** (C++17 引入)：与 `std::any`配合使用，安全地获取 `std::any`对象中存储的值。如果类型不匹配，会抛出 `std::bad_any_cast`异常。

  ```
  #include <any>
  #include <string>
  
  std::any a = std::string("hello");
  try {
      std::string s = std::any_cast<std::string>(a);
  } catch(const std::bad_any_cast& e) {
      // 处理类型不匹配
  }
  ```

- **标准库字符串与数值的转换**：如 `std::stoi`(string to int), `std::stod`(string to double), `std::to_string`(number to string) 等。

掌握 C++ 的类型转换机制，能帮助你在代码的灵活性、安全性和清晰度之间找到最佳平衡。

## 类型转换函数

C++ 中的**类型转换函数**（Type Conversion Function）是一种特殊的成员函数，它允许你将**类类型的对象**隐式或显式地转换为**其他指定类型**（基本类型或其他类类型）。这增强了类的互操作性和灵活性。

下面是一个快速对比，帮助你理解类型转换函数与其他相关概念：

| 特性         | 类型转换函数 (Type Conversion Function) | 转换构造函数 (Conversion Constructor) | C++风格强制转换 (static_cast等)       |
| ------------ | --------------------------------------- | ------------------------------------- | ------------------------------------- |
| **定义位置** | 类的成员函数                            | 类的构造函数                          | 语言内置关键字                        |
| **转换方向** | **从类类型**转换为其他类型              | 从其他类型**转换为类类型**            | 任意类型间（需有关联）                |
| **语法**     | `operator TargetType() const { ... }`   | `ClassName(SourceType value) { ... }` | `static_cast<TargetType>(expression)` |
| **调用方式** | 隐式或显式（若为 `explicit`）           | 隐式或显式（若为 `explicit`）         | 必须显式                              |
| **控制权**   | 在**源类**中定义                        | 在**目标类**中定义                    | 在**使用方**代码中指定                |

### 💡 类型转换函数的特点

类型转换函数有几个非常重要的语法规定和特点：

- **成员函数**：它必须是类的**成员函数**。
- **无返回类型**：在函数声明中**不需要指定返回类型**，因为返回类型已经由 `operator`后面的目标类型明确指出了。
- **无参数**：它**不能有任何参数**，因为它的操作对象是当前类实例（通过 `this`指针访问）。
- **常函数**：它通常不应修改当前对象的内容，因此最好被声明为 **`const`** 成员函数。
- **可继承和虚函数**：类型转换函数可以被继承，也可以被声明为虚函数。

### 📝 如何定义类型转换函数

其语法格式如下：

```
class SourceClass {
public:
    operator TargetType() const { // TargetType 是你要转换到的目标类型
        // ... 转换逻辑
        return data; // 返回一个 TargetType 类型的值
    }
};
```

### 🧪 代码示例

```
#include <iostream>

class Number {
private:
    int value;
public:
    Number(int v) : value(v) {}
    
    // 类型转换函数：将 Number 对象转换为 int
    operator int() const {
        return value;
    }
    
    // 类型转换函数：将 Number 对象转换为 double（显式转换）
    explicit operator double() const {
        return static_cast<double>(value);
    }
};

int main() {
    Number num(42);
    
    // 隐式转换：调用 operator int()
    int x = num;
    std::cout << "Converted to int: " << x << std::endl;
    
    // 显式转换：调用 operator double() (因为使用了explicit关键字)
    double d = static_cast<double>(num);
    std::cout << "Converted to double: " << d << std::endl;
    
    // 在表达式中使用隐式转换
    int sum = num + 10; // Number -> int, 然后 42 + 10
    std::cout << "Sum: " << sum << std::endl;
    
    return 0;
}
```

输出结果：

```
Converted to int: 42
Converted to double: 42
Sum: 52
```

### ⚠️ 注意要点与最佳实践

1. **谨慎使用隐式转换**：

   隐式转换虽然方便，但可能会让代码的意图变得不清晰，甚至在某些情况下导致意想不到的行为或难以发现的错误。例如，编译器可能会在你未察觉的情况下调用转换函数。

2. **使用 `explicit`关键字**：

   在 C++11 之后，你可以使用 **`explicit`** 关键字来修饰类型转换函数，这样可以**防止隐式转换**，只允许通过显式类型转换（如 `static_cast`）来调用它。这能有效增加代码的安全性和可读性。

   ```
   explicit operator TargetType() const { ... }
   // 使用时必须显式：TargetType t = static_cast<TargetType>(myObject);
   ```

3. **避免二义性**：

   如果一个类定义了多个转换目标类型**相近**的类型转换函数（例如同时存在 `operator int()`和 `operator double()`），在某些表达式中有可能让编译器无法决定使用哪一个，从而引发**二义性错误**。

   ```
   class AmbiguousClass {
   public:
       operator int() const { return 1; }
       operator double() const { return 1.5; }
   };
   void foo(double d) {}
   void foo(int i) {}
   AmbiguousClass obj;
   // foo(obj); // 错误！调用具有二义性
   foo(static_cast<int>(obj)); // 正确：显式指定
   ```

4. **与转换构造函数的区别**：

   - **类型转换函数**：将**当前类类型**转换为**其他类型**。

   - **转换构造函数**：将**其他类型**转换为**当前类类型**（通常是一个参数的构造函数）。

     它们共同决定了类与外部类型之间相互转换的规则。

### 💎 总结

类型转换函数是 C++ 中实现用户自定义类型转换的强大工具之一。它允许类对象在必要时自动或强制转换为其他类型。使用时请牢记：

- 使用 `operator TargetType() const`语法在类内定义。
- **优先考虑使用 `explicit`关键字**来避免可能带来问题的隐式转换，提高代码安全性。
- 注意避免因多个转换函数可能导致的二义性问题。
- 它与转换构造函数相辅相成，共同定义了类与类型系统交互的接口。

希望这些信息能帮助你更好地理解和使用 C++ 中的类型转换函数。