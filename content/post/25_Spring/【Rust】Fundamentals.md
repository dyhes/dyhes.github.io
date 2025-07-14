---
title: 【Rust】Fundamentals
date: 2025-03-14 00:00:00+0000
categories: 
- temple
tags:
- Rust
---
## Variable
变量默认是不可改变的（immutable）。
```rust
let num = 1;
```
可变变量
```rust
let mut num = 1;
num = 2;
```
## Constant

类似于不可变变量，*常量 (constants)* 是绑定到一个名称的不允许改变的值，不过常量与变量还是有一些区别。
* 不允许对常量使用 mut。
* 声明常量使用 const 关键字而不是 let，并且 **必须** 注明值的类型。
* 常量可以在任何作用域中声明，包括全局作用域
* 常量只能被设置为常量表达式，而不可以是其他任何只能在运行时计算出的值。
```rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```
## Type
Rust 是 **静态类型**（*statically typed*）语言，也就是说在编译时就必须知道所有变量的类型。根据值及其使用方式，编译器通常可以推断出我们想要用的类型。当多种类型均有可能时，必须增加类型注解。
```rust
let guess: u32 = "42".parse().expect("Not a number!");
```
### Scalar
**标量**（*scalar*）类型代表一个单独的值。Rust 有四种基本的标量类型：整型、浮点型、布尔类型和字符类型。
| **长度** | **有符号** | **无符号** |
|:-:|:-:|:-:|
| 8-bit | i8 | u8 |
| 16-bit | i16 | u16 |
| 32-bit | i32 | u32 |
| 64-bit | i64 | u64 |
| 128-bit | i128 | u128 |
| arch | isize | usize |
> isize 和 usize 类型依赖运行程序的计算机架构：64 位架构上它们是 64 位的，32 位架构上它们是 32 位的。

数字字面值允许使用类型后缀 ( 如57u8 )，同时也允许使用 _ 做为分隔符以方便读数
| **数字字面值** | **例子** |
|:-:|:-:|
| Decimal (十进制) | 98_222 |
| Hex (十六进制) | 0xff |
| Octal (八进制) | 0o77 |
| Binary (二进制) | 0b1111_0000 |
| Byte (单字节字符)(仅限于u8) | b'A' |
数字类型默认是 i32。isize 或 usize 主要作为某些集合的索引。

Rust 有两个原生的 **浮点数**（*floating-point numbers*）类型，它们是带小数点的数字。Rust 的浮点数类型是 f32 和 f64，分别占 32 位和 64 位。默认类型是 f64，因为在现代 CPU 中，它与 f32 速度几乎一样，不过精度更高。所有的浮点型都是有符号的。

* 单引号: 声明 char 字面量
* 双引号: 声明字符串字面量。

Rust 的 char 类型的大小为四个字节 (four bytes)，并代表了一个 Unicode 标量值（Unicode Scalar Value），这意味着它可以比 ASCII 表示更多内容。在 Rust 中，带变音符号的字母（Accented letters），中文、日文、韩文等字符，emoji（绘文字）以及零长度的空白字符都是有效的 char 值。Unicode 标量值包含从 U+0000 到 U+D7FF 和 U+E000 到 U+10FFFF 在内的值。

### Compound

**复合类型**（*Compound types*）可以将多个值组合成一个类型。Rust 有**两个原生的复合类型**：元组（tuple）和数组（array）。

元组是一个将多个其他类型的值组合进一个复合类型的主要方式。元组**长度固定**：一旦声明，其长度不会增大或缩小。
```rust
let tup = (500, 6.4, 1);

// 可以使用模式匹配（pattern matching）来解构（destructure）元组值
let (x, y, z) = tup;

// 使用点号（.）后跟值的索引来直接访问
let five_hundred = x.0;

let six_point_four = x.1;

```

不带任何值的元组有个特殊的名称，叫做 **单元（unit）** 元组。这种值以及对应的类型都写作 ()，表示空值或空的返回类型。**如果表达式不返回任何其他值，则会隐式返回单元值**。

与元组不同，数组中的每个元素的类型必须相同，Rust 中的数组长度是**固定**的。当你想要在栈（stack）而不是在堆（heap）上为数据分配空间，或者是想要确保总是有固定数量的元素时，数组非常有用。但是数组并不如 vector 类型灵活。

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];

// 与 let a = [3, 3, 3, 3, 3]; 效果相同，但更简洁。
let a = [3; 5];
```

## Function

Rust 代码中的函数和变量名使用 *snake case* 规范风格。在 snake case 中，所有字母都是小写并使用下划线分隔单词。

Rust 不关心函数定义所在的位置，只要函数被调用时出现在调用之处可见的作用域内就行。

### Statements & Expressions
函数体由一系列的语句和一个可选的结尾表达式构成。
* **语句**（*Statements*）是执行一些操作但不返回值的指令。
*  **表达式**（*Expressions*）计算并产生一个值。

函数可以向调用它的代码返回值。我们并不对返回值命名，但要在箭头（->）后声明它的类型。在 Rust 中，函数的返回值等同于函数体最后一个表达式的值。使用 return 关键字和指定值，可从函数中提前返回；但大部分函数隐式的返回最后的表达式。
```rust
// 如果在包含 x + 1 的行尾加上一个分号，把它从表达式变成语句，我们将看到一个错误。
fn plus_one(x: i32) -> i32 {
    x + 1
}
```

## Control Flow
因为 if 是一个表达式，我们可以在 let 语句的右侧使用它
```rust
let number = if condition { 5 } else { 6 };
```

Rust 有三种循环：loop、while 和 for。

如果存在嵌套循环，break 和 continue 应用于此时最内层的循环。你可以选择在一个循环上指定一个 **循环标签**（*loop label*），然后将标签与 break 或 continue 一起使用，使这些关键字应用于已标记的循环而不是最内层的循环。
```rust
fn main() {
    let mut count = 0;
    'counting_up: loop {
        let mut remaining = 10;
        loop {
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }
        count += 1;
    }
    println!("End count = {count}");
}
```

for
```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }
}
```

### match
```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

在 match 表达式中，可以使用 | 语法匹配多个模式，它代表 **或**（*or*）运算符模式。
```rust
    let x = 1;

    match x {
        1 | 2 => println!("one or two"),
        3 => println!("three"),
        _ => println!("anything"),
    }

```

..= 语法允许你匹配一个闭区间范围内的值。
```rust
    let x = 5;

    match x {
        1..=5 => println!("one through five"),
        _ => println!("something else"),
    }

```

