---
title: 【Kotlin】Basics
date: 2022-06-16 00:00:00+0000
categories: 
- nutrition
- temple
---

 In Kotlin, code statements do not have to end with a semicolon (`;`)

The `println()` function is used to output values/print text

There is also a `print()` function, which is similar to `println()`. The only difference is that it does not insert a new line at the end of the output

## Variables

To create a variable, use `var` or `val`, and assign a value to it with the equal sign (`=`):

The difference between `var` and `val` is that variables declared with the `var` keyword **can be changed/modified**, while `val` variables **cannot**.

Unlike many other programming languages, variables in Kotlin do not need to be declared with a specified *type*

However, it is possible to specify the type if you insist

```kotlin
var name: String = "John" // String
val birthyear: Int = 1975 // Int
```

You can also declare a variable without assigning the value, and assign the value later. **However**, this is only possible when you specify the type

```kotlin
var name: String
name = "John"
println(name)
```

You can also use the `+` character to add a variable to another variable

#### name rules

The general rule for Kotlin variables are:

- Names can contain letters, digits, underscores, and dollar signs
- Names should start with a letter
- Names can also begin with $ and _ (but we will not use it in this tutorial)
- Names are case sensitive ("myVar" and "myvar" are different variables)
- Names should start with a lowercase letter and it cannot contain whitespace
- Reserved words (like Kotlin keywords, such as `var` or `String`) cannot be used as names

#### Date Type

Data types are divided into different groups:

- **Numbers**

  Number types are divided into two groups:

  **Integer types** store whole numbers, positive or negative (such as 123 or -456), without decimals. Valid types are `Byte`, `Short`, `Int` and `Long`.

  **Floating point types** represent numbers with a fractional part, containing one or more decimals. There are two types: `Float` and `Double`.

  To convert a numeric data type to another type, you must use one of the following functions: `toByte()`, `toShort()`, `toInt()`, `toLong()`, `toFloat()`, `toDouble()` or `toChar()`

- **Characters**

  The `Char` data type is used to store a **single** character. A char value must be surrounded by **single** quotes

- Booleans

- **Strings**

  Instead of concatenation, you can also use "string templates", which is an easy way to add variables and expressions inside a string.

  Just refer to the variable with the `$` symbol:

  ```kotlin
  var firstName = "John"
  var lastName = "Doe"
  println("My name is $firstName $lastName")
  ```

- Arrays

## Condition

- `if..else`:In Kotlin, you can also use `if..else` statements as expressions (assign a value to a variable and return it):

- Instead of writing many `if..else` expressions, you can use the `when` expression(like `switch-case`), which is much easier to read. The `when` expression is similar to the `switch` statement in Java.

  ```kotlin
  val day = 4
  
  val result = when (day) {
    1 -> "Monday"
    2 -> "Tuesday"
    3 -> "Wednesday"
    4 -> "Thursday"
    5 -> "Friday"
    6 -> "Saturday"
    7 -> "Sunday"
    else -> "Invalid day."
  }
  println(result)
  ```

- **```for...in```**

  With the [`for` loop](https://www.w3schools.com/kotlin/kotlin_for_loop.php), you can also create **ranges** of values with "`..`":

  ```kotlin
  for (chars in 'a'..'x') {
    println(chars)
  }
  ```

## Arrays

Arrays are used to store multiple values in a single variable, instead of creating separate variables for each value.

To create an array, use the `arrayOf()` function, and place the values in a comma-separated list inside it:

```kotlin
val cars = arrayOf("Volvo", "BMW", "Ford", "Mazda")
```

## Functions

The `fun` keyword is used to declare a function.

```kotlin
fun myFunction(x: Int): Int {
  return (x + 5)
}
```

There is also a shorter syntax for returning values. You can use the `=` operator instead of `return` without specifying the return type. Kotlin is smart enough to automatically find out what it is:

```kotlin
fun myFunction(x: Int, y: Int) = x + y

fun main() {
  var result = myFunction(3, 5)
  println(result)
}
```

## Class

we can use the class name to create objects.

```kotlin
Class Car{
    ...
}

var car=Car()
```

#### inheritance

Use the `open` keyword in front of the **superclass**/parent, to make this the class other classes should inherit properties and functions from.

To inherit from a class, specify the name of the **subclass**, followed by a colon `:`, and then the name of the **superclass**.

```kotlin
// Superclass
open class MyParentClass {
  val x = 5
}

// Subclass
class MyChildClass: MyParentClass() {
  fun myFunction() {
    println(x) // x is now inherited from the superclass
  }
}

// Create an object of MyChildClass and call myFunction
fun main() {
  val myObj = MyChildClass()
  myObj.myFunction()
} 
```

*unrar x -o- -y dtu_training.rar   /home/lab303/PointMVSNet/
