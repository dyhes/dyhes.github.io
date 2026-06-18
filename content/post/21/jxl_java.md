---
title: 【Java】金旭亮-Java程序设计
date: 2021-12-11 00:00:00+0000
categories: 
- nutrition
- temple
tags:
    - Java
---

## String

### StringBuffer

线程安全

* `stringbuffer.toString()`

###  StringBuilder

线程不安全，因而性能相对更高

## Arrays类

Arrays类中封装了与数组有关的静态方法

* `Arrays.CcopyOf()`
* `Arrays.sort()`
* `Arrays.fill()`

等

## 对象连接

在“+ ”运算中，当一个对象与一个String对象连接时，会 隐式地调用其toString()方法，默认情况下，此方法返回 “类名 @ + hashCode” 。 为了返回有意义的信息，子类可以重写toString()方法。

##  接口

在面向对象世界中，可以使用“接口（interface）”来抽象对象的**行为特性**

> eg:能否把“会游泳”、“能被吃”这种特性独立出来作为一种“可选项”，可以被“附加” 到具体对象上？ 这样一来，水鸟可以拥有“会游泳”这个特性，其它种类的鸟就不具备这个特性，但它 可能有其他的特性。

* 如果接口不声明为public的，则自动变为package

* `接口类型 接口类型的变量＝ new 实现了接口的具体类型（）；`
* 可以通过继承接口来扩充已有接口，并形成一个新的接口

###  函数式接口

JDK中引入了一种“函数式”接口，这种接口只定义有一个公有 方法，使用@FunctionalInterface注解加以标注，这种类型的接口，主要用于“函数式编程”场景

## 异常


* 可以有多个catch语句块，每个代码块捕获一种异常。在某个try块后有两个不同的catch 块捕获两个相同类型的异常是语法错误。
* 使用catch语句，只能捕获Exception类及其子类的对象。因此，一个捕获Exception对象的catch语句块可以捕获所有“可捕获”的异常。
* 将catch(Exception e)放在别的catch块前面会使这些catch块都不执行，因此Java不会编译这个程序

Java 7 及以后的版本，允许在一个catch块中捕获多个异常。

```java
catch (SocketException | SecurityException | NullPointerException e)
```

## 泛型

* 不能定义泛型化数组
* 不能直接创建泛型类型的实例
* 泛型类型不能直接或间接继承自Throwable
* 不能定义静态泛型成员
* 不允许基类中有泛型参数，从泛型基类派生时，应该给其指定一个具体的类型
* 可以在普通类或泛型类中定义泛型方法
* 泛型方法支持使用“…”定义个数可变的参数

## 泛型约束

* 类型约束

```java
public static <T extends Comparable> T min(T[] a) {
//…
}
//T extends Comparable & Serializable
//多个约束条件中最多只能有一个是类，且必须放在第一位
```

* **类型通配符**

  在泛型约束中使用“?”，可以匹配任意类型。

  ```java
  static void printList(List<?> lst) {
  for(Object item:lst)
  System.out.println(item);
  }
  ```

## 内部类

一个类中包容许多方法和字段，有些字段和方法从逻辑上看具有比较紧密的联系，可以把它们“放在一块”，“视为一个整体”。

内部类可看成是外部类的成员，其地位等同于类中的其他成员。内部类编译以后，每个内部类都会产生一个.class文件，其文件名通常具有以下格式：

```java
外部类名$内部类名.class
```

## Comparable接口

```java
//old
public interface Comparable {
int compareTo(Object other);
}

//new and recomended
public inteface Comparable<T> {
int compareTo(T other);
}

X.compareTo(Y);
//对象X和Y相等，返回0
//对象X<Y,返回-1
//X>Y，返回1
```

凡是支持大小比较的类型（比如Integer），都实现了Comparable接口。

## ‘==’ and `equals()`

“ ==”施加于对象类型，是比较两个对象变量是否引用同一对象。如果需要比对对象的“内容（即各字段的值）”，通常是调用对象的 equals方法。

equals方法由Object类所定义，其默认实现如下： 

```java
public boolean equals(Object obj) { return (this == obj); }
```

子类可根据实际情况，“重写（Override）”Object类的equals方法

重写Object的equals方法，注意其**参数类型必须是“Object”** 

另外，为了让对象能放入各种容器中，通常还需要重写 hashCode方法。

## 对象组合

一个对象包容另一个对象，称为“对象组合”

方式：

* A对象完全包容B对象，容器对象管理被包容对象的生命期
* B对象是独立的，A对象引用现成的B对象

## Cloneable

JDK中提供了一个Cloneable接口，需要实现深复制的对象应该实现这一接口。

```java
public interface Cloneable {
}
```

像这种根本就没有定义任何一个成员的接口，称为“标记接口”。

## Collection


## Iterator

Iterator接口定义了3个方法

```java
public Iterator<E> {
boolean hasNext(); // 是否还有下一个元素
E next(); // 获取下一个元素
void remove(); // 移除iterator返回的上一个元素
}
```

