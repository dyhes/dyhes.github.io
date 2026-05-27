---
title: 【Rust】Basics
date: 2022-09-12 00:00:00+0000
categories: 
- nutrition
- temple
---

## Expressions and  Statements

*Statements* are instructions that perform some action and do not return a value. *Expressions* evaluate to a resulting value.

## Ownship

*Ownership* is a set of rules that governs how a Rust program manages memory.

All data stored on the stack must have a known, fixed size. Data with an unknown size at compile time or a size that might change must be stored on the heap instead.

Keeping track of what parts of code are using what data on the heap, minimizing the amount of duplicate data on the heap, and cleaning up unused data on the heap so you don’t run out of space are all problems that ownership addresses. 

### [Ownership Rules](https://doc.rust-lang.org/stable/book/ch04-01-what-is-ownership.html#ownership-rules)

- Each value in Rust has an *owner*.
- There can only be one owner at a time.
- When the owner goes out of scope, the value will be dropped.

The ownership of a variable follows the same pattern every time: assigning a value to another variable moves it. 

A reference is like a pointer in that it’s an address we can follow to access the data stored at that address; that data is owned by some other variable. 

## Module Systems

- **Packages:** A Cargo feature that lets you build, test, and share crates
- **Crates:** A tree of modules that produces a library or executable
- **Modules** and **use:** Let you control the organization, scope, and privacy of paths
- **Paths:** A way of naming an item, such as a struct, function, or module

