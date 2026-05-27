---
title: 【Java】Basics
date: 2020-12-20 00:00:00+0000
categories: 
- nutrition
- temple
tags:
    - Java
---

## Introduction

Every line of code that runs in Java must be inside a `class`.  A class should always start with an uppercase first letter.

The name of the java file **must match** the class name. When saving the file, save it using the class name and add ".java" to the end of the filename.

Every program must contain the `main()` method.

```java
public static void main(String[] args)
```

## Variables

```java
type variablename=value;

type[] arrayname
```

### Data Types

#### primitive types

| Data Type | Size    | Description                                                  |
| :-------- | :------ | :----------------------------------------------------------- |
| byte      | 1 byte  | Stores whole numbers from -128 to 127                        |
| short     | 2 bytes | Stores whole numbers from -32,768 to 32,767                  |
| int       | 4 bytes | Stores whole numbers from -2,147,483,648 to 2,147,483,647    |
| long      | 8 bytes | Stores whole numbers from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 |
| float     | 4 bytes | Stores fractional numbers. Sufficient for storing 6 to 7 decimal digits |
| double    | 8 bytes | Stores fractional numbers. Sufficient for storing 15 decimal digits |
| boolean   | 1 bit   | Stores true or false values                                  |
| char      | 2 bytes | Stores a single character/letter or ASCII values             |

#### Non-primitive

Non-primitive data types are called **reference types** because they refer to objects.

* String
* Arrays
* Classes
* Interfaces

#### main difference

- Primitive types are **predefined** in Java. Non-primitive types are created by the programmer and is not defined by Java (except for `String`).
- A primitive type has always a value, while non-primitive types can be `null`.
- A **primitive type** starts with a **lowercase letter**, while **non-primitive types** starts with an **uppercase letter**.
- The size of a primitive type depends on the data type, while **non-primitive types have all the same size**.

### final

```java
final int myNum=15;
//you couldn't change it anymore
//just like const in js
```

### name rules

The general rules for naming variables are:

- Names can contain **letters, digits, underscores, and dollar signs**
- Names must **begin with a letter**
- Names should start with a **lowercase** letter and it **cannot contain whitespace**
- Names can also begin with **$ and _** (but we will not use it in this tutorial)
- Names are **case sensitive** ("myVar" and "myvar" are different variables)
- Reserved words (like Java keywords, such as `int` or `boolean`) cannot be used as names

### Casting

#### Widening Casting

Widening casting is done automatically when passing a smaller size type to a larger size type

```java
int myInt = 9;
double myDouble = myInt;
```

#### Narrowing Casting

Narrowing casting must be done manually by placing the type in parentheses in front of the value

```java
double myDouble = 9.78d;
int myInt = (int) myDouble;
```

## Overload

```java
int myMethod(int x)
int myMethod(int x,int y)
float myMethod(float x)
double myMethod(double x, double y)
```



## Classes

a class is a template for objects, and an object is an instance of a class.

### Constructor

A constructor in Java is a **special method** that is used to initialize objects. The constructor is called when an object of a class is created. It can be used to set initial values for object attributes

Note that the constructor name must **match the class name**, and it cannot have a **return type** (like `void`).

### Modifiers

#### Access Modifiers

* **public: **：accessible for all classes
* **protected:** accessible in the same package and **subclasses**
* **default: **：accessible in the same package
* **private:** only accessible within the declared class

#### Non-Access Modifiers

##### for classes

* **final**: cannot be inherited
* **abstract**: cannot be used to create objects

##### for attributes and methods

* **final**: cannot be overridden/modified
* **static** :belongs to the class, rather than an object
* **abstract**: Can only be used in an abstract class, and can only be used on methods.

### Main Concepts of OOP

#### Encapsulation

* declare class variables/attributes as `private`

* provide public **get** and **set** methods to access and update the value of a `private` variable

To inherit from a class, use the `extends` keyword.

#### Inheritance

- **subclass** (child) - the class that inherits from another class
- **superclass** (parent) - the class being inherited from

#### Polymorphism

subclasses can override methods inherited from superclasses

#### Abstract

- **Abstract class:** is a restricted class that cannot be used to create objects (to access it, it must be inherited from another class).
- **Abstract method:** can only be used in an abstract class, and it does not have a body. The body is provided by the subclass (inherited from).

### Interface

An `interface` is a completely "**abstract class**" that is used to group related methods with empty bodies

To access the interface methods, the interface must be "implemented" (kinda like inherited) by another class with the `implements` keyword (instead of `extends`). The body of the interface method is provided by the "implement" class.

- On implementation of an interface, you must override all of its methods
- Interface **methods** are by default `abstract` and `public`
- Interface **attributes** are by default `public`, `static` and `final`
- An interface cannot contain a constructor (as it cannot be used to create objects)

#### why

1) To achieve **security** - hide certain details and only show the important details of an object (interface).

2) Java does not support "multiple inheritance" (a class can only inherit from one superclass). However, it can be achieved with interfaces, because the class can **implement** multiple interfaces. **Note:** To implement multiple interfaces, separate them with a comma (see example below).

### Inner Classes

In Java, it is also possible to nest classes (a class within a class). The purpose of nested classes is to group classes that belong together, which makes your code more **readable and maintainable**.

