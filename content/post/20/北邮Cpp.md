---
title: 【CPP】C++程序设计-崔毅东
date: 2020-12-06 00:00:00+0000
categories: 
- nutrition
- temple
tags:
    - CPP
---

## History

符合C++11及之后标准的C++称之为“Modern C++”，即“现代C++”。之前的C++称为“Classic C++”，即“经典C++”

| Year | C++ Standard       | Informal name |
| ---- | ------------------ | ------------- |
| 2020 | ISO/IEC 14882:2020 | C++20         |
| 2017 | ISO/IEC 14882:2017 | C++17, C++1z  |
| 2014 | ISO/IEC 14882:2014 | C++14, C++1y  |
| 2011 | ISO/IEC 14882:2011 | C++11, C++0x  |
| 2003 | ISO/IEC 14882:2003 | C++03         |
| 1998 | ISO/IEC 14882:1998 | C++98         |

##  Glossary

* **编辑器（Editor）**

  程序开发中的“编辑器”一般是指“代码编辑器”。代码编辑器主要用于用来编写和查看程序源代码。通常这种编辑器有语法加亮（Syntax-Highlighting）功能。

* **编译器（Compiler）**

  编译器（compiler），是一种计算机程序，它会将用某种编程语言写成的源代码（原始语言），转换成另一种编程语言（目标语言）。

  A compiler is a computer program that transforms computer code written in one programming language (the source language) into another programming language (the target language). Compilers are a type of translator that support digital devices, primarily computers. The name compiler is primarily used for programs that translate source code **from a high-level programming language to a lower level language** (e.g., assembly language, object code, or machine code) to create an **executable** program.

* **链接器（Linker）**

  是一个程序，将一个或多个由编译器或汇编器生成的目标文件外加库链接为一个**可执行文件**

* **调试器（Debugger）**

  调试器是指一种用于调试其它程序的计算机程序及工具。能够让代码在指令组模拟器（ISS）中可以检查运行状况以及选择性地运行，以便排错、调试。当开发的进度遇到瓶颈或找不出哪里有问题时，这技术将是非常有用的。但是将程序运行在调试器之下，这将比直接在运作的平台以及处理器上运行还要来得慢。

  典型的调试器通常能够在程序运行时拥有以下这些功能，例如单步运行（single-stepping）、利用中断点（breakpoint）使程序遇到各种种类的事件（event）时停止（breaking）（一般用于使程序停止在想要检查的状态）、以及追踪某些变量的变化。有些调试器也有能力在想要调试的程序在运行状态时，去改变它的状态，而不仅仅只是用来观察而己。

* **解释器（interpreter）**
* 解释器是一种计算机程序，能够把高级编程语言一行一行解释运行。解释器像是一位“中间人”，每次运行程序时都要先转成另一种语言再作运行，因此解释器的程序运行速度比较缓慢。它不会一次把整个程序翻译出来，而是每翻译一行程序就立刻运行，然后再翻译下一行，再运行，如此不停地进行下去。

* **集成开发环境（Integrated Development Environment，简称IDE）**

  集成开发环境是一种辅助程序开发人员开发软件的应用软件，在开发工具内部就可以辅助编写源代码文本、并编译打包成为可用的程序，有些甚至可以设计图形接口。

  IDE通常包括编程语言编辑器、自动构建工具、通常还包括调试器。有些IDE包含编译器／解释器，如微软的Microsoft Visual Studio，有些则不包含，如Eclipse、SharpDevelop等，这些IDE是通过调用第三方编译器来实现代码的编译工作的。有时IDE还会包含版本控制系统和一些可以设计图形用户界面的工具。许多支持面向对象的现代化IDE还包括了类别浏览器、对象查看器、对象结构图。虽然当前有一些IDE支持多种编程语言（例如Eclipse、NetBeans、Microsoft Visual Studio），但是一般而言，IDE主要还是针对特定的编程语言而量身打造（例如Visual Basic）。

Visual Studio中包含的C++集成开发环境叫做 Visual C++。

 

##  Visial Studio

* **工程/项目与解决方案**

  Visual C++中，将一个C++项目所需的所有源代码文件、资源文件等组织在一起，形成一个“Project”，我们俗称“C++工程”或者“C++项目”。有时简称“项目”。

  Visual C++ 将一个或者多个C++项目组织在一起，形成一个“Solution”，也就是“解决方案”。

  解决方案中的项目可能有互相的依赖关系。解决方案中的项目可以一键全部编译。

* **解决方案文件夹**

  C++解决方案中，可以建立虚拟的“解决方案文件夹”，将多个项目分类管理。

  C++解决方案中的项目，可能在硬盘的不同目录下，甚至在不同的硬盘上。

## 命名空间

```cpp
using namespace std;//not recomended

using std::cout;
cout<<"ha"<<std::endl;

std::cout<<"ha"<<std::endl;//recomended
```

## 编译

<img src="https://edu-image.nosdn.127.net/9B0617ED4BF4641BC9997B166B655E9E.jpg?imageView&thumbnail=890x0&quality=100" alt="img" referrerpolicy="no-referrer">

## 引用（Reference）

大部分时候可视为指针的语法糖

C++的引用主要是为了支持运算符重载；指针的存在主要是为了兼容C语言。

用户自定义类型最好用引用传参，这样可以避免不必要的构造函数和析构函数调用；对于内置(C-like)类型，按值传参会比按引用传参更高效。

```cpp
int x;
int&  rx = x;

int x, &rx = x;
```

* Any changes made through the reference variable are actually performed on the original variable (通过引用所做的读写操作实际上是作用于原变量上).
* A reference must be initialized in declaration 引用必须在声明的时候初始化。
* Once initialized, the name of the reference cannot be assigned to other variables (引用一旦初始化，引用名字就不能再指定给其它变量)

* You can use a reference variable as a parameter in a function and pass a regular variable to invoke the function. (引用可做函数参数，但调用时只需传普通变量即可)
* When you change the value through the reference variable, the original value is actually changed. (在被调函数中改变引用变量的值，则改变的是实参的值)

## 动态内存管理

```cpp
new <type> (initialValue);   //申请一个变量的空间
new <type> [literalExpression];  //申请数组

delete   <pointerName>;    //删除一个变量/对象
delete []  <pointerName>;     //删除数组空间
```

## 数据类型

### bool

* 整数0和布尔false互相转化

* 布尔true转化为整数1

* 任意非0整数转化为布尔true

## 列表初始化（C++11）

List initialization is a new feature for C++11 (列表初始化是C++11的一个新特性)


List: braced-init-list (“列表”是用花括号括起来的一(些)值)

列表初始化的两个分类

* Direct list initialization (直接列表初始化)

  ```cpp
  /* Variable initialization */ 
  int x{}; // x is 0; 
  
  int y{ 1 }; // y is 1; 
  
  /* Array initialization */ 
  
  int array1[]{ 1,2,3 }; 
  
  char s1[ 3 ] { 'o', 'k' }; 
  
  char s3[]{ "Hello" }; 
  ```

* Copy list initialization (拷贝列表初始化)

  ```cpp
  /* Variable initialization */ 
  
  int z = { 2 }; 
  
  /* Array initialization */ 
  
  int array2[] = { 4,5,6 }; 
  
  char s2[] = { 'y','e','s' }; 
  
  char s4[] = { "World" };
  
  char s5[] = "Aloha"; // Omit curly braces (省略花括号)
  ```

List initialization is also called "unified initialization" (列表初始化也被称为“**统一初始化方法**”)
Variables and arrays are initialized in the same form (变量和数组用同样的形式初始化)

### when to use


Prefer {} initialization over alternatives unless you have a strong reason not to（尽量使用列表初始化，除非你有个很好的不用它的理由）


Why: List initialization does not allow narrowing（原因：列表初始化不允许“窄化”，即不允许丢失数据精度的隐式类型转换）

## 类型转换

* **隐式类型转换**
  由编译器按照数据类型的转换规则自动转换，无需程序员干预。
  可能导致数据精度损失，或者转换失败。应**尽量避免**使用隐式类型转换

* **显式类型转换（即：强制类型转换）**
  由程序员用明确的类型转换语法写出类型转换代码。好处是，程序员知道自己要做什么并且把这个想法明确表达出来

```c++
//c style
(type) value;
printf("%d", (int) 2.5);


//cpp style
static_cast<type> value;
cout << static_cast<double>(1 / 2);
```

## auto (C++11)

C++03及之前的标准种，auto放在变量声明之前，声明变量的存储策略。但是这个关键字常省略不写。
C++11中，auto关键字放在变量之前，作用是在声明变量的时候根据变量初始值的类型自动为此变量选择匹配的类型

* auto 变量必须在定义时初始化，这类似于const关键字

* 定义在一个auto序列的变量必须始终推导成同一类型

* 如果初始化表达式是引用或const，则去除引用或const语义。

  ```cpp
  int a{10}; int &b = a;
  
  auto c = b;   //c的类型为int而非int&（去除引用）
  
  const int a1{10};
  
  auto b1 = a1; //b1的类型为int而非const int（去除const） 
  ```

* **如果auto关键字带上&号，则不去除引用或const语意**
    ```cpp
    int a = 10; int& b = a;
    
    auto& d = b;//此时d的类型才为int&
    
    const int a2 = 10;
    
    auto& b2 = a2;//因为auto带上&，故不去除const，b2类型为const in
    ```

* 初始化表达式为数组时，auto关键字推导类型为指针。

  ```cpp
  int a3[3] = { 1, 2, 3 };
  
    auto b3 = a3;
  
    cout << typeid(b3).name() << endl; //输出int * （输出与编译器有关）
  ```

* 若表达式为数组且auto带上&，则推导类型为数组类型。

  ```cpp
  int a7[3] = { 1, 2, 3 };
  
  auto& b7 = a7;
  
  cout << typeid(b7).name() << endl; //输出int [3] （输出与编译器有关）
  ```

* C++14中，auto可以作为函数的返回值类型和参数类型

###  Why Almost Always Auto

Using auto are for correctness, performance, maintainability, robustness—and convenience (使用auto是为了代码的正确性、性能、可维护性、健壮性，以及方便)