**[匹配 Option<T>](https://kaisery.github.io/trpl-zh-cn/ch06-02-match.html#%E5%8C%B9%E9%85%8D-optiont)**
```rust
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None,
            Some(i) => Some(i + 1),
        }
    }

    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

```
我们希望对一些特定的值采取特殊操作，而对其他的值采取默认操作。
```rust
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        other => move_player(other),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn move_player(num_spaces: u8) {}

```

```rust
fn main() {
    let p = Point { x: 0, y: 7 };

    match p {
        Point { x, y: 0 } => println!("On the x axis at {x}"),
        Point { x: 0, y } => println!("On the y axis at {y}"),
        Point { x, y } => {
            println!("On neither axis: ({x}, {y})");
        }
    }
}
```
当我们不想使用通配模式获取的值时，请使用 _
```rust
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => reroll(),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn reroll() {}

```

### if let
if let 语法让我们以一种不那么冗长的方式结合 if 和 let，来处理只匹配一个模式的值而**忽略其他模式**的情况。
```rust
    let mut count = 0;
    if let Coin::Quarter(state) = coin {
        println!("State quarter from {state:?}!");
    } else {
        count += 1;
    }

```
## OwnShip
所有权（系统）是 Rust 最为与众不同的特性，对语言的其他部分有着深刻含义。它让 Rust **无需垃圾回收（garbage collector）即可保障内存安全**，因此理解 Rust 中所有权如何工作是十分重要的。

* 一些语言中具有垃圾回收机制，在程序运行时有规律地寻找不再使用的内存；
* 在另一些语言中，程序员必须亲自分配和释放内存。
* Rust 则选择了第三种方式：通过所有权系统管理内存，编译器在编译时会根据一系列的规则进行检查。如果违反了任何这些规则，程序都不能编译。在运行时，所有权系统的任何功能都不会减慢程序。

在**编译时**大小未知或大小可能变化的数据，要改为存储在堆上。 堆是缺乏组织的：当向堆放入数据时，你要请求一定大小的空间。内存分配器（memory allocator）在堆的某处找到一块足够大的空位，把它标记为已使用，并返回一个表示该位置地址的 **指针**（*pointer*）。这个过程称作 **在堆上分配内存**（*allocating on the heap*），有时简称为 “分配”（allocating）。（将数据推入栈中并不被认为是分配）。因为指向放入堆中数据的指针是已知的并且大小是固定的，你可以将该指针存储在栈上，不过当需要实际数据时，必须访问指针。

**入栈比在堆上分配内存要快**，因为（入栈时）分配器无需为存储新数据去搜索内存空间；其位置总是在栈顶。相比之下，在堆上分配内存则需要更多的工作，这是因为分配器必须首先找到一块足够存放数据的内存空间，并接着做一些记录为下一次分配做准备。
**访问堆上的数据比访问栈上的数据慢**，因为必须通过指针来访问。现代处理器在内存中跳转越少就越快（缓存）。

* Rust 中的每一个值都有一个 **所有者**（*owner*）。
* 值在任一时刻有且只有一个所有者。
* 当所有者（变量）离开作用域，这个值将被丢弃。

Rust 永远也不会自动创建数据的 “深拷贝”。因此，任何 **自动** 的复制都可以被认为是对运行时性能影响较小的。
如果我们 **确实** 需要深度复制 String 中堆上的数据，而不仅仅是栈上的数据，可以使用一个叫做 clone 的通用函数。

Rust 有一个叫做 Copy trait 的特殊注解，可以用在类似整型这样的存储在栈上的类型上。如果一个类型实现了 Copy trait，那么一个旧的变量在将其赋值给其他变量后仍然可用。
Rust 不允许自身或其任何部分实现了 Drop trait 的类型使用 Copy trait。如果我们对其值离开作用域时需要特殊处理的类型使用 Copy 注解，将会出现一个编译时错误。
任何一组简单标量值的组合都可以实现 Copy，任何不需要分配内存或某种形式资源的类型都可以实现 Copy 。如下是一些 Copy 的类型：
* 所有整数类型，比如 u32。
* 布尔类型，bool，它的值是 true 和 false。
* 所有浮点数类型，比如 f64。
* 字符类型，char。
* 元组，当且仅当其包含的类型也都实现 Copy 的时候。比如，(i32, i32) 实现了 Copy，但 (i32, String) 就没有。

向函数传递值可能会移动或者复制，就像赋值语句一样。返回值也可以转移所有权。
变量的所有权总是遵循相同的模式：将值赋给另一个变量时移动它。当持有堆中数据值的变量离开作用域时，其值将通过 drop 被清理掉，除非数据被移动为另一个变量所有。

### References
**引用**（*reference*）像一个指针，因为它是一个地址，我们可以由此访问储存于该地址的属于其他变量的数据。 与指针不同，引用确保指向某个特定类型的有效值。
```rust
fn calculate_length(s: &String) -> usize {
    s.len()
}
```
> 与使用 & 引用相反的操作是 **解引用**（*dereferencing*），它使用解引用运算符，*。

我们将创建一个引用的行为称为 **借用**（*borrowing*）。
正如变量默认是不可变的，引用也一样。（默认）不允许修改引用的值。

```rust
fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

可变引用有一个很大的限制：如果你有一个对该变量的可变引用，你就不能再创建对该变量的引用。

这一限制以一种非常小心谨慎的方式允许可变性，防止同一时间对同一数据存在多个可变引用。新 Rustacean 们经常难以适应这一点，因为大部分语言中变量任何时候都是可变的。这个限制的好处是 Rust 可以在编译时就避免数据竞争。
**数据竞争**（*data race*）类似于竞态条件，它可由这三个行为造成：
* 两个或更多指针同时访问同一数据。
* 至少有一个指针被用来写入数据。
* 没有同步数据访问的机制。
一个引用的作用域从声明的地方开始一直持续到最后一次使用为止。
```rust
    let mut s = String::from("hello");

    let r1 = &s; // 没问题
    let r2 = &s; // 没问题
    println!("{r1} and {r2}");
    // 此位置之后 r1 和 r2 不再使用

    let r3 = &mut s; // 没问题
    println!("{r3}");

```

在具有指针的语言中，很容易通过释放内存时保留指向它的指针而错误地生成一个 **悬垂指针**（*dangling pointer*），所谓悬垂指针是其指向的内存可能已经被分配给其它持有者。相比之下，在 Rust 中编译器确保引用永远也不会变成悬垂状态：当你拥有一些数据的引用，编译器确保数据不会在其引用之前离开作用域。

* 在任意给定时间，**要么** 只能有一个可变引用，**要么** 只能有多个不可变引用。
* 引用必须总是有效的。

### Slice
*slice* 允许你引用集合中一段连续的元素序列，而不用引用整个集合。slice 是一种引用，所以它没有所有权。

**字符串 slice**（*string slice*）是 String 中一部分值的引用
`[starting_index..ending_index]`：左闭右开
对于 Rust 的 .. range 语法，如果想要从索引 0 开始，可以不写两个点号之前的值。
如果 slice 包含 String 的最后一个字节，也可以舍弃尾部的数字。
```rust
    let s = String::from("hello world");

    let slice = &s[0..2];
	let slice = &s[..2];
	
	let len = s.len();

	let slice = &s[3..len];
	let slice = &s[3..];

```
“字符串 slice” 的类型声明写作 &str
```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

```

**[其他类型的 slice](https://kaisery.github.io/trpl-zh-cn/ch04-03-slices.html#%E5%85%B6%E4%BB%96%E7%B1%BB%E5%9E%8B%E7%9A%84-slice)**
字符串 slice，正如你想象的那样，是针对字符串的。不过也有更通用的 slice 类型。
就跟我们想要获取字符串的一部分那样，我们也会想要引用数组的一部分。我们可以这样做：
```rust
let a = [1, 2, 3, 4, 5];

let slice = &a[1..3];

assert_eq!(slice, &[2, 3]);
```
这个 slice 的类型是 &[i32]。

## Struct

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let mut user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };
	user1.email = String::from("anotheremail@example.com");
}
```
注意整个实例必须是可变的；Rust 并不允许只将某个字段标记为可变。

```rust
fn main() {
    // --snip--

	// ..user1 必须放在最后，以指定其余的字段应从 user1 的相应字段中获取其值
    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
}
```

总体上说我们在创建user2 后就不能再使用 user1 了，因为 user1 的 username 字段中的 String 被移到 user2 中。如果我们给 user2 的 email 和 username 都赋予新的 String 值，从而只使用 user1 的 active 和 sign_in_count 值，那么 user1 在创建 user2 后仍然有效。

### Tuple Struct
也可以定义与元组类似的结构体，称为 **元组结构体**（*tuple structs*）。元组结构体有着结构体名称提供的含义，但没有具体的字段名，只有字段的类型。当你想给整个元组取一个名字，并使元组成为与其他元组不同的类型时，元组结构体是很有用的，这时像常规结构体那样为每个字段命名就显得多余和形式化了。
```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

### Method
**方法**（method）与函数类似：它们使用 fn 关键字和名称声明，可以拥有参数和返回值，同时包含在某处调用该方法时会执行的代码。不过方法与函数是不同的，因为它们在结构体（或枚举或 trait 对象）的上下文中被定义，并且它们第一个参数总是 self，它代表调用该方法的结构体实例。

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

> 在 C/C++ 语言中，有两个不同的运算符来调用方法：. 直接在对象上调用方法，而 -> 在一个对象的指针上调用方法，这时需要先解引用（dereference）指针。换句话说，如果 object 是一个指针，那么 object->something() 就像 (*object).something() 一样。
> Rust 并没有一个与 -> 等效的运算符；相反，Rust 有一个叫 **自动引用和解引用**（*automatic referencing and dereferencing*）的功能。
> 当使用object.something() 调用方法时，Rust 会自动为 object 添加 &、&mut 或 * 以便使 object 与方法签名匹配。
> ```rust
> p1.distance(&p2);
> (&p1).distance(&p2);
> ```
> 这种自动引用的行为之所以有效，是因为方法有一个明确的接收者———— self 的类型。在给出接收者和方法名的前提下，Rust 可以明确地计算出方法是仅仅读取（&self），做出修改（&mut self）或者是获取所有权（self）。事实上，Rust 对方法接收者的隐式借用让所有权在实践中更友好。

每个结构体都允许拥有多个 impl 块。

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

```

### Associated Functions
所有在 impl 块中定义的函数被称为 **关联函数**（*associated functions*），因为它们与 impl 后面命名的类型相关。我们可以定义不以 self 为第一参数的关联函数（因此不是方法），因为它们**并不作用于一个结构体的实例**。
```rust
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}

```

## Enum
```rust
    enum IpAddr {
        V4(u8, u8, u8, u8),
        V6(String),
    }

    let home = IpAddr::V4(127, 0, 0, 1);

    let loopback = IpAddr::V6(String::from("::1"));

```
### Option
Rust 并没有空值，不过它确实拥有一个[定义于标准库中](https://doc.rust-lang.org/std/option/enum.Option.html)的可以编码存在或不存在概念的枚举。这个枚举是 Option<T>。
```rust
enum Option<T> {
    None,
    Some(T),
}

```

## Module System
Rust 有许多功能可以让你管理代码的组织，包括哪些内容可以被公开，哪些内容作为私有部分，以及程序每个作用域中的名字。这些功能，有时被统称为 “模块系统（the module system）”，包括：
* **包**（*Packages*）：Cargo 的一个功能，它允许你构建、测试和分享 crate。
* **Crates** ：一个模块的树形结构，它形成了库或二进制项目。
* **模块**（*Modules*）和 **use**：允许你控制作用域和路径的私有性。
* **路径**（*path*）：一个命名例如结构体、函数或模块等项的方式。

### crate
crate 是 Rust 在编译时最小的代码单位。如果你用 rustc 而不是 cargo 来编译一个文件，编译器会将那个文件认作一个 crate。
crate 有两种形式：二进制项和库。*二进制项* 可以被编译为可执行程序，比如一个命令行程序或者一个 web server。它们必须有**一个 main 函数**来定义当程序被执行的时候所需要做的事情。

### Package
*包*（*package*）是提供一系列功能的一个或者多个 crate。一个包会包含一个 *Cargo.toml* 文件，阐述如何去构建这些 crate。
包中可以包含至多一个库 crate(library crate)。包中可以包含任意多个二进制 crate(binary crate)，但是必须至少包含一个 crate（无论是库的还是二进制的）。

如果一个包同时含有 ***src/main.rs*** 和 ***src/lib.rs***，则它有两个 crate：一个二进制的和一个库的，且名字都与包相同。通过将文件放在 ***src/bin*** 目录下，一个包可以拥有多个二进制 crate：每个 *src/bin* 下的文件都会被编译成一个独立的二进制 crate。

### Module
**crate 根节点**: 编译一个 crate, 编译器首先在 crate 根文件（通常，对于一个库 crate 而言是*src/lib.rs*，对于一个二进制 crate 而言是*src/main.rs*）中寻找需要被编译的代码。

**模块声明**: **在 crate 根文件中**，用`mod xxx;`声明模块。模块搜寻：
* 内联大括号中
  ```rust
  mod xxx {
  	...
  }
  ```
* ` src/xxx.rs`
* `src/xxx/mod.rs`

**子模块声明**: 在**除了 crate 根节点以外**的其他文件中，你可以定义子模块。编译器会在以父模块命名的目录中寻找子模块代码：
* 内联大括号
*  *`src/parent/child.rs`*
*  *`src/parent/child/mod.rs`*

**代码路径**: 一旦一个模块是你 crate 的一部分，你可以在隐私规则允许的前提下，从同一个 crate 内的任意地方，通过代码路径引用该模块的代码。

**私有 vs 公用**: 在 Rust 中，默认所有项（函数、方法、结构体、枚举、模块和常量）对父模块都是私有的。
* 为了使一个模块公用，应当在声明时使用pub 。
* 为了使一个公用模块内部的成员公用，应当在声明前使用pub。

**use 关键字**: 在一个作用域内，use关键字创建了一个成员的快捷方式，用来减少长路径的重复。在任何可以引用crate::garden::vegetables::Asparagus的作用域，你可以通过 use crate::garden::vegetables::Asparagus;创建一个快捷方式，然后你就可以在作用域中只写Asparagus来使用该类型。

e.g.
```
backyard
├── Cargo.lock
├── Cargo.toml
└── src
    ├── garden
    │   └── vegetables.rs
    ├── garden.rs
    └── main.rs
```
```rust
use crate::garden::vegetables::Asparagus;

pub mod garden;

fn main() {
    let plant = Asparagus {};
    println!("I'm growing {plant:?}!");
}
```

通过使用模块，我们可以将相关的定义分组到一起，并指出它们为什么相关。

src/main.rs 和 src/lib.rs 叫做 crate 根。之所以这样叫它们是因为这两个文件的内容都分别在 crate 模块结构的根组成了一个名为 crate 的模块，该结构被称为 *模块树*（*module tree*）。
```
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment

```

### Path
* **绝对路径**（*absolute path*）是以 crate 根（root）开头的全路径；对于外部 crate 的代码，是以 crate 名开头的绝对路径，对于当前 crate 的代码，则以字面值 crate 开头。
* **相对路径**（*relative path*）从当前模块开始，以 self、super 或定义在当前模块中的标识符开头。
绝对路径和相对路径都后跟一个或多个由双冒号（**::**）分割的标识符。
```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();

    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}
```

> 我们提到过包（package）可以同时包含一个 *src/main.rs* 二进制 crate 根和一个 *src/lib.rs* 库 crate 根，并且这两个 crate 默认以包名来命名。通常，这种包含二进制 crate 和库 crate 的模式的包，在二进制 crate 中只保留足以生成一个可执行文件的代码，并由可执行文件调用库 crate 的代码。又因为库 crate 可以共享，这使得其它项目从包提供的大部分功能中受益。
> 
> 模块树应该定义在 *src/lib.rs* 中。这样通过以包名开头的路径，公有项就可以在二进制 crate 中使用。二进制 crate 就变得同其它在该 crate 之外的、使用库 crate 的用户一样：二者都只能使用公有 API。这有助于你设计一个好的 API；你不仅仅是作者，也是用户！

### use
```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

// A
use crate::front_of_house::hosting;

mod customer {
    pub fn eat_at_restaurant() {
        hosting::add_to_waitlist();
    }
}

// B
use crate::front_of_house::hosting::add_to_waitlist;

pub fn eat_at_restaurant() {
    add_to_waitlist();
}
```
虽然示例 A 和 B 都完成了相同的任务，但示例 A 是使用 use 将函数引入作用域的习惯用法。要想使用 use 将函数的父模块引入作用域，我们必须在调用函数时指定父模块，这样可以清晰地表明函数不是在本地定义的，同时使完整路径的重复度最小化。
另一方面，使用 use 引入结构体、枚举和其他项时，习惯是指定它们的完整路径。

#### as
使用 use 将两个同名类型引入同一作用域这个问题还有另一个解决办法：在这个类型的路径后面，我们使用 as 指定一个新的本地名称或者别名。
```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
    // --snip--
}

fn function2() -> IoResult<()> {
    // --snip--
}
```

#### pub use
使用 use 关键字，将某个名称导入当前作用域后，这个名称在此作用域中就可以使用了，但它对此作用域之外还是私有的。如果想让其他人调用我们的代码时，也能够正常使用这个名称，就好像它本来就在当前作用域一样，那我们可以将 pub 和 use 合起来使用。这种技术被称为 “*重导出*（*re-exporting*）
```rust
使用 use 关键字，将某个名称导入当前作用域后，这个名称在此作用域中就可以使用了，但它对此作用域之外还是私有的。如果想让其他人调用我们的代码时，也能够正常使用这个名称，就好像它本来就在当前作用域一样，那我们可以将 pub 和 use 合起来使用。这种技术被称为 “重导出（re-exporting）
```

#### glob
如果希望将一个路径下 **所有** 公有项引入作用域，可以指定路径后跟 *，glob 运算符：
```rust
use std::collections::*;
```

## Cargo
### Release Profiles
在 Rust 中 **发布配置**（*release profiles*）文件是预定义和可定制的，它们包含不同的配置，允许程序员更灵活地控制代码编译的多种选项。每一个配置都相互独立。
Cargo 有两个主要的配置：
* 运行 cargo build 时采用的 dev 配置
* 运行 cargo build --release 的 release 配置

当项目的 *Cargo.toml* 文件中没有显式增加任何 [profile.*] 部分的时候，Cargo 会对每一个配置都采用默认设置。通过增加任何希望定制的配置对应的 [profile.*] 部分，我们可以选择覆盖任意默认设置的子集。
opt-level 设置控制 Rust 会对代码进行何种程度的优化，如下是dev 和 release 配置的 opt-level 设置的默认值：
```toml
# Cargo.toml
[profile.dev]
opt-level = 0

[profile.release]
opt-level = 3
```

### Documentation comments
Rust 有特定的用于文档的注释类型，通常被称为 **文档注释**（*documentation comments*），它们会生成 HTML 文档。这些 HTML 展示公有 API 文档注释的内容，它们意在让对库感兴趣的程序员理解如何 **使用** 这个 crate，而不是它是如何被 **实现** 的。

文档注释使用三斜杠 /// 而不是双斜杠以支持 Markdown 注解来格式化文本。文档注释就位于需要文档的项的之前。

```rust
/// Adds one to the number given.
///
/// # Examples
///
/// ```
/// let arg = 5;
/// let answer = my_crate::add_one(arg);
///
/// assert_eq!(6, answer);
/// ```
pub fn add_one(x: i32) -> i32 {
    x + 1
}
```

可以运行 cargo doc 来生成这个文档注释的 HTML 文档。

### Metadata
比如说你已经有一个希望发布的 crate。在发布之前，你需要在 crate 的 *Cargo.toml* 文件的 [package] 部分增加一些本 crate 的元信息（metadata）。
```toml
# Cargo.toml
[package]
name = "guessing_game"
version = "0.1.0"
edition = "2021"
description = "A fun game where you guess what number the computer has chosen."
license = "MIT OR Apache-2.0"

[dependencies]

```
当你修改了 crate 并准备好发布新版本时，改变 *Cargo.toml* 中 version 所指定的值。
### cargo yank
虽然你不能删除之前版本的 crate，但是可以阻止任何将来的项目将它们加入到依赖中。这在某个版本因为这样或那样的原因被破坏的情况很有用。对于这种情况，Cargo 支持 **撤回**（*yanking*）某个版本。
撤回某个版本会阻止新项目依赖此版本，不过所有现存此依赖的项目仍然能够下载和依赖这个版本。从本质上说，撤回意味着所有带有 *Cargo.lock* 的项目的依赖不会被破坏，同时任何新生成的 *Cargo.lock* 将不能使用被撤回的版本。
```bash
$ cargo yank --vers 1.0.1
    Updating crates.io index
        Yank guessing_game@1.0.1

$ cargo yank --vers 1.0.1 --undo
    Updating crates.io index
      Unyank guessing_game@1.0.1

```

### Workspace
Cargo 提供了一个叫 **工作空间**（*workspaces*）的功能，它可以帮助我们管理多个相关的协同开发的包。
**工作空间** 是一系列共享同样的 *Cargo.lock* 和输出目录的包。
```rust
[workspace]

members = [
    "adder",
    "add_one",
]
```

```rust
├── Cargo.lock
├── Cargo.toml
├── add_one
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
├── adder
│   ├── Cargo.toml
│   └── src
│       └── main.rs
└── target

```
cargo 并不假定工作空间中的 Crates 会相互依赖，所以需要明确表明工作空间中 crate 的依赖关系。
```toml
# adder/Cargo.toml
[dependencies]
add_one = { path = "../add_one" }

```
### cargo install
cargo install 命令用于在本地安装和使用二进制 crate。

## Collections
https://doc.rust-lang.org/std/collections/index.html

### `Vec<T>`
为了创建一个新的空 vector，可以调用 Vec::new 函数
```rust
    let v: Vec<i32> = Vec::new();
```

通常，我们会用初始值来创建一个 Vec<T> 而 Rust 会**推断出储存值的类型**，所以很少会需要这些类型注解。为了方便 Rust 提供了 vec! 宏，这个宏会根据我们提供的值来创建一个新的 vector。
```rust
    let v = vec![1, 2, 3];
```

对于新建一个 vector 并向其增加元素，可以使用 push 方法
```rust
    let mut v = Vec::new();

    v.push(5);
    v.push(6);
    v.push(7);
    v.push(8);
```

有两种方法引用 vector 中储存的值：通过索引或使用 get 方法。
```rust
    let v = vec![1, 2, 3, 4, 5];
	// 1
    let third: &i32 = &v[2];
    println!("The third element is {third}");
	// 2
    let third: Option<&i32> = v.get(2);
    match third {
        Some(third) => println!("The third element is {third}"),
        None => println!("There is no third element."),
    }
```

vector 只能储存相同类型的值。这是很不方便的；绝对会有需要储存一系列不同类型的值的用例。幸运的是，枚举的成员都被定义为相同的枚举类型，所以当需要在 vector 中储存不同类型值时，我们可以定义并使用一个枚举！
```rust
    enum SpreadsheetCell {
        Int(i32),
        Float(f64),
        Text(String),
    }

    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];

```
### `String`
字符串（String）类型由 Rust 标准库提供，而不是编入核心语言，它是一种可增长、可变、可拥有、UTF-8 编码的字符串类型。

很多 Vec 可用的操作在 String 中同样可用，事实上 String 被实现为一个**带有一些额外保证、限制和功能**的字节 vector 的封装。
```rust
    let mut s = String::new();
```

通常字符串会有初始数据，因为我们希望一开始就有这个字符串。为此，可以使用 to_string 方法，它能用于**任何实现了 Display trait 的类型**，比如字符串字面值。
```rust
    let data = "initial contents";

    let s = data.to_string();

    // 该方法也可直接用于字符串字面值：
    let s = "initial contents".to_string();
```

也可以使用String::from 函数来从字符串字面值创建 String。
```rust
    let s = String::from("initial contents");
```

* `push`：获取一个单独的字符作为参数，并附加到 String 中。
*  `push_str` ：附加字符串 slice，并不需要获取参数的所有权。
*  `+`： 合并两个已知的字符串
* `format!`：与 println! 的工作原理相同，不过不同于将输出打印到屏幕上，它返回一个带有结果内容的 String。
```rust
    let mut s = String::from("foo");
    s.push_str("bar");

	s.push('l');

    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2; // 注意 s1 被移动了，不能继续使用

    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");

    let s = format!("{s1}-{s2}-{s3}");

```

Rust 的字符串不支持索引。
操作字符串每一部分的最好的方法是明确表示需要字符还是字节。
* 对于单独的 Unicode 标量值使用 chars 方法。
* bytes 方法返回每一个原始字节。

### `HashMap<K, V>`

可以使用 new 创建一个空的 HashMap，并使用 insert 增加元素。
```
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
```

可以通过 get 方法并提供对应的键来从哈希 map 中获取值。
get 方法返回 Option<&V>，如果某个键在哈希 map 中没有对应的值，get 会返回 None。程序中通过调用 copied 方法来获取一个 Option<i32> 而不是 Option<&i32>，接着调用 unwrap_or 在 scores 中没有该键所对应的项时将其设置为零。
```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    let team_name = String::from("Blue");
    let score = scores.get(&team_name).copied().unwrap_or(0);

```

可以使用与 vector 类似的方式来遍历哈希 map 中的每一个键值对，也就是 for 循环：
```rust
for (key, value) in &scores {
        println!("{key}: {value}");
    }
```

当我们想要改变哈希 map 中的数据时，必须决定如何处理一个键已经有值了的情况。可以选择完全无视旧值并用新值代替旧值。可以选择保留旧值而忽略新值，并只在键 **没有** 对应值时增加新值。或者可以结合新旧两值。
* 如果我们插入了一个键值对，接着用相同的键插入一个不同的值，与这个键相关联的旧值将被替换。
* 哈希 map 有一个特有的 API，叫做 entry，它获取我们想要检查的键作为参数。entry 函数的返回值是一个枚举，Entry，它代表了可能存在也可能不存在的值。
  or_insert 方法返回这个键的值的一个可变引用（&mut V）
```rust
let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50);