```java
class OuterClass {
  int x = 10;

  class InnerClass {
    int y = 5;
  }
}

public class Main {
  public static void main(String[] args) {
    OuterClass myOuter = new OuterClass();
    OuterClass.InnerClass myInner = myOuter.new InnerClass();
    System.out.println(myInner.y + myOuter.x);
  }
}

```

### Wrapper Classes

Wrapper classes provide a way to use primitive data types (`int`, `boolean`, etc..) as objects.

The table below shows the primitive type and the equivalent wrapper class:

| Primitive Data Type | Wrapper Class |
| :------------------ | :------------ |
| byte                | Byte          |
| short               | Short         |
| int                 | Integer       |
| long                | Long          |
| float               | Float         |
| double              | Double        |
| boolean             | Boolean       |
| char                | Character     |

## Enums

An `enum` is a special "class" that represents a group of **constants** (unchangeable variables, like `final` variables).

To create an `enum`, use the `enum` keyword (instead of class or interface), and separate the constants with a comma. Note that they should be in uppercase letters

```java
enum Level {
  LOW,
  MEDIUM,
  HIGH
}

//looping
for (Level myVar : Level.values()) {
  System.out.println(myVar);
}
```

An `enum` can, just like a `class`, have attributes and methods. The only difference is that enum constants are `public`, `static` and `final` (unchangeable - cannot be overridden).

An `enum` cannot be used to create objects, and it cannot extend other classes (but it can implement interfaces).

## User Input

The `Scanner` class is used to get user input, and it is found in the `java.util` package.

```java
import java.util.Scanner;  // Import the Scanner class

class Main {
  public static void main(String[] args) {
    Scanner myObj = new Scanner(System.in);  // Create a Scanner object
    System.out.println("Enter username");

    String userName = myObj.nextLine();  // Read user input
    System.out.println("Username is: " + userName);  // Output user input
  }
}
```

| Method          | Description                           |
| :-------------- | :------------------------------------ |
| `nextBoolean()` | Reads a `boolean` value from the user |
| `nextByte()`    | Reads a `byte` value from the user    |
| `nextDouble()`  | Reads a `double` value from the user  |
| `nextFloat()`   | Reads a `float` value from the user   |
| `nextInt()`     | Reads a `int` value from the user     |
| `nextLine()`    | Reads a `String` value from the user  |
| `nextLong()`    | Reads a `long` value from the user    |
| `nextShort()`   | Reads a `short` value from the user   |

## Collections

#### ArrayList

The `ArrayList` class is a resizable array

```java
ArrayList<String> cars = new ArrayList<String>(); 
```

#### LinkedList

The `LinkedList` class has all of the same methods as the `ArrayList` class because they both implement the `List` interface. But they work in different way.

#### HashMap

A `HashMap` however, store items in "**key**/**value**" pairs, and you can access them by an index of another type.(e.g. a `String`)

```java
HashMap<String, String> capitalCities = new HashMap<String, String>();
```

#### HashSet

A HashSet is a collection of items where every item is unique.

```java
HashSet<String> cars = new HashSet<String>();
```

#### Iterator

An `Iterator` is an object that can be used to loop through collections.

```java
// Import the ArrayList class and the Iterator class
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
  public static void main(String[] args) {

    // Make a collection
    ArrayList<String> cars = new ArrayList<String>();
    cars.add("Volvo");
    cars.add("BMW");
    cars.add("Ford");
    cars.add("Mazda");

    // Get the iterator
    Iterator<String> it = cars.iterator();

    // Print the first item
    System.out.println(it.next());
  }
}
```

To loop through a collection, use the `hasNext()` and `next()` methods of the `Iterator`

```java
while(it.hasNext()) {
  System.out.println(it.next());
}
```

##### Removing items

```java
    while(it.hasNext()) {
      Integer i = it.next();
      if(i < 10) {
        it.remove();
      }
    }
```

**Note:** Trying to remove items using a **for loop** or a **for-each loop** would not work correctly because the collection is changing size at the same time that the code is trying to loop.

## Lambda

```java
parameter -> expression
    
(parameter1, parameter2) -> expression
    
(parameter1, parameter2) -> { code block }
```

## Thread

Threads allows a program to operate more efficiently by doing multiple things at the same time.

Threads can be used to perform complicated tasks in the background without interrupting the main program.

### Creating

```java
//1
public class Main extends Thread {
  public void run() {
    System.out.println("This code is running in a thread");
  }
}
//2
public class Main implements Runnable {
  public void run() {
    System.out.println("This code is running in a thread");
  }
}
```

### Running

```java
//1
public class Main extends Thread {
  public static void main(String[] args) {
    Main thread = new Main();
    thread.start();
    System.out.println("This code is outside of the thread");
  }
  public void run() {
    System.out.println("This code is running in a thread");
  }
}
//2
public class Main implements Runnable {
  public static void main(String[] args) {
    Main obj = new Main();
    Thread thread = new Thread(obj);
    thread.start();
    System.out.println("This code is outside of the thread");
  }
  public void run() {
    System.out.println("This code is running in a thread");
  }
}
```

## Exceptions

```java
try{
    throw ...
}catch(Exception e){
    
}finally{
    
}
```