## decltype

decltype利用已知类型声明新变量。

decltype是在编译期推导一个表达式的类型，它只做静态分析，因此它不会导致已知类型表达式执行。
decltype 主要用于泛型编程（模板）

```cpp
#include<iostream>
using namespace std;
int  fun1()  { return 10;  } //修改fun1()时不必改动其他
auto fun2()  { return 'g'; }  // C++14
int main(){
    // Data type of x is same as return type of fun1()
    // and type of y is same as return type of fun2()
    decltype(fun1()) x;  // 不会执行fun1()函数
    decltype(fun2()) y = fun2();
    cout << typeid(x).name() << endl;
    cout << typeid(y).name() << endl;
    return 0;
}
```

## 内存模型

* **Stack**

  编译器自动分配

* **Heap**

  由程序员分配

* **Global/Static**

  存储全局变量和静态变量

* **Constant**

  内容不可修改

## 常量与指针

* **Pointer to Constant(常量指针、常指针)**

  指针所指向的内容不可以通过指针的间接引用(*p)来改变。

  ```cpp
  const int x = 1;
  
  const int* p1;
  
  p1 = &x;      //指针 p1的类型是  (const int*)
  
  *p1 = 10;     // Error!
  
  char*        s1 = "Hello";     // Error!
  
  const char* s2 = "Hello";     // Correct!
  ```

* **Pointer Constant(指针常量)**

  指针本身为常量，不可改变

  ```cpp
  int x = 1, y = 1;
  
  int* const p2 = &x; //常量 p2的类型是  (int*)
  
  *p2 = 10;     // Okay! à x=10
  
  p2 = &y;      // Error! p2 is a constant
  ```


## using, typedef, and #define

* **typedef**

  定义类型别名

  ```cpp
  typedef const unsigned long int * MyPointer;
  ```

* **using (C11)**

  ```CPP
  using ConstPointer = const unsigned long int *;
  using identifier=const 
  ```

  using的写法比typedef的写法更加直观，所以，我们应尽量使用using声明新类型名。而且当涉及到模版类型名时，只能使用using。

* **#define**

  定义宏，编译器对宏进行替换

## 作用域

* **全局作用域**
* **局部作用域**
  * 文件作用域
  * 函数作用域
  * 函数中的块级作用域

#### 一元作用域解析运算符（Unary Scope Resolution）

If a local variable name is the same as a global variable name, you can access the global variable using ::globalVariable. (局部变量名与全局变量名相同时，可使用 :: 访问全局变量)

The :: operator is known as the unary scope resolution.（:: 这个运算符被称为一元作用域解析运算符）

```cpp
#include <iostream>

int v1 = 10;

int main() {

    int v1 = 5;

    std::cout << "local variable v1 is "  << v1   << std::endl;

    std::cout << "global variable v1 is " << ::v1 << std::endl;

    return 0;

}
```

## 特殊函数

#### 重载函数

根据参数（个数，类型）判断，应避免二义性

```cpp
int func(int a,double b);
int func(double a,int b);
func(1.1,2.1);
//出现二义性
```

#### 默认参数

默认值参数应后置

#### 内联函数（Inline Function）

普通函数性能有额外开销

内联函数可减小函数调用开销，将代码插入到调用处，会导致程序变大

是一种请求而非命令

## 面向对象

#### 构造函数

A class may be declared without ctors (类可不声明构造函数)

(1)     A no-arg constructor with an empty body is implicitly declared in the class.
 (编译器会提供一个带有空函数体的无参构造函数)

(2)     This constructor, called a default constructor is provided automatically only if no constructors are explicitly declared in the class.
 (只有当未明确声明构造函数时，编译器才会提供这个构造函数，并称之为“默认构造函数”)

#### 拷贝构造函数

Copy Constructor

拷贝构造：用一个对象初始化另一个同类对象

拷贝构造函数可以简写为 copy ctor，或者 cp ctor

如何声明拷贝构造函数(copy ctor)

Circle (Circle&);

Circle (const Circle&);

```cpp
class X {  //来自C++11标准: 12.8节

// ...

public:

  X(const X&, int = 1);

};

X b(a, 0); // calls X(const X&, int);

X c = b;   // calls X(const X&, int);
```

In general, if the programmer does not provide a copy ctor, the compiler will generate one.(一般情况下，如果程序员不编写拷贝构造函数，那么编译器会自动生成一个)