use std::collections::HashMap;

    let text = "hello world wonderful world";

    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }

    println!("{map:?}");

```

## Error
Rust 将错误分为两大类：**可恢复的**（*recoverable*）和 **不可恢复的**（*unrecoverable*）错误。对于一个可恢复的错误，比如文件未找到的错误，我们很可能只想向用户报告问题并重试操作。不可恢复的错误总是 bug 出现的征兆，比如试图访问一个超过数组末端的位置，因此我们要立即停止程序。
大多数语言并不区分这两种错误，并采用类似异常这样方式统一处理它们。Rust 没有异常。相反，它有 **Result<T, E> 类型**，用于处理可恢复的错误，还有 **panic! 宏**，在程序遇到不可恢复的错误时停止执行。
### `Result<T, E>`
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```
e.g.
```rust
use std::fs::File;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => panic!("Problem opening the file: {error:?}"),
    };
}
```
match 能够胜任它的工作，不过它可能有点冗长并且不总是能很好的表明其意图。Result<T, E> 类型定义了很多辅助方法来处理各种情况。其中之一叫做 unwrap，它的实现就类似于示例 9-4 中的 match 语句。如果 Result 值是成员 Ok，unwrap 会返回 Ok 中的值。如果 Result 是成员 Err，unwrap 会为我们调用 panic!。
```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt").unwrap();
}
```

