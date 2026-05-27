---
title: 【C#】Basics
date: 2020-12-28 00:00:00+0000
categories: 
- nutrition
- temple
---

## Introduction

It is an object-oriented programming language created by Microsoft that runs on the .NET Framework.

C# has roots from the C family, and the language is close to other popular languages like [C++](https://www.w3schools.com/cpp/default.asp) and [Java](https://www.w3schools.com/java/default.asp).

## output

```c#
Console.WriteLine("Hello World!");

Console.Write("Hello World! ");
```

## Variable

```
type variableName = value;
int myNum = 15;
```

you can add the `const` keyword if you don't want others (or yourself) to overwrite existing values 

> A const field requires a value to be provided

## Data Type

| Data Type | Size                  | Description                                                  |
| :-------- | :-------------------- | :----------------------------------------------------------- |
| int       | 4 bytes               | Stores whole numbers from -2,147,483,648 to 2,147,483,647    |
| long      | 8 bytes               | Stores whole numbers from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 |
| float     | 4 bytes               | Stores fractional numbers. Sufficient for storing 6 to 7 decimal digits |
| double    | 8 bytes               | Stores fractional numbers. Sufficient for storing 15 decimal digits |
| bool      | 1 bit                 | Stores true or false values                                  |
| char      | 2 bytes               | Stores a single character/letter, surrounded by single quotes |
| string    | 2 bytes per character | Stores a sequence of characters, surrounded by double quotes |

### Arrays

```c#
string[] cars = {"Volvo", "BMW", "Ford", "Mazda"};
Console.WriteLine(cars.Length);


//if you declare an array and initialize it later, you have to use the new keyword
string[] cars;

// Add values, using new
cars = new string[] {"Volvo", "BMW", "Ford"};
```





### Type Casting

```csharp
//explicit
int myInt = (int) myDouble;
```



It is also possible to convert data types explicitly by using built-in methods, such as`Convert.ToBoolean`, `Convert.ToDouble`, `Convert.ToString`, `Convert.ToInt32` (`int`) and `Convert.ToInt64` (`long`)

```c#
int myInt = 10;
double myDouble = 5.25;
bool myBool = true;

Console.WriteLine(Convert.ToString(myInt));    // convert int to string
Console.WriteLine(Convert.ToDouble(myInt));    // convert int to double
Console.WriteLine(Convert.ToInt32(myDouble));  // convert double to int
Console.WriteLine(Convert.ToString(myBool));   // convert bool to string
```

## User Input

we use `Console.ReadLine()` to get user input.

The `Console.ReadLine()` method returns a `string`. 

```c#
string userName = Console.ReadLine();

int age = Convert.ToInt32(Console.ReadLine());
```



## foreach Loop

```c#
foreach (type variableName in arrayName) 
{
  // code block to be executed
}
```

## OOP

### Access Modifier

C# has the following access modifiers:

| Modifier    | Description                                                  |
| :---------- | :----------------------------------------------------------- |
| `public`    | The code is accessible for all classes                       |
| `private`   | The code is only accessible within the same class            |
| `protected` | The code is accessible within the same class, or in a class that is inherited from that class. You will learn more about [inheritance](https://www.w3schools.com/cs/cs_inheritance.asp) in a later chapter |
| `internal`  | The code is only accessible within its own assembly, but not from another assembly. You will learn more about this in a later chapter |

There's also two combinations: `protected internal` and `private protected`.

```c#
class Person
{
  private string Name  // property
  { get; set; }
}
```

### Sealed

If you don't want other classes to inherit from a class, use the `sealed` keyword

```c#
sealed class Vehicle 
{
  ...
}
```

### Polymorphism

```c#
class Animal  // Base class (parent) 
{
  public virtual void animalSound() 
  {
    Console.WriteLine("The animal makes a sound");
  }
}

class Pig : Animal  // Derived class (child) 
{
  public override void animalSound() 
  {
    Console.WriteLine("The pig says: wee wee");
  }
}

class Dog : Animal  // Derived class (child) 
{
  public override void animalSound() 
  {
    Console.WriteLine("The dog says: bow wow");
  }
}

class Program 
{
  static void Main(string[] args) 
  {
    Animal myAnimal = new Animal();  // Create a Animal object
    Animal myPig = new Pig();  // Create a Pig object
    Animal myDog = new Dog();  // Create a Dog object

    myAnimal.animalSound();
    myPig.animalSound();
    myDog.animalSound();
  }
}
```

## Abstract

The `abstract` keyword is used for classes and methods:

- **Abstract class:** is a restricted class that cannot be used to create objects (to access it, it must be inherited from another class).
- **Abstract method:** can only be used in an abstract class, and it does not have a body. The body is provided by the derived class (inherited from).

## Interface

An `interface` is a completely "**abstract class**", which can only contain abstract methods and properties (with empty bodies):

```c#
interface Animal 
{
  void animalSound(); // interface method (does not have a body)
  void run(); // interface method (does not have a body)
}
```

### Enums

An `enum` is a special "class" that represents a group of **constants** (unchangeable/read-only variables).

To create an `enum`, use the `enum` keyword (instead of class or interface), and separate the enum items with a comma

```c#
enum Level 
{
  Low,
  Medium,
  High
}

Level myVar = Level.Medium;
Console.WriteLine(myVar);
```