The generated copy ctor is called " implicitly-declared/defined copy ctor " (自动生成的拷贝构造函数叫做“隐式声明/定义的拷贝构造函数”

In general, the implicitly-declared/defined copy constructor simply copies each data field in one object to its counterpart in the other object. (一般情况下，隐式声明的拷贝构造函数简单地将作为参数的对象中的每个数据域复制到新对象中)

#### 析构函数

Destructors are the opposite of constructors. (dtor vs ctor) 析构函数与构造函数正好相反

下表中展示了ctor和dtor的对比

|                                                | **Destructor**                                            | **Constructor**                       |
| ---------------------------------------------- | --------------------------------------------------------- | ------------------------------------- |
| When to invoke(何时调用)                       | when the object is destroyed(对象销毁时)                  | when an object is created(对象创建时) |
| Prototype(原型)                                | C::~C( )                                                  | C::C(arguments)                       |
| Default prototype(默认函数的原型)              | C::~C( )                                                  | C::C( ) 或参数带有默认值              |
| What if no explicit decl? (没有显式声明怎么办) | Compiler will create a default one (编译器会生成默认函数) |                                       |
| Overloadable(可否重载)                         | No, only 1                                                | Yes                                   |

####  友元函数

Private members:  cannot be accessed from outside of the class. (私有成员无法从类外访问)

Occasionally, it is convenient to allow some trusted functions and classes to access a class’s private members. (但有时又需要授权某些可信的函数和类访问这些私有成员)

 C++ enables you to use the friend keyword to declare friend functions and friend classes for a class (用friend关键字声明友元函数或者友元类)

Disadvantage of "friend": break the encapsulation (友元的缺点：打破了封装性)

```cpp
 

class Date {

private:

  int year{ 2019 } , month{ 1 };

  int day{ 1 };

public:

  friend class Kid;

  friend void print(const Date& d);

};

 

void print(const Date& d) {

  cout << d.year << "/" << d.month 

       << "/" << d.day << endl;

}

class Kid {

private:

  Date birthday;

public:

  Kid() { 

    cout << "I was born in " 

         << birthday.year << endl; 

  }

};

 

int main() {

  print(Date());

  Kid k;

  cin.get();

}
```

#### 创建对象

```cpp
Circle circle1;   // 正确，但不推荐这样写
Circle  circle2(); // 错误！C++编译器认为这是一个函数声明
Circle  circle3{}; // 正确，推荐写法。这里面明确显示用空初始化列表初始化circle3对象（调用Circle默认构造函数）
```

#### 对象拷贝

How to copy the contents from one object to the other?(如何将一个对象的内容拷贝给另外一个对象)

(1)   use the assignment operator( 使用赋值运算符) ： =

(2)   By default, **each data field** of one object is copied to its counterpart in the other object. ( 默认情况下，对象中的每个数据域都被拷贝到另一对象的对应部分)

```cpp
circle2 = circle1;

(1)   将circle1 的radius 拷贝到circle2 中

(2)   拷贝后：circle1  和 circle2  是两个不同的对象，但是半径的值是相同的。( 但是各自有一个radius 成员变量)
```

#### 浅拷贝与深拷贝

**前提条件**是，类A中有个指针p，指向一个外挂对象b（b是B类型的对象）；如果类A里面没有指针成员p，那也就不要谈深浅拷贝了。

现在有一个类A的对象a1（a1的指针p指向外挂对象b1）。以拷贝构造的方式，创建a1的一个拷贝a2。

(1) 如果仅仅将a1.p的值（这个值是个地址）拷贝给 a2.p，这就是浅拷贝。浅拷贝之后，a1.p和a2.p都指向外挂对象 b1

(2) 如果创建一个外挂对象b2，将 a2.p指向b2；并且将b1的值拷贝给b2，这就是深拷贝

* Shallow copy: if the field is a pointer to some object, the address of the pointer is copied rather than its contents. (浅拷贝：数据域是一个指针，只拷指针的地址，而非指针指向的内容)

  在两种情况下会出现浅拷贝

  (1)      Implicit/default copy ctor (创建新对象时，调用类的**隐式/默认构造函数**)

  (2)      default assignment operator for copying  = (为已有对象赋值时，使用**默认赋值运算符**)

  ```cpp
  Employee e1{"Jack", Date(1999, 5, 3),  Gender::male};
  
  Employee e2{"Anna", Date(2000, 11, 8), Gender:female};
  
  Employee e3{ e1 };  //cp ctor，执行一对一成员拷贝
  ```

  上面的代码执行之后，e3.birthday指针指向了 e1.birthday所指向的那个Date对象

* Deep copy: Copy the contents that pointed by the pointer (深拷贝：拷贝指针指向的内容)

  如何深拷贝


  (1)  **自行编写拷贝构造函数**，不使用编译器隐式生成的（默认）拷贝构造函数

  (2)  **重载赋值运算符**，不使用编译器隐式生成的（默认）赋值运算符函数

  ```cpp
  class Employee {
  
  public:
  
      // Employee(const Employee &e) = default; //浅拷贝ctor
  
    Employee(const Employee& e){    //深拷贝ctor
  
      birthdate = new Date{ e.birthdate };
  
    } // ...
  
  }
  
  Employee e1{"Jack", Date(1999, 5, 3), Gender::male};
  
  Employee e2{"Anna", Date(2000, 11, 8),, Gender:female};
  
  Employee e3{ e1 };  //cp ctor 深拷贝
  ```

#### Anonymous Object

匿名对象

Occasionally, you may create an object and use it only once. (有时需要创建一个只用一次的对象)

An object without name is called anonymous objects. (这种不命名的对象叫做匿名对象)

```cpp
int main() {

  Circle c1 = Circle{1.1};

  auto c2 = Circle{2.2}; // 用匿名对象做拷贝列表初始化

  Circle c3{};           // 直接列表初始化,调默认Ctor

  c3 = Circle{3.3};      // 用匿名对象赋值

  cout << "Area is " << Circle{4.2}.getArea() << endl;

  cout << "Area is " << Circle().getArea() << endl;  // 不推荐

  cout << "Area is " << Circle(5).getArea() << endl; // 不推荐

  return 0;

}
```

#### Local class & Nested class 

局部类和嵌套类

Local class : a class declared inside a function (局部类是在一个函数中声明的类)

```cpp
void f(){

  class C { // C及其对象只在f()中可用 

    void g() { // 成员函数必须在C中实现

      /* 访问f()的成员受限 ……. */

    }

  };

  C c1, c2;

}
```

Nested class: a class declared in another enclosing class (嵌套类是在另一个类中声明的类)

```cpp
class E{

  class N { // N及其对象可访问E的成员 

    /* 声明N的成员 ……. */

    }

  };

  C c1, c2;

}
```

#### Object Pointer&Dynamic Object

对象指针与动态对象

Object pointers can be assigned new object names(对象指针可以指向新的对象名)

**Arrow operator** ->  : Using pointer to access object members (箭头运算符 -> ：用指针访问对象成员)

Object declared in a function is created in the stack.(在函数中声明的对象都在**栈**上创建)； When the function returns, the object is destroyed (**函数返回，则对象被销毁**).

To retain the object, you may create it dynamically on the heap using the new operator. (为**保留对象**，你可以用new运算符在堆上创建它)

```cpp
Circle *pCircle1 = new Circle{}; //用无参构造函数创建对象

ClassName *variable=new ClassName{};

Circle *pCircle2 = new Circle{5.9}; //用有参构造函数创建对象

//程序结束时，动态对象会被销毁，或者

delete pObject;  //用delete显式销毁
```

#### Array of objects

对象数组


(1)     声明方式1

```cpp
Circle ca1[10];
```

(2)     声明方式2

用匿名对象构成的列表初始化数组

```cpp
Circle ca2[3] = { // 注意：不可以写成： auto ca2[3]=     因为声明数组时不能用auto

       Circle{3}, 

       Circle{ }, 

       Circle{5} };  
```


(3)     声明方式3

用C++11列表初始化，列表成员为隐式构造的匿名对象

```cpp
Circle ca3[3] { 3.1, {}, 5 };

Circle ca4[3] = { 3.1, {}, 5 }; 
```

(4)     声明方式4

用new在**堆区**生成对象数组

```cpp
auto* p1 = new Circle[3];
auto p2 = new Circle[3]{ 3.1, {}, 5 };
delete [] p1;
delete [] p2;
p1 = p2 = nullptr;
```

#### Objects & Function

###### Objects as Function Arguments

* 值传递：无法改变成员值
* 引用传递
* 指针传递

一般来说，**能用引用尽量不用指针**。引用更加直观，更少出现意外的疏忽导致的错误。

指针可以有二重、三重之分，比引用更加灵活。有些情况下，例如使用 new 运算符，只能用指针。

###### Objects as Function Return Value

* **指针作为返回类型**
  * **evil way**

    ```cpp
    // class Object { ... };
    
    Object* f ( /*函数形参*/ ){
    
      Object* o = new Object(args) // 这是“邪恶”的用法，不要这样做
    
      // Do something
    
      return o;
    
    }
    
    // main() {
    
    Object* o = f ( /*实参*/ );
    
    f( /*实参*/ )->memberFunction();
    
    // 记得要delete o
    ```

  * **可行**

    ```cpp
    // class Object { ... };
    
    Object* f ( Object* p, /*其它形参*/ ){
    
      // Do something
    
      return p;
    
    }
    
    // main() {
    
    Object* o = f ( /*实参*/ );
    
    // 不应该delete o
    ```

* **引用作为返回类型（提高效率）**

  * **evil way**

    ```cpp
    // class Object { ... };
    
    Object& f ( /*函数形参*/ ){
    
      Object o {args};
    
      // Do something
    
      return o;  //这是邪恶的用法
    
    }
    ```

  * **可行1**

    ```cpp
    // class Object { ... };
    
    class X {
    
      Object o;
    
      Object f( /*实参*/ ){
    
        // Do something
    
        return o;
    
      }
    
    }
    ```

  * **可行2**

    ```cpp
    // class Object { ... };
    
    Object& f ( Object& p, /*其它形参*/ ){
    
      // Do something
    
      return p;
    
    }
    
    // main() {
    
    auto& o = f ( /*实参*/ );
    
    f( /*实参*/ ).memberFunction();
    ```

#### 成员作用域和this指针

The data members are accessible to all constructors and functions in the class. (数据成员可被类内所有函数访问)

Data fields and functions can be declared in any order in a class. (数据域与函数可按任意顺序声明)

If a local variable has the same name as a data field: (若成员函数中的局部变量与某数据域同名)


(1)     the local variable takes precedence ( 局部变量优先级高：就近原则)

(2)     the data field with the same name is hidden. ( 同名数据域在函数中被屏蔽)

How do you reference a class’s hidden data field in a function? (如何在函数内访问类中被屏蔽的数据域)？ 可以使用 this 关键字

This 关键字的特性

(1)     a special built-in pointer ( 特殊的内建指针)

(2)     references to the calling object. ( **引用当前函数的调用对象**)

#### Default Member Initializers

就地初始化

In C++03, only static const members of integral types could be initialized in-class (在C++03标准中，只有静态常量整型成员才能在类中就地初始化)

C++11 was to allow a non-static data member to be initialized where it is declared in its class (C++11标准中，非静态成员可以在它声明的时候初始化)

数组必须声明长度

#### Constructor Initializer Lists

构造函数初始化列表

```cpp
在构造函数中用初始化列表初始化数据域

ClassName (parameterList)：dataField1{value1}, dataField2{value2}

{

  // Something to do 

}
```

A data field is an object type (Object in Object / Embedded Object) (类的数据域是一个对象类型，被称为对象中的对象，或者内嵌对象)

The embedded object must be constructed before the body of ctor is executed (内嵌对象必须在被嵌对象的构造函数体执行前就构造完成)

```cpp
class Time { /* Code omitted */ }

class Action {
public:
  Action(int hour, int minute, int second) {
    time = Time(hour, minute, second); //time对象应该在构造函数体之前构造完成
  }
private:
  Time time;
}; 
Action a(11, 59, 30);
```

If object type members/embedded objects are not initialized explicitly (若对象类型成员/内嵌对象成员没有被显式初始化)


(1) the default constructor of the embedded object is automatically invoked. ( 该内嵌对象的无参构造函数会被自动调用)

(2) If a default constructor of the embedded object does not exist, a compilation error will be reported. ( 若内嵌对象没有无参构造函数，则编译器报错)

#### Order of Member Initialization

Default Member Initialization (就地初始化)

Constructor Initialization List (构造函数初始化列表)

Assign Values to the members in Ctor Body (在构造函数体中为成员赋值)。注意，这个不是初始化，而是赋值。

执行次序： 就地初始化 > Ctor 初始化列表 >  在Ctor 函数体中为成员赋值

哪个起作用（初始化/赋值优先级）： 在Ctor 函数体中为成员赋值 > Ctor 初始化列表  >  就地初始化 

#### Delegation Constructor

代理构造：One ctor can call another ctor (一个构造函数可以调用另外的构造函数)

```cpp

 class A{
public:   

   A(): A(0){}

   A(int i): A(i, 0){}

   A(int i, int j) {

      num1=i;

      num2=j;

      average=(num1+num2)/2;

   }

private:

   int num1;

   int num2;

   int average;

};

```

上面例子中，构造函数的调用次序:

A() > A(int) > A(int, int)

#### Static Members

* **声明**：Inside a class definition, "static" declares members that are not bound to class instances
    在类定义中，关键字 static 声明不绑定到类实例的成员( 该成员无需创建对象即可访问)

* **定义**：

  (1)  声明为“constexpr”类型的静态数据成员必须 在类中声明 并初始化。自C++17 起，可不在类外定义

  (2)  声明为“inline”(C++17 起) 或者 “const int”  类型的静态数据成员可以 在类中声明 并初始化；

  (3)  其它须在类外定义并初始化，且不带static 关键字

  静态数据成员的定义规则复杂，在类外定义，大部分情况下不会出错

 静态数据成员具有静态存储期(static storage duration)或者C++11线程存储期特性

(1)      Only one instance of the object exists ( 只存在对象的一个实例)

(2)      静态存储器对象未明确初始化时会被自动“零初始化(Zero-Initialization)”

#### Accessibility

* **private**
   Private members can only be accessed from the inside of the class (私有成员只能在类内的函数访问)

* protected: A protected data field or a protected function in a base class can be accessed by name in its derived classes (保护属性的数据或函数可被派生类成员访问)

* public: Public members can be accessed from any other classes. (公有成员可被任何其他类访问)

###### 与继承结合

* **公有继承**

  (1)  基类成员    在派生类中的访问属性不变。

  (2)  派生类的成员函数    可以访问基类的**公有**成员和**保护**成员，不能访问基类的私有成员;

  (3)  派生类以外的其它函数    可以通过派生类的对象，访问从基类继承的**公有**成员, 但不能访问从基类继承的保护成员和私有成员。

* **保护继承**

  )     基类成员  公有成员和保护成员变成protected，私有成员不变。

  (2)     派生类的成员函数    可以访问基类的**公有**成员和**保护**成员，不能访问基类的私有成员;

  (3)     派生类以外的其它函数    不能通过派生类的对象，访问从基类继承的任何成员。

* **私有继承**

  (1)     基类成员    在派生类中都变成 private。

  (2)     派生类的成员函数    可以访问基类的**公有**成员和**保护**成员，不能访问基类的私有成员;

  (3)     派生类以外的其它函数    不能通过派生类的对象，访问从基类继承的任何成员。

#### Abstract Class

Sometimes a base class is so abstract that it cannot have any specific instances. Such a class is referred to as an abstract class (类太抽象以至于无法实例化就叫做抽象类)