还有另一个类似于 unwrap 的方法它还允许我们选择 panic! 的错误信息：expect。使用 expect 而不是 unwrap 并提供一个好的错误信息可以表明你的意图并更易于追踪 panic 的根源。expect 的语法看起来像这样：
```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt")
        .expect("hello.txt should be included in this project");
}
```
### propagating
Result 值之后的 ? 被定义为与处理 Result 值的 match 表达式有着完全相同的工作方式。如果 Result 的值是 Ok，这个表达式将会返回 Ok 中的值而程序将继续执行。如果值是 Err，Err 将作为整个函数的返回值，就好像使用了 return 关键字一样，这样错误值就被传播给了调用者。
```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();

    File::open("hello.txt")?.read_to_string(&mut username)?;

    Ok(username)
}
```

### `Panic!`
在实践中有两种方法造成 panic：
* 执行会造成代码 panic 的操作（比如访问超过数组结尾的内容）
* 显式调用 panic! 宏。
> 当出现 panic 时，程序默认会开始 **展开**（*unwinding*），这意味着 Rust 会回溯栈并清理它遇到的每一个函数的数据，不过这个回溯并清理的过程有很多工作。
> 另一种选择是直接 **终止**（*abort*），这会不清理数据就退出程序。那么程序所使用的内存需要由操作系统来清理。如果你需要项目的最终二进制文件越小越好，panic 时通过在 *Cargo.toml* 的 [profile] 部分增加 panic = 'abort'，可以由展开切换为终止

## Generics
function
```rust
fn largest<T>(list: &[T]) -> &T {
}
```

struct
```rust
struct Point<T> {
    x: T,
    y: T,
}
```

method
```rust
impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}
```

enum
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

型并不会使程序比具体类型运行得慢。Rust 通过在编译时进行泛型代码的 **单态化**（*monomorphization*）来保证效率。单态化是一个通过填充编译时使用的具体类型，将通用代码转换为特定代码的过程。

## Trait
*trait* 定义了某个特定类型拥有可能与其他类型共享的功能。可以通过 trait 以一种抽象的方式定义共同行为。可以使用 *trait bounds* 指定泛型是任何拥有特定行为的类型。
> **注意**：*trait* 类似于其他语言中的常被称为 **接口**（*interfaces*）的功能，虽然有一些不同。
trait 定义是一种将方法签名组合起来的方法，目的是定义一个实现某些目的所必需的行为的集合。
```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```

### Default Implementation
```rust
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}

impl Summary for NewsArticle {}
```

### Trait as Parameter
#### impl Trait
```rust
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

pub fn notify(item: &(impl Summary + Display)) {
}
```
#### Trait Bound
impl Trait 语法更直观，但它实际上是更长形式的 *trait bound* 语法的语法糖。
```rust
pub fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}

pub fn notify<T: Summary + Display>(item: &T) {
}
```
impl Trait 很方便，适用于短小的例子。更长的 trait bound 则适用于更复杂的场景。

#### where
```rust
fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {}

fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{}
```

#### impl with trait bound
通过使用带有 trait bound 的泛型参数的 impl 块，可以有条件地只为那些实现了特定 trait 的类型实现方法。
```rust
use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}
```

例如，标准库为任何实现了 Display trait 的类型实现了 ToString trait。这个 impl 块看起来像这样：
```rust
impl<T: Display> ToString for T {
    // --snip--
}
```

## Lifetime
生命周期是另一类我们已经使用过的泛型。不同于确保类型有期望的行为，生命周期确保引用如预期一直有效。生命周期的主要目标是避免**悬垂引用**（*dangling references*），后者会导致程序引用了非预期引用的数据。
大部分时候生命周期是隐含并可以推断的，正如大部分时候类型也是可以推断的一样。
但也会出现引用的生命周期以一些不同方式相关联的情况，此时 Rust 需要我们使用泛型生命周期参数来注明它们的关系，这样就能确保运行时实际使用的引用绝对是有效的。

### Anotation
生命周期注解**并不改变**任何引用的生命周期的长短。相反它们描述了多个引用生命周期相互的关系，而不影响其生命周期。与当函数签名中指定了泛型类型参数后就可以接受任何类型一样，当指定了泛型生命周期后函数也能接受任何生命周期的引用。
生命周期注解有着一个不太常见的语法：生命周期参数名称必须以撇号（'）开头，其名称通常全是小写，类似于泛型其名称非常短。大多数人使用 'a 作为第一个生命周期注解。
```rust
&i32        // 引用
&'a i32     // 带有显式生命周期的引用
&'a mut i32 // 带有显式生命周期的可变引用
```

为了在函数签名中使用生命周期注解，需要在函数名和参数列表间的尖括号中声明泛型生命周期（*lifetime*）参数，就像泛型类型（*type*）参数一样。
```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```
它的实际含义是 longest 函数返回的引用的生命周期与函数参数所引用的值的生命周期的较小者一致。
记住通过在函数签名中指定生命周期参数时，我们**并没有改变**任何传入值或返回值的生命周期，而是指出任何不满足这个约束条件的值都将被借用检查器**拒绝**。注意 longest 函数并不需要知道 x 和 y 具体会存在多久，而只需要知道有某个可以被 'a 替代的作用域将会满足这个签名。

当在函数中使用生命周期注解时，这些注解出现在函数签名中，而不存在于函数体中的任何代码中。生命周期注解成为了函数约定的一部分，非常像签名中的类型。

### Anotation in struct
包含引用的结构体需要为结构体定义中的每一个引用添加生命周期注解
```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}
```

### Anotation in method
（实现方法时）结构体字段的生命周期必须总是在 impl 关键字之后声明并在结构体名称之后被使用，因为这些生命周期是结构体类型的一部分。
```rust
impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
}

// 适用于第三条生命周期省略规则
impl<'a> ImportantExcerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {announcement}");
        self.part
    }
}

```

### Elision
在编写了很多 Rust 代码后，Rust 团队发现在特定情况下 Rust 程序员们总是重复地编写一模一样的生命周期注解。这些场景是可预测的并且遵循几个明确的模式。接着 Rust 团队就把这些模式编码进了 Rust 编译器中，如此借用检查器在这些情况下就能推断出生命周期而不再强制程序员显式的增加注解。
被编码进 Rust 引用分析的模式被称为 **生命周期省略规则**（*lifetime elision rules*）。这并不是需要程序员遵守的规则；这些规则是一系列特定的场景，此时编译器会考虑，如果代码符合这些场景，就无需明确指定生命周期。

函数或方法的参数的生命周期被称为 **输入生命周期**（*input lifetimes*），而返回值的生命周期被称为 **输出生命周期**（*output lifetimes*）。
编译器采用三条规则来判断引用何时不需要明确的注解。第一条规则适用于输入生命周期，后两条规则适用于输出生命周期。
* 第一条规则是编译器为**每一个引用参数都分配一个生命周期参数**。换句话说就是，函数有一个引用参数的就有一个生命周期参数：`fn foo<'a>(x: &'a i32)`，有两个引用参数的函数就有两个不同的生命周期参数，`fn foo<'a, 'b>(x: &'a i32, y: &'b i32)`，依此类推。
* 第二条规则是如果**只有一个输入**生命周期参数，那么它被赋予所有输出生命周期参数：`fn foo<'a>(x: &'a i32) -> &'a i32`。
* 第三条规则是如果方法有多个输入生命周期参数并且其中一个参数是 `&self` 或 `&mut self`，说明是个对象的方法 (method)，那么所有输出生命周期参数被赋予 `self` 的生命周期。第三条规则使得方法更容易读写，因为只需更少的符号。

### `'static`
这里有一种特殊的生命周期值得讨论：'static，其生命周期**能够**存活于整个程序期间。所有的字符串字面值都拥有 'static 生命周期，我们也可以选择像下面这样标注出来：
```rust
let s: &'static str = "I have a static lifetime.";
```

### combined with trait
```rust
use std::fmt::Display;

fn longest_with_an_announcement<'a, T>(
    x: &'a str,
    y: &'a str,
    ann: T,
) -> &'a str
where
    T: Display,
{
    println!("Announcement! {ann}");
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

## Test
测试函数体通常执行如下三种操作：
* 设置任何所需的数据或状态
* 运行需要测试的代码
* 断言其结果是我们所期望的
Rust 中的测试就是一个带有 **test 属性注解**的函数。属性（attribute）是关于 Rust 代码片段的元数据。为了将一个函数变成测试函数，需要在 fn 行之前加上 `#[test]`。当使用 cargo test 命令运行测试时，Rust 会构建一个测试执行程序用来调用被标注的函数，并报告每一个测试是通过还是失败。

```rust
pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
```
### `assert!`
**assert!** 宏由标准库提供，在希望确保测试中一些条件为 true 时非常有用。需要向 assert! 宏提供一个求值为布尔值的参数。如果值是 true，assert! 什么也不做，同时测试会通过。如果值为 false，assert! 调用 panic! 宏，这会导致测试失败。
测试功能的一个常用方法是将需要测试代码的值与期望值做比较，并检查是否相等。可以通过向 assert! 宏传递一个使用 == 运算符的表达式来做到。不过这个操作实在是太常见了，以至于标准库提供了一对宏来更方便的处理这些操作 —— **assert_eq!** 和 **assert_ne!**。这两个宏分别比较两个值是相等还是不相等。当断言失败时它们也会打印出这两个值具体是什么，以便于观察测试 *为什么* 失败
你也可以向 assert!、assert_eq! 和 assert_ne! 宏传递一个可选的失败信息参数，可以在测试失败时将自定义失败信息一同打印出来。任何在 assert! 的一个必需参数和 assert_eq! 和 assert_ne! 的两个必需参数之后指定的参数都会传递给 format! 宏
```rust
    #[test]
    fn greeting_contains_name() {
        let result = greeting("Carol");
        assert!(
            result.contains("Carol"),
            "Greeting did not contain name, value was `{result}`"
        );
    }
```

