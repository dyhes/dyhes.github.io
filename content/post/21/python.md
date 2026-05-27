---
title: 【Python】语法
date: 2021-01-12 00:00:00+0000
categories: 
- nutrition
- temple
tags:
- AI
---

## Variables

Variables are containers for storing data values.

A variable is created **the moment** you first assign a value to it.

If you want to specify the data type of a variable, this can be done with **casting**.

```python
x = str(3)    ## x will be '3'
y = int(3)    ## y will be 3
z = float(3)  ## z will be 3.0
```

You can get the data type of a variable with the `type()` function.

### Variable Names

- A variable name must start with a **letter** or the **underscore character**
- A variable name **cannot start with a number**
- A variable name can only contain a**lpha-numeric characters and underscores** (A-z, 0-9, and _ )
- Variable names are **case-sensitive** (age, Age and AGE are three different variables)

more readable:

* Camel Case

```python
myVariableName = "John"
```

* Pascal Case

```python
MyVariableName = "John"
```

* Snake Case

```python
my_variable_name = "John"
```

### Variable Scope

Variables that are created outside of a function (as in all of the examples above) are known as global variables.

If you create a variable with the same name inside a function, this variable will be local, and can only be used inside the function. The global variable with the same name will remain as it was, global and with the original value.

To create a global variable inside a function, **you can use the `global` keyword**.

Also, use the `global` keyword if you want to **change a global variable inside a function**.

## Data Type

Python has the following data types built-in by default, in these categories:

| Text Type:      | `str`                              |
| --------------- | ---------------------------------- |
| Numeric Types:  | `int`, `float`, `complex`          |
| Sequence Types: | `list`, `tuple`, `range`           |
| Mapping Type:   | `dict`                             |
| Set Types:      | `set`, `frozenset`                 |
| Boolean Type:   | `bool`                             |
| Binary Types:   | `bytes`, `bytearray`, `memoryview` |

### Casting

There may be times when you want to specify a type on to a variable. This can be done with casting. Python is an object-orientated language, and as such it uses classes to define data types, including its primitive types.


| Example                                      | Data Type  | Try it                                                       |
| :------------------------------------------- | :--------- | :----------------------------------------------------------- |
| x = str("Hello World")                       | str        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_str2) |
| x = int(20)                                  | int        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_int2) |
| x = float(20.5)                              | float      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_float2) |
| x = complex(1j)                              | complex    | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_complex2) |
| x = list(("apple", "banana", "cherry"))      | list       | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_list2) |
| x = tuple(("apple", "banana", "cherry"))     | tuple      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_tuple2) |
| x = range(6)                                 | range      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_range2) |
| x = dict(name="John", age=36)                | dict       | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_dict2) |
| x = set(("apple", "banana", "cherry"))       | set        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_set2) |
| x = frozenset(("apple", "banana", "cherry")) | frozenset  | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_frozenset2) |
| x = bool(5)                                  | bool       | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_bool2) |
| x = bytes(5)                                 | bytes      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_bytes2) |
| x = bytearray(5)                             | bytearray  | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_bytearray2) |
| x = memoryview(bytes(5))                     | memoryview | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_type_memoryview2) |

### Booleans

Almost any value is evaluated to `True` if it has some sort of content.

Any string is `True`, except empty strings.

Any number is `True`, except `0`.

Any list, tuple, set, and dictionary are `True`, except empty ones.

### Collections

There are four collection data types in the Python programming language:

- **List** is a collection which is ordered and changeable. Allows duplicate members.
- **[Tuple](https://www.w3schools.com/python/python_tuples.asp)** is a collection which is ordered and unchangeable. Allows duplicate members.
- **[Set](https://www.w3schools.com/python/python_sets.asp)** is a collection which is unordered, unchangeable, and unindexed. No duplicate members.
- **[Dictionary](https://www.w3schools.com/python/python_dictionaries.asp)** is a collection which is ordered and changeable. No duplicate members.

### List

Lists are used to store multiple items in a single variable.

Lists are one of 4 built-in data types in Python used to store collections of data, the other 3 are [Tuple](https://www.w3schools.com/python/python_tuples.asp), [Set](https://www.w3schools.com/python/python_sets.asp), and [Dictionary](https://www.w3schools.com/python/python_dictionaries.asp), all with different qualities and usage.

A list can contain different data types

* **add**
  * To add an item to the end of the list, use the append() method
  * To insert a list item at a specified index, use the `insert()` method.
  * To append elements from *another list* ( or any iterable object ) to the current list, use the `extend()` method.

* **remove**
  * The `remove()` method removes the specified **item**.
  * The `pop()` method removes the specified index. If you do not specify the index, the `pop()` method removes the last item.
  * The `del` keyword also removes the specified index and can also delete the list completely.
  * The `clear()` method empties the list. The list still remains, but it has no content.

```python
thislist.remove("banana")
thislist.pop(1)
del thislist[0]
del thislist
thislist.clear()
```

#### List Comprehension

List comprehension offers a shorter syntax when you want to **create** a new list **based on** the values of an **existing list**.

```python
newlist = [expression for item in iterable if condition == True]
```

### Tuple

A tuple is a collection which is ordered and **unchangeable**.

Since tuples are indexed, they can have items with the same value

```pyhton
thistuple = ("apple",)
<class 'tuple'>

#NOT a tuple
thistuple = ("apple")
<class 'str'>
```

You can convert the tuple into a list, change the list, and convert the list back into a tuple.

#### Unpack

we are allowed to extract the values back into variables. This is called "unpacking":

```python
fruits = ("apple", "banana", "cherry")

(green, yellow, red) = fruits
```

##### Asterisk`*`

If the number of variables is less than the number of values, you can add an `*` to the variable name and the values will be assigned to the variable as a list:

```python
fruits = ("apple", "banana", "cherry", "strawberry", "raspberry")

(green, yellow, *red) = fruits

(green, *tropic, red) = fruits
```

If the asterisk is added to another variable name than the last, Python will assign values to the variable until the number of values left matches the number of variables left.

### Set

A set is a collection which is *unordered*, *unchangeable**, and *unindexed*.

> **Note:** Set *items* are unchangeable, but you can remove items and add new items.

* **add**

  * To add one item to a set use the `add()` method.

  * To add items from another set into the current set, use the `update()` method.

* **remove**
  * `remove()`: if the item to remove does not exist, `remove()` will raise an error.
  * `discard()` : if the item to remove does not exist, `discard()` will **NOT** raise an error.
  * `pop()` :remove  and return the *last* item,  you will not know what item that gets removed.
  * `clear()` : you will not know what item that gets removed.
  * `del` :delete the set completely

* **join**
  * `union()` :  returns a new set containing all items from both sets
  * `update()` : inserts all the items from one set into another.

#### Set Operation

The `intersection_update()` method will keep only the items that are present in both sets.

The `intersection()` method will return a *new* set, that only contains the items that are present in both sets.

The `symmetric_difference_update()` method will keep only the elements that are NOT present in both sets.

The `symmetric_difference()` method will return a new set, that contains only the elements that are NOT present in both sets.

### Dictionary

A dictionary is a collection which is ordered*, changeable and do not allow duplicates.

> As of Python version 3.7, dictionaries are *ordered*. In Python 3.6 and earlier, dictionaries are *unordered*.

* **Access**
  * referring to its key name inside square brackets
  * `get()`
  * `keys()`: return a list of all the **keys** in the dictionary.
  * `values()` : return a list of all the **values** in the dictionary.
  * `items()` : return each item in a dictionary, as **tuples** in a list.

```python
thisdict["model"]
thisdict.get("model")
```

* **Change / Add**
  * referring to its key name
  * `update()`
* **Remove**
  * `pop()` : removes the item with the specified key name
  * `popitem()`:  removes the last inserted item (in versions before 3.7, a random item is removed instead)
  * `del` : removes the item with the specified key name or the entire dictionary
  * `clear() ` :empties the dictionary

```python
thisdict.pop("model")
thisdict.popitem()
del thisdict["model"]
del thisdict
thisdict.clear()
```

* copy: `copy()` or `dict()`

#### Looping

* for in
* `keys()`
* `values()`
* `items()`

### Arrays

Python does not have built-in support for Arrays, but [Python Lists](https://www.w3schools.com/python/python_lists.asp) can be used instead.

To work with arrays in Python you can import a library, like the [NumPy library](https://www.w3schools.com/python/numpy/default.asp).

## Function

A function is a block of code which only runs when it is called.

In Python a function is defined using the `def` keyword

### Lambda

A lambda function is a small anonymous function.

A lambda function can take any number of arguments, but can only have one expression.

> lambda *arguments* : *expression*

The power of lambda is better shown when you use them as an anonymous function **inside another function**.

## Classes

Python is an object oriented programming language.

Almost everything in Python is an object, with its properties and methods.

A Class is like an object constructor, or a "blueprint" for creating objects.

To create a class, use the keyword `class` 

### ___init__()_ Function

All classes have a function called __init__(), which is always executed when the class is being initiated. Use the __init__() function to assign values to object properties, or other operations that are necessary to do when the object is being created

```python
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age

p1 = Person("John", 36)

print(p1.name)
print(p1.age)
```

> Note: 
>
> The `self` parameter is a reference to the current instance of the class, and is used to access variables that belong to the class. 
>
> It does not have to be named `self` , you can call it whatever you like, but it has to be the first parameter of any function in the class

### `del`

You can delete properties on objects or objects by using the `del` keyword

```python
del p1.age
del p1
```

### Inheritance

```python
class childClass(parentClass):
    def __init__(self,...):
        parentClass.__init__(self,...)
        super().__init__(self,...)
```

where `super()` represent parentClass

## Iterators

An iterator is an object that contains a countable number of values.

An iterator is an object that can be iterated upon, meaning that you can traverse through all the values.

Technically, in Python, an iterator is an object which implements the **iterator protocol**, which consist of the methods `__iter__()` and `__next__()`.

### Iterator vs Iterable

Lists, tuples, dictionaries, and sets are all iterable objects. They are iterable *containers* which you can get an iterator from.

All these objects have a `iter()` method which is used to get an iterator

```python
mytuple = ("apple", "banana", "cherry")
myit = iter(mytuple)

print(next(myit))
print(next(myit))
print(next(myit))
```

The `for` loop actually creates an iterator object and executes the next() method for each loop.

To create an object/class as an iterator you have to implement the methods `__iter__()` and `__next__()` to your object.

To prevent the iteration to go on forever, we can use the `StopIteration` statement.

In the `__next__()` method, we can add a terminating condition to raise an error if the iteration is done a specified number of times

```python
class MyNumbers:
  def __iter__(self):
    self.a = 1
    return self

  def __next__(self):
    if self.a <= 20:
      x = self.a
      self.a += 1
      return x
    else:
      raise StopIteration
```

## Exception

The `try` block lets you test a block of code for errors.

The `except` block lets you handle the error.

The `else` block lets you execute code when there is no error.

The `finally` block lets you execute code, regardless of the result of the try- and except blocks.

To throw (or raise) an exception, use the `raise` keyword.

```python
try:
    
    raise SomeException
except:
    
else:
    
finally:
    
```

## User Input

Python allows for user input.

That means we are able to ask the user for input.

The method is a bit different in Python 3.6 than Python 2.7.

Python 3.6 uses the `input()` method.

Python 2.7 uses the `raw_input()` method.

## String Formatting by `format()`

The `format()` method allows you to format selected parts of a string.

To control such values, add placeholders (curly brackets `{}`) in the text, and run the values through the `format()` method

```python
print("The price is {} dollars".format(price))
```

### Index Numbers

You can use index numbers (a number inside the curly brackets `{0}`) to be sure the values are placed in the correct placeholders

```python
"I want {0} pieces of item number {1} for {2:.2f} dollars.".format(quantity, itemno, price)
```

if you want to refer to the same value more than once, use the index number.

```python
"His name is {1}. {1} is {0} years old.".format(age, name)
```

### Named Indexes

You can also use named indexes by entering a name inside the curly brackets `{carname}`, but then you must use names when you pass the parameter values `txt.format(carname = "Ford")`

```python
"I have a {carname}, it is a {model}.".format(carname = "Ford", model = "Mustang")
```

## File

### Open

The key function for working with files in Python is the `open()` function.

The `open()` function takes two parameters; *filename*, and *mode*.

There are four different methods (modes) for opening a file:

`"r"` - Read - Default value. Opens a file for reading, error if the file does not exist

`"a"` - Append - Opens a file for appending, creates the file if it does not exist

`"w"` - Write - Opens a file for writing, creates the file if it does not exist

`"x"` - Create - Creates the specified file, returns an error if the file exists

In addition you can specify if the file should be handled as binary or text mode

`"t"` - Text - Default value. Text mode

`"b"` - Binary - Binary mode (e.g. images)

### Read

The `open()` function returns a file object, which has a `read()` method for reading the content of the file.

By default the `read()` method returns the whole text, but you can also specify how many characters you want to return.

You can return one line by using the `readline()` method.

```python
f = open("demofile.txt", "r")
print(f.read())
print(f.read(5))
print(f.readline())
```

It is a good practice to always close the file when you are done with it.

```python
f.close()
```

### Write/Create

To write to an existing file, you must add a parameter to the `open()` function:

`"a"` - Append - will append to the end of the file

`"w"` - Write - will overwrite any existing content

To create a new file in Python, use the `open()` method, with one of the following parameters:

`"x"` - Create - will create a file, returns an error if the file exist

`"a"` - Append - will create a file if the specified file does not exist

`"w"` - Write - will create a file if the specified file does not exist

```python
f = open("demofile3.txt", "w")
f.write("Woops! I have deleted the content!")
```

### Delete

To delete a file, you must import the OS module, and run its `os.remove()` function.

```python
import os
if os.path.exists("demofile.txt"):
  os.remove("demofile.txt")
else:
  print("The file does not exist")
```

To delete an entire folder, use the `os.rmdir()` method:

```pyt
import os
os.rmdir("myfolder")
```

> **Note:** You can only remove *empty* folders.

## Module

Consider a module to be the same as a code library.

A file containing a set of functions you want to include in your application.

 we can use a module  by using the `import` statement

You can name the module file whatever you like, but it must have the file extension `.py`

You can create an alias when you import a module, by using the `as` keyword

```python
import mymodule as mx
```

> **Note:** When importing using the `from` keyword, do not use the module name when referring to elements in the module. Example: `person1["age"]`, **not** `mymodule.person1["age"]`

### `dir()`

The `dir()` function is a built-in function to list all the function names (or variable names) in a module.

> **Note:** The dir() function can be used on *all* modules, also the ones you create yourself.