the class which contains abstract functions (包含抽象函数的类被称为抽象类)

**Abstract Functions / Pure Virtual Function (抽象函数/纯虚函数)**

抽象函数(abstract functions)要求子类实现它

virtual double getArea() = 0;  

#### Dynamic Cast

动态类型转换

dynamic_cast 运算符

(1)     沿继承层级向上、向下及侧向转换到类的指针和引用

(2)     转指针：失败返回nullptr

(3)     转引用：失败抛异常

#### typeid

typeid operator (typeid运算符)

typeid is used to obtain the information about the class of the object (typeid用于获取对象所属的类的信息)


(1)     typeid returns a reference to an object of class type_info. (typeid运算符返回一个type_info对象的引用)

(2)     typeid(AType).name() 返回实现定义的，含有类型名称的C风格字符串(char *)

```cpp
#include <typeinfo>  //使用typeid，需要包含此头文件 

class A {};

A a{};

// ……

  auto& t1 = typeid(a);

  if (typeid(A) == t1) {

    std::cout << "a has type " 

              << t1.name() << std::endl;

  }
```

## 继承

C++11引入*final*特殊标识符，可以使得类不能被继承

C++11:派生类**不继承**的特殊函数


(1)   析构函数

(2)     友元函数

继承基类构造函数


(1)     using A::A;  继承所有基类ctor

(2)     不能仅继承指定的某个基类ctor

```cpp
struct A { // 等价于 class A { public:
    A(int i) {}
    A(double d, int i) {}
// ...
};

 

struct B : A {  // C++11
    using A::A; // 继承基类所有构造函数
    int d{0};   // 就地初始化
};

int main() {
    B b(1);   // 调A(int i)
}
```

#### constructor chaining (构造函数链)


Constructing an instance of a class invokes all the base class along the inheritance chain. (构造类实例会沿着继承链调用所有的基类ctor)

调用次序: base first, derive next (父先子后)

#### destructor chaining (析构函数链)


Conversely, the destructors are automatically invoked in reverse order(dtor与ctor正好相反)

调用次序: derive first, base next (子先父后)

#### Name Hiding in Inheritance

 继承中的名字隐藏

Names in inner scopes hide names in outer scopes. (内部作用域的名字隐藏外部作用域的(同名)名字)


(1)     The derived class acts as an inner scope (派生类视作内部作用域)

(2)     The base class as an outer scope(基类视作外部作用域)

why?

(1)     To avoid certain potentially dangerous behavior (避免某些潜在的危险行为)

(2)     Each class starts with a "clean sheet" with respect to each method name it declares (每个类在创建时，它的函数名都是写在一张干净的白纸上面，不会被基类函数名干扰)

**using-declaration** : introduce base class members into derived class definitions (using 声明语句可以将基类成员引入到派生类定义中)

 ```cpp
 class P {
 
 public:
 
   void f() {}
 
 };
 
  
 
 class C :public P {
 
 public:
 
   using P::f; //此处不带小括号
 
   void f(int x) {}
 
 };
 
  
 
 int main() {
 
   C c;
 
   c.f();
 
 }
 ```

## 多态

截止目前：多态性有两种表现的方式

* 重载多态
* 子类型多态：不同的对象调用同名重定义函数，表现出不同的行为

**联编(Binding):** 确定具有多态性的语句调用哪个函数的过程

* **Static Binding (静态联编)**

  在程序编译时(Compile-time)确定调用哪个函数

* **Dynamic Binding (动态联编)**

  在程序运行时(Run-time)，才能够确定调用哪个函数 

#### Run-time Polymorphism

用动态联编实现的多态，也称为运行时多态(Run-time Polymorphism)。

实现运行时多态有两个要素：

(1)     virtual function (虚函数)

(2)     Override (覆写) : redefining a virtual function in a derived class. (在派生类中重定义一个虚函数)

 **同名虚函数的调用**


(1)     不由指针类型决定；

(2)     而由指针所指的【实际对象】的类型决定

(3)     运行时，检查指针所指对象类型

**用途**：可以用父类指针访问子类对象成员

 If a function is defined virtual in a base class, it is automatically virtual in all its derived classes. (基类定义了虚同名函数，那么派生类中的同名函数自动变为虚函数)



类中保存着一个Virtual function table (虚函数表)

Run-time binding (运行时联编/动态联编)

More overhead in run-time than non-virtual function (比非虚函数开销大)



基类与派生类中有同名函数

(1)     通过派生类对象访问同名函数，是静态联编

(2)     通过基类对象的指针访问同名函数，是静态联编

(3)     通过基类对象的指针或引用访问同名虚函数，是动态联编

#### override and final

C++11引入override标识符，指定一个虚函数覆写另一个虚函数。

```cpp
class A {

public:

  virtual void foo() {}

  void bar() {}

};

 

class B : public A {

public:

  void foo() const override { // 错误： B::foo 不覆写 A::foo

  }                           // （签名不匹配）

  void foo() override;   // OK ： B::foo 覆写 A::foo

  void bar() override {} // 错误： A::bar 非虚

};

 

void B::foo() override {// 错误： override只能放到类内使用

}
```

C++11引入final特殊标识符，指定派生类不能覆写虚函数

```cpp
struct Base {

    virtual void foo();

};

 

struct A : Base 

{ 

    void foo() final; // A::foo 被覆写且是最终覆写

    void bar() final; // 错误：非虚函数不能被覆写或是 final

};

 

struct B final : A // struct B 为 final，不能被继承

{

    void foo() override; // 错误： foo 不能被覆写，因为它在 A 中是 final

};
```



struct可与class互换；差别在于struct的默认访问属性是public

## Structured Binding Declaration（c++17）

结构化绑定声明

#### for Array

1) cv-auto &/&&(可选) [标识符列表] = 表达式;

2) cv-auto &/&&(可选) [标识符列表] { 表达式 };

3) cv-auto &/&&(可选) [标识符列表] ( 表达式 );

   cv-auto: 可能由const/volatile修饰的auto关键字

   &/&& 左值引用或者右值引用

   标识符列表：逗号分隔的标识符

```cpp
int main() {

  int priArr [] {42, 21, 7};
     // ai/bi/ci 的基本类型都是int，只是cv标识或引用标识不同
  auto [a1, a2, a3] = priArr; // a1 是 priArr[0] 的拷贝，a2, a3类推
  const auto [b1, b2, b3] (priArr); // b1 是 priArr[0] 的只读拷贝，b2, b3类推
  auto &[c1, c2, c3] {priArr}; // c1 是 priArr[0] 的引用，c2, c3类推
  c3 = 14;                     // priArr[2]的值变为14
  return 0;
}


int main() {
  std::array stdArr = {'a','b','c'};
  auto [d1, d2, d3] {stdArr}; 
  return 0;
}
```

#### for Object member

若初始化表达式为类/结构体类型，则标识符列表中的名字绑定到类/结构体的非静态数据成员上

1)       数据成员必须为公有成员

2)       标识符数量必须等于数据成员的数量

3)       标识符类型与数据成员类型一致

## String Literals

#### C++11 Raw String Literals

R "*delimiter( raw_characters )delimiter*"

```cpp
const char* s3 = R"NoUse(Hello 

World)NoUse";


const char* s1 = R"(Hello

World)";
```

#### C++14: String Literals 

C++14将运算符  ""s 进行了重载，赋予了它新的含义，使得用这种运算符括起来的字符串字面量，自动变成了一个 std::string 类型的对象。

```cpp
auto hello = "Hello!"s;              // hello is of std::string type

auto hello = std::string{"Hello!"};  // equals to the above

auto hello = "Hello!";               // hello is of const char* type
```

## array类

#### C Style Array (C++ raw array，也叫做C++原生数组)

```cpp
int arr[ ] = { 1, 2, 3 };
```

* arr 可能会退化为指针：void f(int a[]) { std::cout << sizeof(a)/sizeof(a[0]); }

- arr 不知道自己的大小： sizeof(arr)/sizeof(arr[0])

- 两个数组之间无法直接赋值: array1 = array2;

- 不能自动推导类型：auto a1[] = {1,2,3};


####  C++ Style Array

- 是一个容器类，所以有迭代器（可以认为是一种用于访问成员的高级指针）

- 可直接赋值

- 知道自己大小：size()

- 能和另一个数组交换内容：swap()

- 能以指定值填充自己: fill()

- 取某个位置的元素( 做越界检查) ：at()



C++数组类是一个模板类，可以容纳任何类型的数据

```cpp
#include <array>

std::array< 数组 类型,  数组大小>   数组名字;

std::array< 数组 类型,  数组大小>   数组 名字 { 值1,  值2, …};
```

限制与C风格数组相同

```cpp
std::array<int , 10> x;

std::array<char , 5> c{ 'H','e','l','l','o' };
```

C++17 Type Deduction for std::array (std::array的类型推导)


C++17引入了一种新特性，对类模板的参数进行推导 

示例：

```cpp
std::array a1 {1, 3, 5};            // 推导出  std::array<int, 3>

std::array a2 {'a', 'b', 'c', 'd'};   // 推导出  std::array<char, 4>
```

## Constant Expressions

Constant expression is an expression that can be evaluated at compile time. (常量表达式是编译期可以计算值的一个表达式)


// 例如：C++ 数组的大小要求是编译期的一个常量（原生数组以及std::array）

```cpp
int n = 1; 

n ++;

std::array<int, n> a1; // error: n is not a constant expression 

const int cn = 2; 

std::array<int, cn> a2; // OK: cn is a constant expression 
```

2. const 修饰的对象未必是编译期常量

```cpp
const int rcn = n; // rcn is runtime constant, compiler does 

                   // NOT know its value at compile-time  

rcn = ++n;         // error: rcn is read-only  

std::array<int , rcn> a3; // error: rcn is NOT known at compile-time
```

**C++11 constexpr: 编译期常量表达式说明符**

constexpr specifier declares that it is possible to evaluate the value of the function or variable at compile time. (constexpr说明符声明可在编译时计算函数或变量的值)