### should_panic
除了检查返回值之外，检查代码是否按照期望处理错误也是很重要的。
```rust
pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must be between 1 and 100, got {value}.");
        }

        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic]
    fn greater_than_100() {
        Guess::new(200);
    }
}
```

然而 should_panic 测试结果可能会非常含糊不清。should_panic 甚至在一些不是我们期望的原因而导致 panic 时也会通过。为了使 should_panic 测试结果更精确，我们可以给 should_panic 属性增加一个可选的 expected 参数。测试工具会确保错误信息中**包含**其提供的文本。
```rust
// --snip--

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 {
            panic!(
                "Guess value must be greater than or equal to 1, got {value}."
            );
        } else if value > 100 {
            panic!(
                "Guess value must be less than or equal to 100, got {value}."
            );
        }

        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "less than or equal to 100")]
    fn greater_than_100() {
        Guess::new(200);
    }
}
```
### cargo test
当运行多个测试时，Rust 默认使用线程来并行运行。这意味着测试会更快地运行完毕，所以你可以更快的得到代码能否工作的反馈。因为测试是在同时运行的，你应该确保测试不能相互依赖，或依赖任何共享的状态，包括依赖共享的环境，比如当前工作目录或者环境变量。
如果你不希望测试并行运行，或者想要更加精确的控制线程的数量，可以传递 --test-threads 参数和希望使用线程的数量给测试二进制文件。
```bash
$ cargo test -- --test-threads=1
```

默认情况下，当测试通过时，Rust 的测试库会截获打印到标准输出的所有内容。比如在测试中调用了 println! 而测试通过了，我们将不会在终端看到 println! 的输出：只会看到说明测试通过的提示行。如果测试失败了，则会看到所有标准输出和其他错误信息。
如果你希望也能看到通过的测试中打印的值，也可以在结尾加上 --show-output 告诉 Rust 显示成功测试的输出。
```bash
$ cargo test -- --show-output
```

有时运行整个测试集会耗费很长时间。如果你负责特定位置的代码，你可能会希望只运行与这些代码相关的测试。你可以向 cargo test 传递所希望运行的测试名称的参数来选择运行哪些测试。
我们可以指定部分测试的名称，任何名称匹配这个名称的测试会被运行。
```bash
$ cargo test add
   Compiling adder v0.1.0 (file:///projects/adder)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.61s
     Running unittests src/lib.rs (target/debug/deps/adder-92948b65e88960b4)

running 2 tests
test tests::add_three_and_two ... ok
test tests::add_two_and_two ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 1 filtered out; finished in 0.00s

```

有时一些特定的测试执行起来是非常耗费时间的，所以在大多数运行 cargo test 的时候希望能排除它们。虽然可以通过参数列举出所有希望运行的测试来做到，也可以使用 ignore 属性来标记耗时的测试并排除它们
```rust
    #[test]
    #[ignore]
    fn expensive_test() {
        // 需要运行一个小时的代码
    }
```
当你需要运行ignored 的测试时，可以执行 cargo test -- --ignored。如果你希望不管是否忽略都要运行全部测试，可以运行 cargo test -- --include-ignored。

### Unit Test
单元测试的目的是在与其他部分隔离的环境中测试每一个单元的代码，以便于快速而准确地验证某个单元的代码功能是否符合预期。单元测试与它们要测试的代码共同存放在位于 *src* 目录下**相同的文件中**。规范是在每个文件中创建包含测试函数的 tests 模块，并使用 cfg(test) 标注模块。
测试模块的 `#[cfg(test)]` 注解告诉 Rust 只在执行 cargo test 时才编译和运行测试代码，而在运行 cargo build 时不这么做。

### Integration Test
在 Rust 中，集成测试对于你需要测试的库来说完全是外部的。同其他使用库的代码一样使用库文件，也就是说它们只能调用一部分库中的公有 API。集成测试的目的是测试库的多个部分能否一起正常工作。一些单独能正确运行的代码单元集成在一起也可能会出现问题，所以集成测试的覆盖率也是很重要的。

为了编写集成测试，需要在项目根目录创建一个 *tests* 目录，与 *src* 同级。Cargo 知道如何去寻找这个目录中的集成测试文件。接着可以随意在这个目录中创建任意多的测试文件，Cargo 会将每一个文件当作单独的 crate 来编译。
```rust
adder
├── Cargo.lock
├── Cargo.toml
├── src
│   └── lib.rs
└── tests
    └── integration_test.rs
```

```rust
// tests/integration_test.rs
use adder::add_two;

#[test]
fn it_adds_two() {
    let result = add_two(2);
    assert_eq!(result, 4);
}
```

如果项目是二进制 crate 并且只包含 *src/main.rs* 而没有 *src/lib.rs*，这样就不可能在 *tests* 目录创建集成测试并使用 extern crate 导入 *src/main.rs* 中定义的函数。只有库 crate 才会向其他 crate 暴露了可供调用和使用的函数；二进制 crate 只意在单独运行。
这就是许多 Rust 二进制项目使用一个简单的 *src/main.rs* 调用 *src/lib.rs* 中的逻辑的原因之一。因为通过这种结构，集成测试 **就可以** 通过 extern crate 测试库 crate 中的主要功能了，而如果这些重要的功能没有问题的话，*src/main.rs* 中的少量代码也就会正常工作且不需要测试。

## Functional Programming
Rust 的设计灵感来源于很多现存的语言和技术。其中一个显著的影响就是 **函数式编程**（*functional programming*）。函数式编程风格通常包含将函数作为参数值或其他函数的返回值、将函数赋值给变量以供之后执行等等。
### clousure
Rust 的 **闭包**（*closures*）是可以保存在变量中或作为参数传递给其他函数的**匿名函数**。你可以在一个地方创建闭包，然后在不同的上下文中执行闭包运算。不同于函数，闭包允许捕获其被定义时所在作用域中的值。

函数与闭包还有更多区别。闭包通常不要求像 fn 函数那样对参数和返回值进行类型注解。函数需要类型注解是因为这些类型是暴露给用户的显式接口的一部分。严格定义这些接口对于确保所有人对函数使用和返回值的类型达成一致理解非常重要。与此相比，闭包并不用于这样暴露在外的接口：它们储存在变量中并被使用，不用命名它们或暴露给库的用户调用。
闭包通常较短，并且只与特定的上下文相关，而不是适用于任意情境。在这些有限的上下文中，编译器可以推断参数和返回值的类型，类似于它推断大多数变量类型的方式（尽管在某些罕见的情况下，编译器也需要闭包的类型注解）。

```rust
let add_one_v3 = |x|             { x + 1 };
let add_one_v4 = |x|               x + 1  ;
```

#### 捕获引用

闭包可以通过三种方式捕获其环境中的值，它们直接对应到函数获取参数的三种方式：不可变借用、可变借用和获取所有权。闭包**将根据函数体中对捕获值的操作来决定使用哪种方式**。

即使闭包体不严格需要所有权，如果希望强制闭包获取它在环境中所使用的值的所有权，可以在参数列表前使用 move 关键字。
```rust
use std::thread;

fn main() {
    let list = vec![1, 2, 3];
    println!("Before defining closure: {list:?}");

    thread::spawn(move || println!("From thread: {list:?}"))
        .join()
        .unwrap();
}
```
尽管闭包体依然只需要不可变引用，我们还是在闭包定义前写上 move 关键字，以确保 list 被移动到闭包中。新线程可能在主线程剩余部分执行完前执行完，也可能在主线程执行完之后执行完。如果主线程维护了 list 的所有权但却在新线程之前结束并且丢弃了 list，则在线程中的不可变引用将失效。因此，编译器要求 list 被移动到在新线程中运行的闭包中，这样引用就是有效的。

#### Trait
一旦闭包捕获了定义它的环境中的某个值的引用或所有权（也就影响了什么会被移 *进* 闭包，如有），闭包体中的代码则决定了在稍后执行闭包时，这些引用或值将如何处理（也就影响了什么会被移 *出* 闭包，如有）。闭包体可以执行以下任一操作：将一个捕获的值移出闭包，修改捕获的值，既不移动也不修改值，或者一开始就不从环境中捕获任何值。
闭包捕获和处理环境中的值的方式会**影响闭包实现哪些 trait**，而 trait 是函数和结构体指定它们可以使用哪些类型闭包的方式。根据闭包体如何处理这些值，闭包会自动、渐进地实现一个、两个或全部三个 Fn trait。
* `FnOnce` 适用于**只能被调用一次**的闭包。所有闭包至少都实现了这个 trait，因为所有闭包都能被调用。一个会将捕获的值从闭包体中移出的闭包只会实现 FnOnce trait，而不会实现其他 Fn 相关的 trait，因为它只能被调用一次。
* `FnMut` 适用于不会将捕获的值移出闭包体，但可能会修改捕获值的闭包。这类闭包**可以被调用多次**。
* `Fn` 适用于既不将捕获的值移出闭包体，也不修改捕获值的闭包，同时也包括不从环境中捕获任何值的闭包。这类闭包可以被多次调用而不会改变其环境，这在会多次**并发**调用闭包的场景中十分重要。

闭包本质上是一个实现了 Fn、FnMut 或 FnOnce trait 的匿名结构体。当闭包捕获外部变量时，根据捕获方式的不同，这些变量会被存储在该结构体的字段中：
* **按引用捕获**：闭包结构体存储变量的不可变或可变引用（对应 Fn 和 FnMut）。
* **按值捕获** （移动捕获）：闭包结构体直接存储变量的值（对应 FnOnce）。
当闭包类型为 FnOnce 时，变量的所有权会被移出闭包（即闭包执行后变量被销毁）

### Iterator
迭代器模式允许你依次对一个序列中的项执行某些操作。**迭代器**（*iterator*）负责遍历序列中的每一项并确定序列何时结束的逻辑。使用迭代器时，你无需自己重新实现这些逻辑。
在 Rust 中，迭代器是 **惰性的**（*lazy*），这意味着在调用消费迭代器的方法之前不会执行任何操作。
```rust
    let v1 = vec![1, 2, 3];
	// 这段代码本身并没有执行任何有用的操作
    let v1_iter = v1.iter();
```