所有实现了Collection接口的集合对象，都提供了一个iterator()方法， 以获取一个iterator对象

JDK 5以后，Collection接口派生自Iterable，因此JDK中内置的所有集合都可以使 用新的foreach语句完成遍历工作

集合对象有一个forEach()方法，它可以接收一个Lambda表达式，可用于遍历集合元素， 它与foreach循环不是一回事， foreach循环是一种语法特性， forEach则是JDK为集合类型提供的一个方法。

如果在遍历时非要删除集合中的元素，则必须通过迭代器对象的remove方法， 而不能通过集合对象直接删除。

尽管确实可以在迭代时移除当前访问的元素，但并不推荐这么做，特别是在多线程环境下，会带来很大的麻烦。推荐的作法是使用Stream API中的filter()方法，过滤掉不需要的元素。

## HashTable

HashMap和HashTable两者功能与用法基本一样，但HashTable是**线程安全**的， 另外，HashMap可以使用null作为Key。

###  Properties

Properties派生自HashTable，可以方便地处理“属性-值”对，并且可以很方便地将其保存到文件中，在编程中很常用

## Collections

Java提供了一个工具类Collections，封装了一些集合的常规操作。 

* 更改集合中元素的顺序：reverse、rotate、shuffle、sort和swap
* 用一个集合填充另一个集合：copy、fill和replaceAll、 addAll
* 获取集合中的最大和最小元素：max、min
* 查找元素： binarySearch、 indexOfSubList和lastIndexOfSubList
* 创建包容多个相同元素的集合：nCopies

## 函数式编程

Java对“函数式编程”范式的支持，是从JDK 8引入Lambda表达式之后才开始的，主要包容以下几个部分：

* Lambda表达式与函数式接口特性（JDK 8起）
* Stream API（JDK 8起）与Flow API（JDK 9起）
* 对JDK原有组件进行改造，以支持函数式编程范式

###  函数式接口

能接收一个Lambda表达式的变量，必须是接口类型，并且这种接口，还必 须是一种“函数式接口（functional interface）”。所谓“函数式接口”，就是“只定义有一个抽象方法的接口”。Java 8中，使用“@FunctionalInterface”标识一个“函数式接口”。

JDK8 以后接口可有默认方法和静态方法

###  方法引用

`ClassName::Method`

可以把方法引用看作针对仅仅涉及单一方法的Lambda的“语法 糖”

###  Stream API

不同于文件操作中的Stream,而是**从支持数据处理操作的源生成的元素序列**

Stream API采用一种“即抽取即使用即丢弃”的方式处理数据，不需要把所有数据都加载到内存中（集合就是这样的）才能工作，所以，能处理很大的数据集

Stream API中定义的数据处理函数，通常可以级联调用，构成一个数据处理链条

Stream API中定义的数据处理函数，可以分为**中间操作**和**终端操作**

intermediate operation

* `peek()`:similar to `forEach()`
* `limit()`
* `skip()`
* `filter()`
* `sorted()`
* `map()`

terminal operation

* `forEach()`
* `reduce()`
* `collect()`

####  创建流对象

* 基于集合：所有集合对象都实现的Collection接口定义了一个Stream()或 parallelStream()方法，可以通过它来创建流对象
* 使用`Stream.Of`
* 使用`Stream.Builder`接口
* 针对int、long、double这三种原始数值类型，java 8提供了单独的流类型： IntStream、LongStream和DoubleStream
* `Stream.empty()`创建空流

## 模块化开发

JPMS（Java Platform Module System），是 JDK 9引入的最重要的新特性之一。

模块化之后，整个程序被分解为若干个严格限定依赖关系的模块。只要不显式声明导出，模块中的所有类外界都是不可访问的。

模块（module）是包含代码的可识别软件构件，使用了元数据（metadata）来描述模块及其与其他模块的关系。 可以把模块看成是一组用于代码重用的包（package）。模块化（ modularization）是指将系统分解成独立且相互连接的模块的过程。

打散后的JDK模块， 以.jmod作为文件扩展名。

模块之间存在着“单向”依赖关系，Java模块系统不允许模块之间 存在编译时的循环依赖

每个模块都隐式依赖于一个名为“java.base”的特殊模块，它是 一种“聚合器模块（aggregator module）”，这种类型的模块主要用于对其他模块进行逻辑分组，避免在module-info.java中导入太多的模块声明。

模块设计三个核心原则

* 强封装性
* 定义良好的接口
* 显式依赖

## GUI-JavaFX

JavaFX在设计之初就考虑了应用MVC设计模式，整个JavaFX应用 框架围绕着MVC设计模式而展开。


## JavaBean

JavaBean可以看成是一种编程约定，按照这种约定编写Java类，开发者之间就易于协作，并且代码也易于重用，并且有一些开发工具（比如 NetBeans这样的IDE）能识别JavaBean所定义的各种属性、方法和事件。


http://www.blog.dyhes.cn/wp-content/uploads/2022/04/image-20220419101022585.png