```cpp
constexpr int max(int a , int b) { // c++11 引入 constexpr
  if (a > b) return a;   // c++14才允许constexpr函数中有分支循环等
  else return b;

}

int main() {
  int m = 1;
  const int rcm = m++;   // rcm是运行期常量
  const int cm = 4;      // 编译期常量，等价于: constexpr int cm = 4;
  int a1[ max(m , rcm)]; // 错误：m & rcm 不是编译期常量
  std::array<char , max(cm , 5)> a2; // OK: cm 和 5 是编译期常量 
}
```

**const vs constexpr**

**const** ：  告知程序员，const 修饰的内容是不会被修改的。主要目的是帮程序员避免bug 。

 ```cpp
 char* s1 = "Hello"; // C语言允许，但C++编译出错
 
 *s1 = 'h’;          // C语言中，语法正确，但运行时会出错 
 
 const char* s2 = "World"; // C++ 要求加const
 
 *s2 = 'w';                // C++编译器报错
 ```

**constexpr** ：用在所有被要求使用“constant expression”的地方（就是constexpr 修饰的东西可以在编译期计算得到值），主要目的是让编译器能够**优化代码提升性能** 。

## assert

assert:为c语言的宏（Macro）

用法：

包含头文件 <cassert>  以调试模式编译程序

assert( bool_expr ); // bool_expr 为假则中断程序

```cpp
std::array a{ 1, 2, 3 };  //C++17 类型参数推导

for (size_t i = 0; i <= a.size(); i++) {

  assert(i < 3);  //断言：i必须小于3，否则失败

  std::cout << a[ i ];

  std::cout << (i == a.size() ? "" : " ");
```

#### assert()依赖于NDEBUG 宏 

NDEBUG这个宏是C/C++标准规定的，所有编译器都有对它的支持。

(1)   调试(Debug)模式编译时，编译器不会定义NDEBUG，所以assert()宏起作用。

(2)   发行(Release)模式编译时，编译器自动定义宏NDEBUG，使assert不起作用

如果要强制使得assert()生效或者使得assert()不生效，只要手动 #define NDEBUG 或者 #undef NDEBUG即可。

```cpp
#undef NDEBUG   // 强制以debug模式使用<cassert>

int main() {

  int i;

  std::cout << "Enter an int: ";

  std::cin >> i;

  assert((i > 0) && "i must be positive"); 

  return 0;

}
```

#### static_assert(C++11静态断言)

static_assert ( bool_constexpr, message)

(1)      bool_constexpr:   **编译期常量表达式**，可转换为bool 类型，不可出现变量表达式

(2)      message: 字符串字面量 ，是断言失败时显示的警告信息。自C++17起，message是可选的

## 声明与定义



* A declaration introduces an identifier and describes its type, be it a type, object, or function. A declaration is what the **compiler** needs to accept references to that identifier. (“声明”是引入标识符并描述其类型，无论是类型，对象还是函数。**编译器**需要该“声明”，以便识别在它处使用该标识符。)

  ```cpp
  extern int bar;
  
  extern int g(int, int);
  
  double f(int, double); // extern can be omitted for function declarations
  
  class foo; // no extern allowed for type declarations
  ```

* A definition actually instantiates/implements this identifier. It's what the **linker** needs in order to link references to those entities (“定义”实例化/实现这个标识符。**链接器**需要“定义”，以便将对标识符的引用链接到标识符所表示的实体)

  ```cpp
  int bar;
  
  int g(int lhs, int rhs) {return lhs*rhs;}
  
  double f(int i, double d) {return i+d;}
  
  class foo {};
  ```

**区别**

（1） A definition can be used in the place of a declaration ( 定义有时可取代声明，反之则不行)