迭代器都实现了一个叫做 Iterator 的定义于标准库的 trait。这个 trait 的定义看起来像这样：
```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // 此处省略了方法的默认实现
}

```
next 是 Iterator 实现者被要求定义的唯一方法：next 方法，该方法每次返回迭代器中的一个项，封装在 Some 中，并且当迭代完成时，返回 None。
如果我们需要一个获取 v1 所有权并返回拥有所有权的迭代器，则可以调用 into_iter 而不是 iter。类似地，如果我们希望迭代可变引用，可以调用 iter_mut 而不是 iter。

*  **消费适配器**（*consuming adaptors*）：获取迭代器的所有权并反复调用 next 来遍历迭代器，因而会消费迭代器。
* **迭代器适配器**（*iterator adaptors*）：它们不会消耗当前的迭代器，而是通过改变原始迭代器的某些方面来生成不同的迭代器。

### loop v.s. iterator
迭代器是 Rust 的 **零成本抽象**（*zero-cost abstractions*）之一，它意味着抽象并不会引入额外的运行时开销

## Smart Pointer
* 引用以 & 符号为标志并借用了它们所指向的值。除了引用数据没有任何其他特殊功能，也没有额外开销。引用是一类只借用数据的指针
* **智能指针**（*smart pointers*）是一类数据结构，它们的表现类似指针，但是也拥有额外的元数据和功能。在大部分情况下，智能指针 **拥有** 它们指向的数据。

### `Deref` trait
实现 Deref trait 允许我们重载 **解引用运算符**（*dereference operator*）*（不要与乘法运算符或通配符相混淆）。通过这种方式实现 Deref trait 的智能指针可以被当作常规引用来对待。
```rust
fn main() {
    let x = 5;
    let y = Box::new(x);

    assert_eq!(5, x);
	// 底层为 *(y.deref())
    assert_eq!(5, *y);
}
```

#### user-defined smart pointer
```rust
struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

use std::ops::Deref;

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

```

#### deref coercions
**Deref 强制转换**（*deref coercions*）将实现了 Deref trait 的类型的引用转换为另一种类型的引用。例如，Deref 强制转换可以将 &String 转换为 &str，因为 String 实现了 Deref trait 因此可以返回 &str。Deref 强制转换是 Rust 在函数或方法传参上的一种便利操作，并且只能作用于实现了 Deref trait 的类型。当这种特定类型的引用**作为实参传递给和形参类型不同的函数或方法**时将自动进行。
```rust
fn hello(name: &str) {
    println!("Hello, {name}!");
}

fn main() {
    let m = MyBox::new(String::from("Rust"));
    hello(&m);
	// without deref coercion
	hello(&(*m)[..]);
}
```
类似于如何使用 Deref trait 重载不可变引用的 * 运算符，Rust 提供了 DerefMut trait 用于重载可变引用的 * 运算符。
Rust 在发现类型和 trait 实现满足三种情况时会进行 Deref 强制转换：
* 当 T: Deref<Target=U> 时从 &T 到 &U。
* 当 T: DerefMut<Target=U> 时从 &mut T 到 &mut U。
* 当 T: Deref<Target=U> 时从 &mut T 到 &U。

### `Drop` trait
对于智能指针模式来说第二个重要的 trait 是 Drop，其允许我们在值要离开作用域时执行一些代码。
当实例离开作用域 Rust 会自动调用 drop。变量以被创建时相反的顺序被丢弃。
Rust 并不允许我们主动调用 Drop trait 的 drop 方法；当我们希望在作用域结束之前就强制释放变量的话，我们应该使用的是位于 prelude的由标准库提供的 std::mem::drop。
```rust
fn main() {
    let c = CustomSmartPointer {
        data: String::from("some data"),
    };
    println!("CustomSmartPointer created.");
    drop(c);
    println!("CustomSmartPointer dropped before the end of main.");
}
```
### `Box<T>`
最简单直接的智能指针是 *box*，其类型是 Box<T>。box 允许你将一个值放在堆上而不是栈上。留在栈上的则是指向堆数据的指针。
除了数据被储存在堆上而不是栈上之外，box **没有性能损失**。不过也没有很多额外的功能。
Box<T> 类型是一个智能指针，因为它实现了 Deref trait，它允许 Box<T> 值被当作引用对待。当 Box<T> 值离开作用域时，由于 Box<T> 类型 Drop trait 的实现，box 所指向的堆数据也会被清除。
它们多用于如下场景：
* 当有一个在编译时未知大小的类型，而又想要在需要确切大小的上下文中使用这个类型值的时候
* 当有大量数据并希望在确保数据不被拷贝的情况下转移所有权的时候
  （转移大量数据的所有权可能会花费很长的时间，因为数据在栈上进行了拷贝。为了改善这种情况下的性能，可以通过 box 将这些数据储存在堆上)
* 当希望拥有一个值并只关心它的类型是否实现了特定 trait 而不是其具体类型的时候

#### Recursive Type
**递归类型**（*recursive type*）的值可以拥有另一个同类型的值作为其自身的一部分。但是这会产生一个问题，因为 Rust 需要在编译时知道类型占用多少空间。递归类型的值嵌套理论上可以无限地进行下去，所以 Rust 不知道递归类型需要多少空间。因为 box 有一个已知的大小，所以通过在循环类型定义中插入 box，就可以创建递归类型了。

### `Rc<T>`
为了启用多所有权需要显式地使用 Rust 类型 Rc<T>，其为 **引用计数**（*reference counting*）的缩写。引用计数意味着记录一个值的引用数量来知晓这个值是否仍在被使用。如果某个值有零个引用，就代表没有任何有效引用并可以被清理。
需要使用 use 语句将 Rc<T> 引入作用域，因为它不在 prelude 中。
通过不可变引用， Rc<T> 允许在程序的多个部分之间只读地共享数据。如果 Rc<T> 也允许多个可变引用，则会违反第四章讨论的借用规则之一：相同位置的多个可变借用可能造成数据竞争和不一致。不过可以修改数据是非常有用的！

### `RefCell<T>`
**内部可变性**（*Interior mutability*）是 Rust 中的一个设计模式，它允许你即使在有不可变引用时也可以改变数据，这通常是借用规则所不允许的。为了改变数据，该模式在数据结构中使用 unsafe 代码来模糊 Rust 通常的可变性和借用规则。不安全代码表明我们在手动检查这些规则而不是让编译器替我们检查。

对于引用和 Box<T>，借用规则的不可变性作用于编译时。对于 RefCell<T>，这些不可变性作用于 **运行时**。对于引用，如果违反这些规则，会得到一个编译错误。而对于 RefCell<T>，如果违反这些规则程序会 panic 并退出。

RefCell<T> 正是用于当你确信代码遵守借用规则，而编译器不能理解和确定的时候。
类似于 Rc<T>，RefCell<T> 只能用于单线程场景。Mutex<T> 是一个线程安全版本的 RefCell<T> 

### `Weak<T>`
强引用代表如何共享 Rc<T> 实例的所有权。弱引用并不属于所有权关系，当 Rc<T> 实例被清理时其计数没有影响。它们不会造成引用循环，因为任何涉及弱引用的循环会在其相关的值的强引用计数为 0 时被打断。
调用 Rc::downgrade 时会得到 Weak<T> 类型的智能指针。
不同于将Rc<T> 实例的 strong_count 加 1，调用 Rc::downgrade 会将 weak_count 加 1。其区别在于 weak_count 无需计数为 0 就能使 Rc<T> 实例被清理。

因为 Weak<T> 引用的值可能已经被丢弃了，为了使用 Weak<T> 所指向的值，我们必须确保其值仍然有效。为此可以调用 Weak<T> 实例的 upgrade 方法，这会返回 Option<Rc<T>>。如果 Rc<T> 值还未被丢弃，则结果是 Some；如果 Rc<T> 已被丢弃，则结果是 None。

## Concurrent Programming
在大部分现代操作系统中，已执行程序的代码在一个 **进程**（*process*）中运行，操作系统则会负责管理多个进程。在程序内部，也可以拥有多个同时运行的独立部分。这些运行这些独立部分的功能被称为 **线程**（*threads*）。

### **spawn**
为了创建一个新线程，需要调用 thread::spawn 函数并传递一个闭包，并在其中包含希望在新线程运行的代码。thread::sleep 调用强制线程停止执行一小段时间，这会允许其他不同的线程运行。
```rust
use std::thread;
use std::time::Duration;

fn main() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {i} from the spawned thread!");
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {i} from the main thread!");
        thread::sleep(Duration::from_millis(1));
    }
}
```
当 Rust 程序的主线程结束时，新线程也会结束，而不管其是否执行完毕。

### **join**
thread::spawn 的返回值类型是 JoinHandle。JoinHandle 是一个拥有所有权的值，当对其调用 join 方法时，它会等待其线程结束。
```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {i} from the spawned thread!");
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {i} from the main thread!");
        thread::sleep(Duration::from_millis(1));
    }

    handle.join().unwrap();
}
```

### 消息传递
为了实现消息传递并发，Rust 标准库提供了一个 **信道**（*channel*）实现。信道是一个通用编程概念，表示数据从一个线程发送到另一个线程。
使用 mpsc::channel 函数创建一个新的信道；mpsc 是 **多个生产者，单个消费者**（*multiple producer, single consumer*）的缩写。简而言之，Rust 标准库实现信道的方式意味着一个信道可以有多个产生值的 **发送**（*sending*）端，但只能有一个消费这些值的 **接收**（*receiving*）端。
mpsc::channel 函数返回一个元组：第一个元素是发送端 -- 发送者，而第二个元素是接收端 -- 接收者。
```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Got: {received}");
}
```
send 方法返回一个 Result<T, E> 类型，所以如果接收端已经被丢弃了，将没有发送值的目标，所以发送操作会返回错误。

信道的接收者有两个有用的方法：recv 和 try_recv。
*  recv 会**阻塞**主线程执行直到从信道中接收一个值。一旦发送了一个值，recv 会在一个 Result<T, E> 中返回它。当信道发送端关闭，recv 会返回一个错误表明不会再有新的值到来了。
* try_recv 不会阻塞，相反它立刻返回一个 Result<T, E>：Ok 值包含可用的信息，而 Err 值代表此时没有任何消息。如果线程在等待消息过程中还有其他工作时使用 try_recv 很有用：可以编写一个循环来**频繁调用 try_recv**，在有可用消息时进行处理，其余时候则处理一会其他工作直到再次检查。

