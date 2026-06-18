---
title: 【CPP】W3C C++
date: 2020-12-01 00:00:00+0000
categories: 
- nutrition
- temple
tags:
    - CPP
---

## Introduction

C++ is a cross-platform language that can be used to create high-performance applications.

C++ was developed by Bjarne Stroustrup, as an extension to the [C language](https://www.w3schools.com/c/index.php).

C++ gives programmers a **high level of control** over system resources and memory.

The language was updated **4 major times** in 2011, 2014, 2017, and 2020 to C++11, C++14, C++17, C++20.

To start using C++, you need two things:

- A text editor, like Notepad, to write C++ code
- A compiler, like GCC, to translate the C++ code into a language that the computer will understand

## Const

the `const` keyword  will declare the variable as "constant", which means **unchangeable and read-only**)

## Basic Data Type

The data type specifies the size and type of information the variable will store:

| Data Type | Size         | Description                                                  |
| :-------- | :----------- | :----------------------------------------------------------- |
| `boolean` | 1 byte       | Stores true or false values                                  |
| `char`    | 1 byte       | Stores a single character/letter/number, or ASCII values     |
| `int`     | 2 or 4 bytes | Stores whole numbers, without decimals                       |
| `float`   | 4 bytes      | Stores fractional numbers, containing one or more decimals. Sufficient for storing 7 decimal digits |
| `double`  | 8 bytes      | Stores fractional numbers, containing one or more decimals. Sufficient for storing 15 decimal digits |

## Strings

A `string` variable contains a collection of characters surrounded by double quotes

To use strings, you must include an additional header file in the source code, the `<string>` library

It is possible to use the extraction operator `>>` on `cin` to display a string entered by a user. However, `cin` considers a space (whitespace, tabs, etc) as a terminating character, which means that it can only display a single word . That's why, when working with strings, we often use the `getline()` function to read a line of text. It takes `cin` as the first parameter, and the string variable as second.

```cpp
getline (cin, fullName);
```