（2） An identifier can be declared more than once, but can be defined only once ( 标识符可被声明多次，但只能定义一次

（3） 定义通常伴随着编译器为标识符分配内存

 **总结**


(1) Declaration: "Somewhere, there exists a foo." ( 声明：某个地方有个foo)

(2) Definition: "...and here it is!"  ( 定义：它在这儿，长成这样)

## 实现与声明分离（Seperating Declaration from Implementation）

C++ allows you to separate class declaration from implementation. (C++中，类声明与实现可以分离)

(1)   .h:   类声明，描述类的结构

(2)   .cpp:  类实现，描述类方法的实现

```cpp
FunctionType ClassName :: FunctionName (Arguments) { //… }
```

其中，:: 这个运算符被称为binary scope resolution operator（二元作用域解析运算符），简称“域分隔符”

When a function is implemented inside a class declaration, it automatically becomes an inline function. (当函数在类声明中实现，它自动成为内联函数)

```cpp
class A {

public:

  A() = default; //C++11

  double f1() {  // f1自动称为内联函数

    // do something

  } 

  double f2();

};

double A::f2() {  // f2不是内联函数

  //do something

}

 

class A {

public:

  A() = default; //C++11

  double f1();

  double f2();

};

double A::f2() {

  //do something

}

inline double A::f1() { // f1是内联函数

  //do something

}
```

## 避免头文件被多次包含

 ```cpp
  #ifndef MY_HEADER_FILE_H
  #define MY_HEADER_FILE_H
  //CONTENT
  #endif
  ```


 ```cpp
  #pragma once //c++03,c90
  ```



 ```cpp
  _Pragma("once")//c++11,c99
  ```

  实际上为运算符

## 文件系统

About std::filesystem(std::filesystem简介)

C++17 std::filesystem provides facilities for performing operations on file systems and their components, such as paths, regular files, and directories。（标准库的filesystem提供在文件系统与其组件，例如路径、常规文件与目录上进行操作的方法）

* File(文件)：持有数据的文件系统对象，能被写入或读取。文件有名称和属性，属性之一是文件类型

* Path(路径)：标识文件所处位置的一系列元素，可能包含文件名

  ```cpp
  namespace fs = std::filesystem;
  
  fs::path p{ "CheckPath.cpp" };
  ```

  *  Absolute Path (platform dependent) (绝对路径)：An absolute path contains a file name with its complete path and drive letter.(包含完整的路径和驱动器符号)

  * Relative Path (相对路径)

    Contains NO drive letter or  leading "/" (不包含驱动器及开头的/符号)

    The file stores in the path Relative to "Current Path" (文件存在相对于“当前路径”的位置)

| **OS Type**                | **Absolute path**         | **Directory path** |
| -------------------------- | ------------------------- | ------------------ |
| Windows(case insensitive)  | **c:\example\scores.txt** | c:\example         |
| Unix/Linux(case sensitive) | **/home/cyd/scores.txt**  | /home/cyd          |

 

3. Differences between Windows and Linux(两种操作系统的不同)

|              | **Windows**         | **Linux** | **C++**                                    | **java**                              |
| ------------ | ------------------- | --------- | ------------------------------------------ | ------------------------------------- |
| 行结束字符   | \r\n                | \n        | -                                          | System.getProperty("line.separator"); |
| 路径名分隔符 | '\\'                | '/'       | std::filesystem::path::preferred_separator | java.io.File.separator                |
| 路径名       | a:\b\c 或\\host\b\c | /a/b/c    | std::filesystem::path                      | -                                     |

```cpp
// The directory separator for Windows is a backslash (\), which needs special treat

namespace fs = std::filesystem;

fs::path p1("d:\\cpp\\hi.txt"); // 字符串中的反斜杠要被转义

fs::path p2("d:/cpp/hi.txt");   // Windows也支持正斜杠

fs::path p3(R"(d:\cpp\hi.txt)");// 使用原始字符串字面量
```

#### Path类

* Members functions of path class(path类的成员函数)

  **构造**

  * path(string)

    构造函数

  * assign(string): path&

    为路径对象赋值

  **连接**

  * append(type p): path&

    将p追加到路径后。type是string、path或const char*。等价于   /= 运算符；自动添加目录分隔符

  * concat(type p): path&

    将p追加到路径后。type是string、path或const char*。等价于+=运算符；不自动添加目录分隔符

  **修改器**

  * clear(): void

    清空存储的路径名

  * remove_filename(): path&

    从给定的路径中移除文件名

  * replace_filename(const path&   replacement): path&

    以 replacement 替换文件名

  **分解**

  * root_name(): path

    返回通用格式路径的根名

  * root_directory(): path

    返回通用格式路径的根目录

  * root_path(): path

    返回路径的根路径，等价于   root_name() / root_directory()，即“路径的根名 / 路径的根目录”

  * relative_path(): path

    返回相对于 root-path 的路径

  * parent_path(): path

    返回到父目录的路径

  * filename(): path

    返回路径中包含的文件名

  * stem(): path

    返回路径中包含的文件名，不包括文件的扩展名

  * extension(): path

    返回路径中包含的文件名的扩展名

  **查询**

  * empty(): bool

    检查路径是否为空

  * has_xxx(): bool

    其中“xxx”是上面“分解”类别中的函数名。这些函数检查路径是否含有相应路径元素

* Non-member functions (非成员函数)

  * operator/( const path& lhs, const   path& rhs )

    以偏好目录分隔符连接二个路径成分   lhs 和   rhs。比如   path p{"C:"}; p = p / "Users" /   "batman";

  * operator <<, >> (path p)

    进行路径 p 上的流输入或输出

  **文件类型**

  * s_regular_file( const path& p ): bool

    检查路径是否是常规文件

  * is_directory( const path& p ): bool

    检查路径是否是目录

  * is_empty( const path& p ): bool

    检查给定路径是否指代一个空文件或目录

  **查询**

  * current_path(): path

    返回当前工作目录的绝对路径（类似linux指令 pwd）

  * current_path( const path& p ): void

    更改当前路径为p （类似linux指令 cd）

  * file_size( const path& p ): uintmax_t  

    对于常规文件 p ，返回其大小；尝试确定目录(以及其他非常规文件)的大小的结果是由编译器决定的

  * space(const path& p): space_info

    返回路径名 p 定位于其上的文件系统信息。space_info中有三个成员：capacity ——文件系统的总大小(字节)，free ——文件系统的空闲空间(字节)，available ——普通进程可用的空闲空间（小于或等于   free ）

  * status(const path& p): file_status

    返回 p 所标识的文件系统对象的类型与属性。返回的file_status是一个类，其中包含文件的类型(type)和权限(permissions)

  修改

  * remove(const path& p): bool

    删除路径 p 所标识的文件或空目录

  * remove_all(const path& p): uintmax_t

    递归删除 p 的内容（若它是目录）及其子目录的内容，然后删除   p 自身，返回被删文件及目录数量

  * rename(const path& old_p,const path& new_p): void

    移动或重命名 old_p 所标识的文件系统对象到   new_p(类似linux指令mv)

  * copy( const path& from, const   path& to ): void

    复制文件与目录。另外一个函数   bool copy_file(from, to) 拷贝单个文件

  * create_directory( const path& p ):   bool

    创建目录 p （父目录必须已经存在）,若 p 已经存在，则函数无操作

  * create_directories( const path& p ):   bool

    创建目录 p （父目录不一定存在）,若 p 已经存在，则函数无操作

#### Comparision of File Manipulation between C and C++ (文件操作对比)

|                           |                               | C++                                                          | C                                                            |
| ------------------------- | ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
|                           | **file input**                | ifstream *(i: input; f:file)*                                |                                                              |
| **Header File (头文件)**  | **file output**               | ofstream *(o: ouput; f:file)*                                | stdio.h                                                      |
|                           | **file input & output**       | fstream                                                      |                                                              |
|                           | **read from file   (读文件)** | >>;get(); get(char); get(char*);getline();read(char*,streamsize); | fscanf();fgets(char*, size_t , FILE*);fread(void **ptr*, *size*, *nitems*,  FILE **stream*); |
| **Read/Write (读写操作)** | **write to file   (写文件)**  | <<;put(char), put(int);write (const char*, streamsize);flush() | fprintf();fwrite(const void **ptr*, *size*,  *nitems*, FILE **stream*);fputs(const char*, FILE *); |
|                           | **Status test   (状态测试)**  | eof(); bad(); good(); fail()                                 | feof(); ferror();                                            |

####  Hierarchy of C++ I/O Stream Classes(C++ I/O流类层次)

<img src="https://edu-image.nosdn.127.net/8C0A3ED498876420B3B389880C16AB06.jpg?imageView&thumbnail=890x0&quality=100" alt="img" referrerpolicy="no-referrer">

C++的流类主要有五类：

1.      流基类（ios_base和ios）

2.      标准输入输出流类（istream/ostream/iostream）

3.      字符串流类（istringstream/ostringstream）

4.      文件流类（ifstream/ofstream/fstream）

5.      缓冲区类（streambuf/stringbuf/filebuf）

**标准输入输出流对象 cin 和 cout 分别是类 istream 和 ostream 的实例**



#### **输出至文件**

<img src="https://edu-image.nosdn.127.net/25E9455E1328577B96EF36ED9E09C3E7.jpg?imageView&thumbnail=890x0&quality=100" alt="img" referrerpolicy="no-referrer">

#### 自文件读入

<img src="https://edu-image.nosdn.127.net/A08D7DA2B4D44442E89724B4256254CB.jpg?imageView&thumbnail=890x0&quality=100" alt="img" referrerpolicy="no-referrer">

To read data correctly, you need to know exactly how data is stored.(若想正确读出数据，必须确切了解数据的存储格式)

* Testing if a file is successfully opened (检测文件是否成功打开)

  * Errors may occur (可能出现错误):
    * the file does not exist when reading a file (读文件时文件不存在)
    * the media is ReadOnly when writing a file (e.g. write to a CD) (写文件时介质只读)
  * To detect if a file is successfully opened: (检测文件是否正确打开的方法)

  invoke fail()  immediately after open(). (open()之后马上调用fail()函数), if fail() returns true, the file is not opened (does not exist). (fail()返回true, 文件未打开)

```cpp
ofstream output("scores.txt");

if (output.fail())  {

    cout << R"(Can't open file "scores.txt"!)";

  }
```

* Testing End of File (检测是否已到文件末尾)

  Use eof() function to detect the end of file (用eof()函数检查是否是文件末尾)

```cpp
ifstream in("scores.txt");

while (in.eof() == false) {

  cout << static_cast<char>(in.get());

}
```

#### Functions for I/O stream

* getline()

  member function getline(char* buf, int size, char delimiter)

  non-member function std::getline(istream& is, string& str, char delimiter)

  When using (>>), data are delimited by whitespace. (>>运算符用空格分隔数据)

  ```cpp
  constexpr int SIZE{ 40 };
  
  std::array<char , SIZE> name{};
  
  while (!input.eof()) {// not end of file
  
    input.getline(&name[ 0 ] , SIZE , '#');
  
    std::cout << &name[ 0 ] << std::endl;
  
  }
  
  
  
  std::string name2{};
  
  while (!input.eof()) {
  
    std::getline(input, name2, '#');
  
    std::cout << n << std::endl;
  
  }
  ```

* get() and put()

  Two other useful functions are get and put.

  * get: read a character

    ```cpp
    int istream::get();
    
    
    istream& get (char& c);
    is.get(c);
    ```

  * put:write a character.

    ```cpp
    ostream& put (char c)
    ```

* flush()

  Flush output stream buffer (将输出流缓存中的数据写入目标文件)

  ostream& flush();

  ```cpp
  cout.flush(); // 其它输出流对象也可以调用 flush()
  
  cout << "Hello" << std::flush; // 与endl类似作为manipulator的调用方式
  ```

#### 格式化输出

* setw manipulator(“设置域宽”控制符)

  要包含头文件 <iomanip>

  setw(n) 设置域宽，即数据所占的总字符数

  ```cpp
  std::cout << std::setw(3) << 'a' 
              <<  std::endl;
  
  //_ _a
  ```

  setw()控制符只对其后输出的第一个数据有效，其他控制符则对其后的所有输入输出产生影响。

  ```cpp
  std::cout << std::setw(5) << 'a'
              << 'b' << std::endl;
  
  //_ _ _ _ab
  ```

  setw()的默认为setw(0)，按实际输出


   如果输出的数值占用的宽度超过setw(int n)设置的宽度，则按实际宽度输出。

* setprecision manipulator(“设置浮点精度”控制符)


  setprecision(int n)


  (1)     控制显示浮点数的有效位

  (2)     n代表数字总位数

  ```cpp
  #include <iostream>
  
  #include <iomanip>
  
  using namespace std;
  
  int main() {
  
    float f = 17 / 7.0;
  
    cout <<                    f << endl;
  
    cout << setprecision(0) << f << endl;
  
    cout << setprecision(1) << f << endl;
  
    cout << setprecision(2) << f << endl;
  
    cout << setprecision(3) << f << endl;
  
    cout << setprecision(6) << f << endl;
  
    cout << setprecision(8) << f << endl;
  
    return 0;
  
  }
  ```

* setfill manipulator(“设置填充字符”控制符)

  setfill(c)

  设置填充字符，即“<<"符号后面的数据长度小于域宽时，使用什么字符进行填充

  ```cpp
  std::cout << std::setfill('*') 
             << std::setw(5) << 'a' 
             << std::endl;
  
  //****a
  ```

| **控制符**                               | **用途**                                                     |
| ---------------------------------------- | ------------------------------------------------------------ |
| setw(width)                              | 设置输出字段的宽度(仅对其后第一个输出有效)                   |
| setprecision(n)                          | 设置浮点数的输/入出精度(总有效数字个数等于n)                 |
| fixed                                    | 将浮点数以定点数形式输入/出(小数点后有效数字个数等于setprecision指定的n) |
| showpoint                                | 将浮点数以带小数点和结尾0的形式输入/出，即便该浮点数没有小数部分 |
| left                                     | 输出内容左对齐                                               |
| right                                    | 输出内容右对齐                                               |
| hexfloat/defaultfloat                    | C++11新增；前者以定点科学记数法的形式输出十六进制浮点数，后者还原默认浮点格式 |
| get_money(money)put_money(money)         | C++11新增；从流中读取货币值，或者将货币值输出到流。支持不同语言和地区的货币格式https://en.cppreference.com/w/cpp/io/manip/get_moneyhttps://en.cppreference.com/w/cpp/io/manip/put_money |
| get_time(tm,  format)put_time(tm,format) | C++11新增；从流中读取日期时间值，或者将日期时间值输出到流。https://en.cppreference.com/w/cpp/io/manip/get_timehttps://en.cppreference.com/w/cpp/io/manip/put_time |

 The stream manipulator also works to format output to a file(流控制符同样可以用于文件输入/输出)

#### File Open Mode

When opening an *fstream* object, a "file open mode" should be specified(创建fstream对象时，应指定文件打开模式)。

| **Mode(模式)** | **Description(描述)**                                        |
| -------------- | ------------------------------------------------------------ |
| ios::in        | 打开文件读数据                                               |
| ios::out       | 打开文件写数据                                               |
| ios::app       | 把输出追加到文件末尾。app = append                           |
| ios::ate       | 打开文件，把文件光标移到末尾。ate = at end                   |
| ios::trunc     | 若文件存在则舍弃其内容。这是ios::out的默认行为。trunc = truncate |
| ios::binary    | 打开文件以二进制模式读写                                     |

 ```cpp
 std::fstream{p,ios::app|ios::binary}
 ```

###### Open Mode

Combine several modes (几种模式可以组合在一起)


using the | operator (bitwise inclusive OR) (用“位或”运算符)

```cpp
// std::ios_base::openmode 被ios继承

typedef /*implementation defined*/ openmode;

static constexpr openmode app = /*implementation defined*/
```

####  Binary IO 

TEXT file vs BINARY file (not technically precise) (文本文件与二进制文件)


(1)     Both stores as a sequence of bits  (in binary format) (都按二进制格式存储比特序列)

(2)     text file  : interpreted as a sequence of characters (解释为一系列字符)

(3)     binary file : interpreted as a sequence of bits. (解释为一系列比特)

Text I/O is built upon binary I/O to provide a level of abstraction for character encoding and decoding. (文本模式的读写是建立在二进制模式读写的基础上的，只不过是将二进制信息进行了字符编解码)

 By default, a file is opened in text mode.(文件默认以文本模式打开)

open a file using the binary mode ios::binary.(用ios::binary以二进制模式打开文件)

|      | **Text  I/O (文本模式)**        | **Binary  I/O function:(二进制模式)** |
| ---- | ------------------------------- | ------------------------------------- |
| 读   | operator  >>; get(); getline(); | read();                               |
| 写   | operator  <<; put();            | write();                              |

##### The write Function (write函数)


ostream& write( const char* s, std::streamsize count )

 ```cpp
 fstream fs("GreatWall.dat", ios::binary|ios::trunc);
 
 char s[] = "ShanHaiGuan\nJuYongGuan";
 
 fs.write(s, sizeof(s));
 ```

将非字符数据写入文件


(1)     Convert any data into a sequence of bytes (byte stream) (先将数据转换为字节序列，即字节流)

(2)     Write the sequence of bytes to file with write() (再用write函数将字节序列写入文件)

 **How to convert any data into byte stream? (如何将信息转换为字节流)**

2.1. reinterpret_cast


该运算符有两种用途：

(1)     cast the address of a type to another type (将一种类型的地址转为另一种类型的地址)

(2)     cast the address to a number, i.e. integer (将地址转换为数值，比如转换为整数)

**语法**：

**reinterpret_cast<dataType>(address)** 


address is the starting address of the data (address是待转换的数据的起始地址)

dataType is the data type you are converting to. (dataType是要转至的目标类型)

**For binary I/O, dataType is char *. (对于二进制I/O来说，dataType是 char*)**

```cpp
long int x {0};

int a[3] {21,42,63};

std::string str{"Hello"};

char* p1 = reinterpret_cast<char*>(&x); // variable address

char* p2 = reinterpret_cast<char*>(a);  // array address

char* p3 = reinterpret_cast<char*>(&str); // object address
```

##### The read Function (read成员函数)


istream& read ( char* s, std::streamsize count );

```cpp
// 读字符串

fstream bio("GreatWall.dat", ios::in | ios::binary);

char s[10];

bio.read(s, 5);

s[5] = '\0';

cout << s;

bio.close();

// 读其它类型数据（整数），需要使用 reinterpret_cast

fstream bio("temp.dat", ios::in | ios::binary);

int value;

bio.read(reinterpret_cast<char *>(&value), sizeof(value));

cout << value;
```

#### File Positioner

文件位置指示器

A file consists of a sequence of bytes.(文件由字节序列构成)

File positioner is a special marker that is positioned at one of these bytes. (一个特殊标记指向其中一个字节)

A read or write operation takes place at the location of the file positioner. (读写操作都是从文件位置指示器所标记的位置开始)

When a file is opened, the fp is set at the beginning. (打开文件，fp指向文件头)

When you read or write data to the file, the file pointer moves forward to the next data item. (读写文件时，文件位置指示器会向后移动到下一个数据项)

#### Random Acess

Random Access means one can read/write anywhere inside a file(随机访问意味着可以读写文件的任意位置)

How?


We are able to know where the file positioner is. (我们能知道文件定位器在什么位置)

We are able to move the file positioner inside the file (我们能在文件中移动文件定位器)

Maybe we need two file positioners : one for reading, another for writing

| **·**                    | **For reading (读文件时用)**            | **For writing(写文件时用)**             |
| ------------------------ | --------------------------------------- | --------------------------------------- |
| 获知文件定位器指到哪里   | *tellg();* tell是获知，g是get表示读文件 | *tellp();* tell是获知，p是put表示写文件 |
| 移动文件定位器到指定位置 | *seekg();* seek是寻找，g是get表示读文件 | *seekp();* seek是寻找，p是put表示写文件 |

xxx_stream& seekg/seekp( pos_type pos );

xxx_stream& seekg/seekp( off_type off, std::ios_base::seekdir dir);

| **seekdir** **文件定位方向类型** | **解释**                              |
| -------------------------------- | ------------------------------------- |
| std::ios_base::beg               | 流的开始；beg = begin                 |
| std::ios_base::end               | 流的结尾                              |
| std::ios_base::cur               | 流位置指示器的当前位置；cur = current |

 

| **例子**                    | **解释**                                             |
| --------------------------- | ---------------------------------------------------- |
| seekg(42L);                 | 将文件位置指示器移动到文件的第42字节处               |
| seekg(10L, std::ios::beg);  | 将文件位置指示器移动到从文件开头算起的第10字节处     |
| seekp(-20L, std::ios::end); | 将文件位置指示器移动到从文件末尾开始，倒数第20字节处 |
| seekp(-36L, std::ios::cur); | 将文件位置指示器移动到从当前位置开始，倒数第36字节处 |



## Left Value, Pure Right Value and eXpiring Value

#### C++03 lvalue and rvalue (C++03的左值和右值)


通俗理解

(1)     能放在等号左边的是lvalue

(2)     只能放在等号右边的是rvalue

(3)     lvalue可以作为rvalue使用

####  C++11: Left Value


An lvalue designates a function or an object, which is an expression whose  address can be taken (左值指定了一个**函数或者对象**，它是一个可以取地址的表达式)

```cpp
int lv1{ 42 }; // Object

int main() {

  int& lv2{ lv1 }; // Lvalue reference to Object

  int* lv3{ &lv1 }; // Pointer to Object

}

int& lv4() { return lv1; } // Function returning Lvalue Reference
```

#### C++11: Pure Right Value


prvalue(Pure Right Value，纯右值)：是不和对象相关联的值(字面量)或者其求值结果是**字面量**或者一个匿名的**临时对象**


(1)     除字符串字面量以外的字面量，比如 32, 'a'

(2)     返回非引用类型的函数调用 int f() { return 1;}

(3)     后置自增/自减表达式i++/i--

(4)     算术/逻辑/关系表达式（a+b、a&b、a<<b）（a&&b、a||b、~a）（a==b、a>=b、a<b）

(5)     取地址（&x）

 **左值可以当成右值使用**

#### C++11: eXpiring Value


xvalue(eXpiring Value，将亡值)：将亡值也指定了一个对象，是一个将**纯右值转换为右值引用**的表达式

```cpp
int prv(int x) { return 6 * x; } // pure rvalue 

int main() {

  const int& lvr5{ 21 }; // 常量左值引用可引用纯右值

  int& lvr6{ 22 }; // 错！非常量左值引用不可引用纯右值

  int&& rvr1{ 22 }; // 右值引用可以引用纯右值

  int& lvr7{ prv(2) }; // 错！非常量左值引用不可引用纯右值

  int&& rvr2{ prv(2) }; // 右值引用普通函数返回值

  rvr1 = ++rvr2; // 右值引用做左值使用

}
```

## 运算符重载

不可重载的运算符

| Operator | Name               |
| -------- | ------------------ |
| .        | **类属关系运算符** |
| .*       | **成员指针运算符** |
| ::       | **作用域运算符**   |
| ? :      | **条件运算符**     |
| ##        | **编译预处理符号** |

**Restrictions for operator overloading (运算符重载的限制)**


(1)     Precedence and Associativity are  unchangeable (优先级和结合性不变)

(2)     NOT allowing to create new operator (不可创造新的运算符)

重载的运算符必须和用户定义的class类型一起使用


重载的运算符的参数至少应有一个是类对象(或类对象的引用)

<img src="https://edu-image.nosdn.127.net/26D6D0D7CCEA9856BC70B29511F82886.jpg?imageView&thumbnail=890x0&quality=100" alt="img" referrerpolicy="no-referrer">

### 运算符函数的调用形式  

| 表达式                                                       | 作为成员函数         | 作为非成员函数   | 示例                                                         |
| ------------------------------------------------------------ | -------------------- | ---------------- | ------------------------------------------------------------ |
| @a                                                           | (a).operator@ ( )    | operator@ (a)    | 调用 [std::cin](https://zh.cppreference.com/w/cpp/io/cin).operator!() |
| a@b                                                          | (a).operator@ (b)    | operator@ (a, b) | [std::cout](https://zh.cppreference.com/w/cpp/io/cout) << 42 调用 [std::cout](https://zh.cppreference.com/w/cpp/io/cout).operator<<(42) |
| a=b                                                          | (a).operator= (b)    | 不能是非成员     | [std::string](https://zh.cppreference.com/w/cpp/string/basic_string) s; s = "abc"; 调用 s.operator=("abc") |
| a(b...)                                                      | (a).operator()(b...) | 不能是非成员     | [std::random_device](https://zh.cppreference.com/w/cpp/numeric/random/random_device) r; auto n = r(); 调用 r.operator()() |
| a[b]                                                         | (a).operator[](b)    | 不能是非成员     | [std::map](https://zh.cppreference.com/w/cpp/container/map)<int, int> m; m[1] = 2; 调用 m.operator[](1) |
| a->                                                          | (a).operator-> ( )   | 不能是非成员     | auto p = [std::make_unique](https://zh.cppreference.com/w/cpp/memory/unique_ptr/make_unique)<S>(); p->bar() 调用 p.operator->() |
| a@                                                           | (a).operator@ (0)    | operator@ (a, 0) | [std::vector](https://zh.cppreference.com/w/cpp/container/vector)<int>::iterator i = v.begin(); i++ 调用 i.operator++(0) |
| 此表中，**@** 是表示所有匹配运算符的占位符：@a 为所有前缀运算符，a@ 为除 -> 以外的所有后缀运算符，a@b 为除 = 以外的所有其他运算符 |                      |                  |                                                              |

### 二元

复合二元运算符

```cpp
Vec2D Vec2D::operator +(const  Vec2D& secondVec2D ) {

  *this = this->add(secondVec2D);

  return (*this);

}

Vec2D Vec2D::add(const Vec2D& secondVec2D) { //prvalue

  double m = x_ + secondVec2D.getX()

  double n = y_ + secondVec2D.y_;

  return Vec2D(m, n);  //临时的匿名对象

}
```

How to make v2[] an Lvalue? (如何使r2[]成为左值)


declare the [] operator to return a reference (使[]返回一个引用)

```cpp
double& Vec2D::operator[](const int &index) { //lvalue

  if (index == 0)

    return x_;  //x_ can be modified

  //...... Now, the Vec2D class is mutable.

}
```

### 一元

当编译器遇到   @obj;  时，


若operator @是在obj的类中的成员，则调用

obj.operator @()

若operator @是obj的类的 friend 函数，则调用

operator @(obj)

#### -

```cpp
Vec2D Vec2D::operator-(){//无参数

  return Vec2D(-this->x_, -this->y_); // 返回匿名临时对象 

}
```

#### 自增自减

前置++/--重载无参数，返回引用类型

后置++/--重载带参数--"dummy"参数 仅作占位

| **运算符名** | **语法** | **可重载** | **原型示例（对于类** **class T****）** |                                  |
| ------------ | -------- | ---------- | -------------------------------------- | -------------------------------- |
| 类内定义     | 类外定义 |            |                                        |                                  |
| **前自增**   | ++a      | 是         | T& T::operator++();                    | T& operator++(T& a);             |
| **前自减**   | --a      | 是         | T& T::operator--();                    | T& operator--(T& a);             |
| **后自增**   | a++      | 是         | T T::operator++(int *dummy*);          | T operator++(T& a, int *dummy*); |
| **后自减**   | a--      | 是         | T T::operator--(int *dummy*);          | T operator--(T& a, int *dummy*); |

### 流运算符

运算符重载为类成员函数后,当调用该运算符时,左操作数必须是该类的实例。若<<和>>重载为成员函数，则只能用 v1<<cout;

因此 << (>>) should be overloaded as "friend function" (只能重载为友元函数)

```cpp
class Vec2D { //重载为成员函数

public:

    ostream &operator<<(ostream &stream);

    istream &operator>>(istream &stream);

};

Vec2D v1;

v1 << cout; //Vec2D对象只能作为第一个操作数

 

 



struct Vec2D { //重载为友元函数

  friend ostream &operator<<(ostream &stream, Vec2D &v);

  friend istream &operator>>(istream &stream, Vec2D &v);

};

Vec2D v1;

cout << v1;
```

### 对象转换运算符

```cpp
Vec2D::operator double() {//无返回值类型

  return magnitude();

}

Vec2D v1(3, 4);

double d = v1 + 5.1; // d: 10.1  

double e = static_cast<double>(v1);  // e: 5.0
```

### 赋值运算符

By default, the = operator performs a memberwise copy from one object to the other. (默认情况下，赋值运算符执行对象成员的一对一拷贝)

To change the way the default assignment operator = works, you need to overload the = operator. (重载赋值运算符，会改变其默认工作方式)

一般情况下，如果拷贝构造函数需要执行深拷贝，那么赋值运算符需要重载

## 异常处理

```cpp
try {

  Code to try;

  throw an exception    (1) with a throw statement

                          (2) or from function;

  More code to try;

}

catch (type e) {

  Code to process the exception;

}
```



```cpp
int quotient(int number1, 

             int number2) {

  if (number2 == 0) 

    throw number1; 

  return number1 / number2;

} 

int main() {

  try {

    int x = quotient(1, 0);

  } catch (int) {

    std::cout << "除数为0！";

  }

}
```

#### 异常匹配与异常类

catch ( ExceptionType& parameter ) { /* 处理异常 */ }

若try{}中所抛异常类型与catch()的参数类型(ExceptionType)匹配，则进入catch块

若对异常对象的内容不感兴趣，可省略catch参数，只保留类型

**Base Class of Exception in Standard Library(标准库中的异常基类)**

#include <exception>

Class exception

```cpp
exception(); // 构造函数

virtual const char* what(); //返回解释性字符串 
```

what()返回的指针指向拥有解释信息的空终止字符串的指针。该指针保证在获取它的异常对象被销毁前，或在调用该异常对象的非静态成员函数前合法

<img src="https://edu-image.nosdn.127.net/FC0524938D6AAFD2AA605AA2137C8880.jpg?imageView&thumbnail=890x0&quality=100" alt="img" referrerpolicy="no-referrer">

#### c++11 noexcept

C++03将throw(ExceptionType)放到函数后面，说明函数会抛出什么类型的异常，也被称为“异常规约”


java用 throws关键字做同样的事情

C++11后基本没人用“异常规约”

C++11使用noexcept指明函数是否抛出异常

* 若函数不抛异常，则可做编译优化

* 即便函数抛异常，也不再说明所抛异常类型(简化)

noexcept不能用于区分重载函数 (对比：函数名后面的const可区分重载)

#### 重抛异常

#### When to **rethrow** an exception?

(1)   if the handler cannot process the exception (当它无法处理该异常)

(2)   the handler simply wants to let its caller be notified (或想通知它的调用者发生了一个异常)

 ```cpp

try {

 // statements;

}

catch (TheException &ex) {

  // Do something;

 throw;

}
 ```

## 模板

* Programming(编程): Writing a program that creates, transforms, filters, aggregates and otherwise manipulates data. (写一个程序去处理数据)

* Metaprogramming(元编程): Writing a program that creates, transforms, filters, aggregates and otherwise manipulates programs.(写个程序去处理程序)

  C++ implements MetaProgramming with "template" to produce template instance, i.e. programs, in compiling time. (C++用**模板**实现元编程，由编译器在编译期根据模板生成模板实例，也就是程序)

* Generic Programming(泛型编程): Writing a program that creates, transforms, filters, aggregates and otherwise manipulates data, but makes only the minimum assumptions about the structure of the data, thus maximizing reuse across a wide range of datatypes.(写个程序去处理数据，但是只对数据的结构做最小假设以使该程序能重用于处理广泛的数据类型)

  Generic programming in C++ (i.e. **compile-time polymorphism**) is accomplished by metaprogramming (i.e. code generation from templated code).(C++的泛型编程，即**编译时多态**，是藉由元编程实现的，也就是由代码模板生成代码)

### Template 

  模板

<img src="https://edu-image.nosdn.127.net/6624DA8B3BC36817154DD38DF7F70F44.jpg?imageView&thumbnail=890x0&quality=100" alt="img" referrerpolicy="no-referrer">



```cpp
template < typename   T,  typename   S >

auto add (T  x1, S x2) { //C++14

    return (x1 + x2);

}
```

A function template is just a blueprint, not a type, or a function. (函数模板只是蓝图，本身不是不是类型、函数)

编译器扫描代码，遇到模版定义时，并不立即产生代码

The template arguments must be determined so that the compiler can generate an actual function (确定模板实参后，编译器生成实际函数代码)

两种实例化方法 (确定模板实参的方法)

* Explicit instantiation (显式实例化)

  ```cpp
  template < typename T >
  
  void f( T s ){
  
    std::cout << s << '\n';
  
  }
  
  template void f<double>(double); // 实例化，编译器生成代码
                                  //  void f(double s) {   // T: double
  
                                 //      std::cout << s << '\n';
  
                                 //  }
  
  template void f<>(char);    // 实例化 f<char>(char) ，推导出模板实参
  
  template void f(int);        // 实例化 f<int>(int) ，推导出模板实参
  ```

* Implicit instantiation (隐式实例化)

  ```cpp
  #include <iostream>
  
  template<typename T>
  
  void f(T s) {
  
      std::cout << s << '\n';
  
  }
  
  int main(){
  
      f<double>(1); // 实例化并调用 f<double>(double)
  
      f<>('a'); // 实例化并调用 f<char>(char)
  
      f(7); // 实例化并调用 f<int>(int)
  
      void (*ptr)(std::string) = f; // 实例化 f<string>(string)
  
  }
  ```

A function instantiated from a function template is called an instantiated function. A class instantiated from a class template is called an instantiated class.(由函数模板实例化得到的函数叫做“实例函数”，由类模板实例化得到的类叫做“实例类”)

### Default type parameter (默认类型参数)


You can assign a default type for a type parameter in a class template. (可以为类模板的类型参数指定一个默认类型)

template<typename T = int>

You can only use default type in class templates,  **NOT** in function templates

### Non-type Parameters (非类型参数)


Using nontype parameters in a template prefix. (在模板前缀中使用非类型参数)

When instantiating a template, the nontype argument should be an object(实例化模板时，非类型实参应该是**对象**)

```cpp
template<typename T, int capacity>

class Stack{

  ...

private:

  T elements[capacity];

  int size;

};

Stack<char, 100> charStack;

 

 

//对象作为非类型参数

template<typename T, Color c>

class Label{

  ……

};

Color color(0, 0, 255);

Label<char, color> label;
```

### Templates and inheritance

 模板与继承


A non-template class can be derived from a class template specialization(普通类可从类模板**实例**继承).

A class template can be derived from a nontemplate class.(模板可从普通类继承)

A class template can be derived from a class template.(类模板可继承类模板)



template<typename T> class T1; 

template<typename T> class T2; 

class C; 

## STL(Standard Template Library)

* containers

  store a collection of data, often referred to as elements

  * Sequence container(顺序容器)

    represents **linear** data structures

    vector,list,deque

  * Associative containers（关联容器）

    **non-linear** containers that can locate elements stored in the container quickly

    set,multiset,map and multimap

  关联容器和顺序容器统称为一级容器

  * Container adapters(容器适配器)

    **constrained versions** of sequence containers, aiming at handling special cases

    stack,queue, and priority_queue

* Iterators

  facilitate **traversing** through the elements in a container

  a generalization of pointers

  used extensively in the first-class containers for accessing and manipulating the elements(用于访问和处理一级容器中的元素)

* Algorithm

* Function Objects

* Memory Allocation

### Iterator


## 规范

* The prefix is should be used for boolean variables and methods.
* Type conversions must always be done explicitly. Never rely on implicit type conversion.
*  Named constants (including enumeration values) must be all uppercase using underscore to separate words.
* Names representing types must be in mixed case starting with upper case.
* If the parameter of a member function has the same name as a private class variable, then the parameter should have underscore suffix.
* Class variables should never be declared public.