**发送多个值**
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    for received in rx {
        println!("Got: {received}");
    }
}
```

**多个生产者**
```rust
    // --snip--

    let (tx, rx) = mpsc::channel();

    let tx1 = tx.clone();
    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx1.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    thread::spawn(move || {
        let vals = vec![
            String::from("more"),
            String::from("messages"),
            String::from("for"),
            String::from("you"),
        ];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    for received in rx {
        println!("Got: {received}");
    }

    // --snip--

```

### 共享内存
在某种程度上，任何编程语言中的信道都类似于单所有权，因为一旦将一个值传送到信道中，将无法再使用这个值。共享内存类似于多所有权：多个线程可以同时访问相同的内存位置。

**互斥器**（*mutex*）是 互相排斥（*mutual exclusion*）的缩写。在同一时刻，其只允许一个线程对数据拥有访问权。为了访问互斥器中的数据，线程首先需要通过获取互斥器的 **锁**（*lock*）来表明其希望访问数据。锁是一个数据结构，作为互斥器的一部分，它记录谁有数据的专属访问权。因此我们讲，互斥器通过锁系统 **保护**（*guarding*）其数据。

#### `Mutex<T>`
```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);

    {
        let mut num = m.lock().unwrap();
        *num = 6;
    }

    println!("m = {m:?}");
}
```

像很多类型一样，我们使用关联函数 new 来创建一个 Mutex<T>。使用 lock 方法来获取锁，从而可以访问互斥器中的数据。这个调用会**阻塞**当前线程，直到我们拥有锁为止。
如果另一个线程拥有锁，并且那个线程 panic 了，则 lock 调用会失败。在这种情况下，没人能够再获取锁，所以我们调用 unwrap，使当前线程 panic。
一旦获取了锁，就可以将返回值（命名为 num）视为一个其内部数据（i32）的可变引用了。

 Arc<T> 是一个类似 Rc<T> 并可以安全的用于并发环境的类型，和 Rc<T> 有着相同的 API。字母 “a” 代表 **原子性**（*atomic*），所以这是一个 **原子引用计数**（*atomically reference counted*）类型。线程安全会造成性能损失，我们希望只在必要时才为此买单。如果只是在单线程中对值进行操作，原子性提供的保证并无必要，而不加入原子性可以使代码运行得更快。
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

### `Sync`  and  `Send` trait
有两个并发概念是内嵌于语言中的：std::marker 中的 Sync 和 Send trait。
Send 标记 trait 表明实现了 Send 的类型值的所有权可以在线程间传送。任何完全由 Send 的类型组成的类型也会自动被标记为 Send。几乎所有基本类型都是 Send 的，除了裸指针（raw pointer）。几乎所有的 Rust 类型都是Send 的，不过有一些例外，包括 Rc<T>。

Sync 标记 trait 表明一个实现了 Sync 的类型可以安全的在多个线程中拥有其值的引用。换一种方式来说，对于任意类型 T，如果 &T（T 的不可变引用）是 Send 的话 T 就是 Sync 的，这意味着其引用就可以安全的发送到另一个线程。

通常并不需要手动实现 Send 和 Sync trait，因为由 Send 和 Sync 的类型组成的类型，自动就是 Send 和 Sync 的。因为它们是标记 trait，甚至都不需要实现任何方法。它们只是用来加强并发相关的不可变性的。

## Async / await
> 如果我们在构建一个管理文件下载的工具，我们应当以一种不会因开始一个下载任务而锁定 UI 的方式来编写程序，并且用户应该能够同时开始多个下载任务。不过很多操作系统与网络交互的 API 都是 *阻塞* 的（*blocking*）。也就是说这些 API 会阻塞程序的进程，直到它们处理的数据完全就绪。
> 我们可以新建专用的线程来下载每个文件以免阻塞主线程。然而，我们最终会发现这些线程的开销会成为一个问题。如果这些调用在一开始就是非阻塞的话那就更理想了。

Rust 异步编程的关键元素是 *futures* 和 Rust 的 async 与 await 关键字。
Rust 提供了 Future trait 作为基础组件，这样不同的异步操作就可以在不同的数据结构上实现。在 Rust 中，我们称实现了 Future trait 的类型为 futures。每一个实现了 Future 的类型会维护自己的进度状态信息和 “ready” 的定义。

当 Rust 遇到一个 async 关键字标记的代码块时，会将其编译为一个实现了 Future trait 的唯一的、匿名的数据类型。当 Rust 遇到一个被标记为 async 的函数时，会将其编译进一个拥有异步代码块的非异步函数。异步函数的返回值类型是编译器为异步代码块所创建的匿名数据类型。编写 async fn 就等同于编写一个返回类型的 *future* 的函数。
```rust
use trpl::Html;

async fn page_title(url: &str) -> Option<String> {
    let response = trpl::get(url).await;
    let response_text = response.text().await;
    Html::parse(&response_text)
        .select_first("title")
        .map(|title_element| title_element.inner_html())
}

// equal to
fn page_title(url: &str) -> impl Future<Output = Option<String>> + '_ {
    async move {
        let text = trpl::get(url).await.text().await;
        Html::parse(&text)
            .select_first("title")
            .map(|title| title.inner_html())
    }
}
```

注意 Rust 的 await 关键字出现在需要等待的表达式之后而不是之前。也就是说，这是一个 *后缀关键字*（*postfix keyword*）。Rust 如此选择是因为这使得方法的链式调用更加简洁。
```rust
    let response_text = trpl::get(url).await.text().await;
```

trpl crate 提供了一个 spawn_task 函数，它看起来非常像 thread::spawn API，和一个 sleep 函数，这是 thread::sleep API 的异步版本。
```rust
use std::time::Duration;

fn main() {
    trpl::run(async {
        trpl::spawn_task(async {
            for i in 1..10 {
                println!("hi number {i} from the first task!");
                trpl::sleep(Duration::from_millis(500)).await;
            }
        });

        for i in 1..5 {
            println!("hi number {i} from the second task!");
            trpl::sleep(Duration::from_millis(500)).await;
        }
    });
}
```

```rust
        let fut1 = async {
            for i in 1..10 {
                println!("hi number {i} from the first task!");
                trpl::sleep(Duration::from_millis(500)).await;
            }
        };

        let fut2 = async {
            for i in 1..5 {
                println!("hi number {i} from the second task!");
                trpl::sleep(Duration::from_millis(500)).await;
            }
        };

        trpl::join(fut1, fut2).await;
```
trpl::join 函数是 *公平的*（*fair*），这意味着它以相同的频率检查每一个 future，使它们交替执行，绝不会让一个任务在另一个任务准备好时抢先执行。对于线程来说，操作系统会决定该检查哪个线程和会让它运行多长时间。对于异步 Rust 来说，运行时决定检查哪一个任务。

### Streams
流类似于一种异步形式的迭代器。不过鉴于 trpl::Receiver 专门等待接收消息，多用途的流 API 则更为通用：它像 Iterator 一样提供了下一个项，不过是异步版本的。
Stream trait 定义了一个底层接口用于有效地组合 Iterator 和 Future trait。StreamExt trait 在 Stream 之上提供了一组高层 API，这包括 next 和其它类似于 Iterator trait 提供的工具方法。
```rust
use trpl::StreamExt;

fn main() {
    trpl::run(async {
        let values = 1..101;
        let iter = values.map(|n| n * 2);
        let stream = trpl::stream_from_iter(iter);

        let mut filtered =
            stream.filter(|value| value % 3 == 0 || value % 5 == 0);

        while let Some(value) = filtered.next().await {
            println!("The value was: {value}");
        }
    });
}
```

### Thread v.s. Future
#### 线程与异步模型的本质区别
1. **执行单元与管理层级**  
   • 线程由操作系统直接管理，每个线程拥有独立栈空间和调度上下文，适合CPU密集型任务
   • 异步任务由运行时（如tokio/async-std）管理，通过状态机机制在单线程内调度多个任务，内存开销更小（每个任务约24字节），适合I/O密集型场景

2. **性能特征对比**  
   | 维度              | 线程模型                          | 异步模型                          |
   |-------------------|---------------------------------|---------------------------------|
   | 内存开销          | 每个线程MB级（默认栈空间）     | 每个任务约24字节             |
   | 上下文切换        | 操作系统内核调度（微秒级）     | 用户态调度（纳秒级）      |
   | 最佳适用场景       | 计算密集型并行任务         | 高并发I/O操作（如万级网络连接） |

3. **组合使用范式**  
   通过通道实现异构并发（Listing 17-42）：
   ```rust
   // 计算密集型任务使用线程
   thread::spawn(move || {
       heavy_computation(tx.clone());
   });
   
   // I/O密集型任务使用异步
   trpl::run(async {
       while let Some(data) = rx.recv().await {
           async_processing(data).await;
       }
   });
   ```
   这种模式常见于：视频编码（线程）+ UI通知（异步）、分布式系统任务调度

#### 核心设计哲学差异
1. **线程模型的确定性**  
   • "即发即忘"模式，依赖OS调度器
   • 缺乏原生取消机制，资源回收依赖线程结束

2. **异步模型的组合性**  
   • 通过Future trait实现超时/节流等组合模式：
   ```rust
   // 优雅的超时控制
   tokio::time::timeout(Duration::from_secs(5), async_task()).await
   ```
   • 基于Pin的固定内存布局，支持自引用结构

3. **错误处理范式**  
   • 线程间传播错误需要通道或共享状态
   • 异步任务可通过`.await`直接传播Result

#### 工程实践建议
1. **选择依据矩阵**  
   | 指标                | 优选线程                          | 优选异步                          |
   |---------------------|---------------------------------|---------------------------------|
   | 任务类型            | 计算密集型               | I/O密集型               |
   | 硬件环境            | 多核服务器                   | 嵌入式设备（单核）           |
   | 开发复杂度          | 简单同步逻辑                 | 复杂并发组合                 |

2. **混合使用原则**  
   • 使用`spawn_blocking`包装阻塞操作，避免阻塞运行时线程池
   • 通过无锁数据结构（如crossbeam）连接线程与异步任务

3. **性能调优方向**  
   • 线程：优化线程池大小（通常=CPU核心数）
   • 异步：选择work-stealing运行时（如tokio），配置恰当的任务缓冲区

#### 未来演进方向
Rust异步模型正在向更细粒度的执行器发展，如：
• **结构化并发**：通过作用域任务实现父子关系
• **异步析构器**：解决资源清理时序问题
• **无栈协程**：进一步降低内存开销

这种设计哲学使Rust既能处理嵌入式系统的实时约束，也能支撑云原生时代的百万级并发需求。

## Pattern
**模式**（*Patterns*）是 Rust 中特殊的语法，它用来匹配类型中的结构，无论类型是简单还是复杂。结合使用模式和 match 表达式以及其他结构可以提供更多对程序控制流的支配权。模式由如下一些内容组合而成：
* 字面值
* 解构的数组、枚举、结构体或者元组
* 变量
* 通配符
* 占位符

```rust
let (x, y, z) = (1, 2, 3);

fn print_coordinates(&(x, y): &(i32, i32)) {
    println!("Current location: ({x}, {y})");
}

fn main() {
    let point = (3, 5);
    print_coordinates(&point);
}
```
### Refutability
模式有两种形式：refutable（可反驳的）和 irrefutable（不可反驳的）。能匹配任何传递的可能值的模式被称为是 **不可反驳的**（*irrefutable*）。
函数参数、let 语句和 for 循环只能接受不可反驳的模式，因为当值不匹配时，程序无法进行有意义的操作。if let 和 while let 表达式可以接受可反驳和不可反驳的模式。
```rust
	// error
    let Some(x) = some_option_value;
	// 将不可反驳模式用于 if let 是没有意义的
	if let x = 5 {
        println!("{x}");
    };
```

### 解构结构体
```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 7 };

    let Point { x, y } = p;
    assert_eq!(0, x);
    assert_eq!(7, y);
}
```

### 用 .. 忽略剩余值
```rust
// 1
    struct Point {
        x: i32,
        y: i32,
        z: i32,
    }

    let origin = Point { x: 0, y: 0, z: 0 };

    match origin {
        Point { x, .. } => println!("x is {x}"),
    }

// 2
fn main() {
    let numbers = (2, 4, 8, 16, 32);

    match numbers {
        (first, .., last) => {
            println!("Some numbers: {first}, {last}");
        }
    }
}
```
然而使用 .. 必须是无歧义的。如果期望匹配和忽略的值是不明确的，Rust 会报错。
```rust
fn main() {
    let numbers = (2, 4, 8, 16, 32);

    match numbers {
        (.., second, ..) => {
            println!("Some numbers: {second}")
        },
    }
}
```

### match gaurd
```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        Some(n) if n == y => println!("Matched, n = {n}"),
        _ => println!("Default case, x = {x:?}"),
    }

    println!("at the end: x = {x:?}, y = {y}");
}
```

```rust
    let x = 4;
    let y = false;

    match x {
		// (4 | 5 | 6) if y =>
        4 | 5 | 6 if y => println!("yes"),
        _ => println!("no"),
    }

```
### at
*at* 运算符（@）允许我们在创建一个存放值的变量的同时测试其值是否匹配模式。
```rust
    enum Message {
        Hello { id: i32 },
    }

    let msg = Message::Hello { id: 5 };

    match msg {
        Message::Hello {
            id: id_variable @ 3..=7,
        } => println!("Found an id in range: {id_variable}"),
        Message::Hello { id: 10..=12 } => {
            println!("Found an id in another range")
        }
        Message::Hello { id } => println!("Found some other id: {id}"),
    }

```

## OOP
> 对很多人来说，多态性与继承同义。但它实际上是一个更广义的概念，指的是可以处理多种类型数据的代码。对继承而言，这些类型通常是子类。 Rust 使用泛型来抽象不同可能的类型，并通过 trait bounds 来约束这些类型所必须提供的内容。这有时被称为 *bounded parametric polymorphism*。

### trait object
trait 对象指向一个实现了我们指定 trait 的类型的实例，以及一个用于在运行时查找该类型的 trait 方法的表。我们通过指定某种指针来创建 trait 对象，例如 & 引用或 Box<T> 智能指针，还有 dyn keyword，以及指定相关的 trait。我们可以使用 trait 对象代替泛型或具体类型。任何使用 trait 对象的位置，Rust 的类型系统会在编译时确保任何在此上下文中使用的值会实现其 trait 对象的 trait。
Rust 刻意不将结构体与枚举称为 “对象”，以便与其他语言中的对象相区别。在结构体或枚举中，结构体字段中的数据和 impl 块中的行为是分开的，不同于其他语言中将数据和行为组合进一个称为对象的概念中。trait 对象将数据和行为两者相结合，从这种意义上说 **则** 其更类似其他语言中的对象。不过 trait 对象不同于传统的对象，因为不能向 trait 对象增加数据。

```rust
pub struct Screen {
    pub components: Vec<Box<dyn Draw>>,
}
```
这与定义使用了带有 trait bound 的泛型类型参数的结构体不同。泛型类型参数一次只能替代一个具体类型，而 trait 对象则允许在运行时替代多种具体类型。

当对泛型使用 trait bound 时编译器所执行的单态化处理：编译器为每一个被泛型类型参数代替的具体类型生成了函数和方法的非泛型实现。单态化产生的代码在执行 **静态分发**（*static dispatch*）。静态分发发生于编译器在编译时就知晓调用了什么方法的时候。这与 **动态分发** （*dynamic dispatch*）相对，这时编译器在编译时无法知晓调用了什么方法。在动态分发的场景下，编译器会生成负责在运行时确定该调用什么方法的代码。
当使用 trait 对象时，Rust 必须使用动态分发。编译器无法知晓所有可能用于 trait 对象代码的类型，所以它也不知道应该调用哪个类型的哪个方法实现。为此，Rust 在运行时使用 trait 对象中的指针来知晓需要调用哪个方法。动态分发也阻止编译器有选择的内联方法代码，这会相应的禁用一些优化。

## High level
### unsafe
#### raw pointer
不安全 Rust 有两个被称为 **裸指针**（*raw pointers*）的类似于引用的新类型。和引用一样，裸指针是不可变或可变的，分别写作 *const T 和 *mut T。这里的星号不是解引用运算符；它是类型名称的一部分。在裸指针的上下文中，**不可变** 意味着指针解引用之后不能直接赋值。
裸指针与引用和智能指针的区别在于：
* 允许忽略借用规则，可以同时拥有不可变和可变的指针，或多个指向相同位置的可变指针
* 不保证指向有效的内存
* 允许为空
* 不能实现任何自动清理功能
通过去掉 Rust 强加的保证，你可以放弃安全保证以换取性能或使用另一个语言或硬件接口的能力，此时 Rust 的保证并不适用。
#### unsafe function
不安全函数和方法与常规函数方法十分类似，除了其开头有一个额外的 unsafe。在此上下文中，关键字unsafe表示该函数具有调用时需要满足的要求，而 Rust 不会保证满足这些要求。
```rust
    unsafe fn dangerous() {}

    unsafe {
        dangerous();
    }

```
### extern
有时你的 Rust 代码可能需要与其他语言编写的代码交互。为此 Rust 有一个关键字，extern，有助于创建和使用 **外部函数接口**（*Foreign Function Interface*，FFI）。外部函数接口是一个编程语言用以定义函数的方式，其允许不同（外部）编程语言调用这些函数。extern 块中声明的函数在 Rust 代码中总是不安全的。因为其他语言不会强制执行 Rust 的规则且 Rust 无法检查它们，所以确保其安全是程序员的责任。
```rust
extern "C" {
    fn abs(input: i32) -> i32;
}

fn main() {
    unsafe {
        println!("Absolute value of -3 according to C: {}", abs(-3));
    }
}
```

也可以使用 extern 来创建一个允许其他语言调用 Rust 函数的接口。不同于创建整个 extern 块，就在 fn 关键字之前增加 extern 关键字并为相关函数指定所用到的 ABI。还需增加 #[no_mangle] 注解来告诉 Rust 编译器不要 mangle 此函数的名称。*Mangling* 发生于当编译器将我们指定的函数名修改为不同的名称时，这会增加用于其他编译过程的额外信息，不过会使其名称更难以阅读。每一个编程语言的编译器都会以稍微不同的方式 mangle 函数名，所以为了使 Rust 函数能在其他语言中指定，必须禁用 Rust 编译器的 name mangling。
```rust
#[no_mangle]
pub extern "C" fn call_from_c() {
    println!("Just called a Rust function from C!");
}
```

#### static
通常静态变量的名称采用 SCREAMING_SNAKE_CASE 写法。静态变量只能储存拥有 'static 生命周期的引用，这意味着 Rust 编译器可以自己计算出其生命周期而无需显式标注。访问不可变静态变量是安全的。访问和修改可变静态变量都是 **不安全** 的。
```rust
static mut COUNTER: u32 = 0;

fn add_to_count(inc: u32) {
    unsafe {
        COUNTER += inc;
    }
}

fn main() {
    add_to_count(3);

    unsafe {
        println!("COUNTER: {COUNTER}");
    }
}
```

#### unsafe trait
当 trait 中至少有一个方法中包含编译器无法验证的不变式（invariant）时 trait 是不安全的。
```rust
unsafe trait Foo {
    // methods go here
}

unsafe impl Foo for i32 {
    // method implementations go here
}

fn main() {}
```

### trait
#### Associated Types
**关联类型**（*associated types*）让我们可以在 trait 里面增加一个待定义的类型（类型占位符），将类型占位符与 trait 相关联，这样 trait 的方法签名中就可以使用这些占位符类型。trait 的实现者在实现这个 trait 的时候，会指定一个具体类型，来替换掉这个占位符。这样，我们可以在一个 trait 中通过占位符使用不同类型，在实现此 trait 时才需要指定这些类型具体是什么。
一个带有关联类型的 trait 的例子是标准库提供的 Iterator trait。它有一个叫做 Item 的关联类型来替代遍历的值的类型。
```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}
```

## Macro
**宏**（*Macro*）指的是 Rust 中一系列的功能：使用 macro_rules! 的 **声明**（*Declarative*）宏，和三种 **过程**（*Procedural*）宏：
* 自定义 #[derive] 宏在结构体和枚举上指定通过 derive 属性添加的代码
* 类属性（Attribute-like）宏定义可用于任意项的自定义属性
* 类函数宏看起来像函数不过作用于作为参数传递的 token

从根本上来说，宏是一种为写其他代码而写代码的方式，即所谓的 **元编程**（*metaprogramming*）。
所有的这些宏以 **展开** 的方式来生成比你所手写出的更多的代码。

一个函数签名必须声明函数参数个数和类型。相比之下，宏能够接收不同数量的参数：用一个参数调用 println!("hello") 或用两个参数调用 println!("hello {}", name) 。而且，宏可以在编译器翻译代码前展开，例如，宏可以在一个给定类型上实现 trait。而函数则不行，因为函数是在运行时被调用，同时 trait 需要在编译时实现。

### Declarative Macros
可以使用macro_rules! 来定义宏。
```rust
#[macro_export]
macro_rules! vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}
```
#[macro_export] 注解表明只要导入了定义这个宏的 crate，该宏就应该是可用的。如果没有该注解，这个宏不能被引入作用域。
接着使用 macro_rules! 和宏名称开始宏定义，且所定义的宏并 **不带** 感叹号。名字后跟大括号表示宏定义体。
### Procedural Macros
第二种形式的宏被称为 **过程宏**（*procedural macros*），因为它们更像函数（一种过程类型）。过程宏接收 Rust 代码作为输入，在这些代码上进行操作，然后产生另一些代码作为输出，而非像声明式宏那样匹配对应模式然后以另一部分代码替换当前代码。有三种类型的过程宏（自定义派生（derive），类属性和类函数），不过它们的工作方式都类似。
定义过程宏的函数接收一个 TokenStream 作为输入并生成 TokenStream 作为输出。TokenStream 是定义于proc_macro crate 里代表一系列 token 的类型，Rust 默认携带了proc_macro crate。这就是宏的核心：宏所处理的源代码组成了输入 TokenStream，宏生成的代码是输出 TokenStream。函数上还有一个属性；这个属性指明了我们创建的过程宏的类型。在同一 crate 中可以有多种的过程宏。
