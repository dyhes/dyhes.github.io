---
title: 【Python】Numpy
date: 2021-01-13 00:00:00+0000
categories: 
- nutrition
- temple
tags:
- AI
---

## Introduction

NumPy short for "Numerical Python" is a Python library, which is used for working with arrays.

In Python we have lists that serve the purpose of arrays, but they are slow to process.

NumPy aims to provide an array object that is **up to 50x faster** than traditional Python lists. ( NumPy arrays are stored at one continuous place in memory unlike lists, so processes can access and manipulate them very efficiently. )

The array object in NumPy is called `ndarray`, it provides a lot of supporting functions that make working with `ndarray` very easy.

## Creacte `ndarray` Object

To create an `ndarray`, we can pass a list, tuple or any array-like object into the `array()` method, and it will be converted into an `ndarray`

```python
arr = np.array([1, 2, 3, 4, 5])

arr = np.array((1, 2, 3, 4, 5))
```

A dimension in arrays is one level of array depth (nested arrays).

> NumPy has a whole sub module dedicated towards matrix operations called `numpy.mat`

NumPy Arrays provides the `ndim` attribute whicht is an integer that tells us how many dimensions the array have.

## Access

```py
arr[d1,d2,d3...]
```

## Slicing

* `[start:end]`.
* `[start:end:step]`

If we don't pass start its considered 0

If we don't pass end its considered length of array in that dimension

If we don't pass step its considered 1

> The result *includes* the start index, but *excludes* the end index.

```python
#slicing 2-D Arrays
print(arr[1, 1:4])
```

## Data Types

NumPy has some extra data types, and refer to data types with one character, like `i` for integers, `u` for unsigned integers etc.

Below is a list of all data types in NumPy and the characters used to represent them.

- `i` - integer
- `b` - boolean
- `u` - unsigned integer
- `f` - float
- `c` - complex float
- `m` - timedelta
- `M` - datetime
- `O` - object
- `S` - string
- `U` - unicode string
- `V` - fixed chunk of memory for other type ( void )

The NumPy array object has a property called `dtype` that returns the data type of the array.

```python
arr = np.array([1, 2, 3, 4])

print(arr.dtype)
## int64

arr = np.array([1, 2, 3, 4], dtype='S')
```

If a type is given in which elements can't be casted then NumPy will raise a ValueError.

```python
arr = np.array(['a', '2', '3'], dtype='i')
## ValueError
```

### Converting Data Type

The best way to change the data type of an existing array, is to make a copy of the array with the `astype()` method.

The `astype()` function creates a copy of the array, and allows you to specify the data type as a parameter.

```py
arr = np.array([1.1, 2.1, 3.1])

newarr = arr.astype('i')
```

## Copy and View

The main difference between a copy and a view of an array is that the copy is a **new array**, and the view is **just a view of the original array**.

The copy *owns* the data and any changes made to the copy will not affect original array, and any changes made to the original array will not affect the copy.

The view *does not own* the data and any changes made to the view will affect the original array, and any changes made to the original array will affect the view.

Every NumPy array has the attribute `base` that returns `None` if the array owns the data.

Otherwise, the `base` attribute refers to the original object.

```python
x = arr.copy()
y = arr.view()

print(x.base)
## none
print(y.base)
## arr
```

## Shape

The shape of an array is the number of elements in each dimension.

NumPy arrays have an attribute called `shape` that returns a **tuple** with each index having the number of corresponding elements.

### Reshape

By reshaping we can add or remove dimensions or change number of elements in each dimension.

```python
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

newarr = arr.reshape(4, 3)

newarr = arr.reshape(2, 3, 2)
```

> We can reshape an 8 elements 1D array into 4 elements in 2 rows 2D array but we cannot reshape it into a 3 elements 3 rows 2D array as that would require 3x3 = 9 elements.

the returned array is a **view**

You are allowed to have one "unknown" dimension.

Meaning that you do not have to specify an exact number for one of the dimensions in the reshape method.

Pass `-1` as the value, and NumPy will calculate this number for you.

```python
newarr = arr.reshape(2, 2, -1)
```

> **Note:** We can not pass `-1` to more than one dimension.

#### Flattening

Flattening array means converting a multidimensional array into a 1D array.

We can use `reshape(-1)` to do this.

> **Note:** There are a lot of functions for changing the shapes of arrays in numpy `flatten`, `ravel` and also for rearranging the elements `rot90`, `flip`, `fliplr`, `flipud` etc. 

## Iterating

The function `nditer()` is a helping function that can be used from very basic to very advanced iterations. It solves some basic issues which we face in iteration.

```python
for x in np.nditer(arr):
  print(x)
```

### With Different Data Types

We can use `op_dtypes` argument and pass it the expected datatype to change the datatype of elements while iterating.

NumPy does not change the data type of the element in-place (where the element is in array) so it needs some other space to perform this action, that extra space is called buffer, and in order to enable it in `nditer()` we pass `flags=['buffered']`

```python
for x in np.nditer(arr, flags=['buffered'], op_dtypes=['S']):
  print(x)
```

### With Different Step Size

```python
for x in np.nditer(arr[:, ::2]):
  print(x)
```

## Join

In SQL we join tables based on a key, whereas in NumPy we join arrays by axes.

We pass a sequence of arrays that we want to join to the `concatenate()` function, along with the axis. If axis is not explicitly passed, it is taken as 0.

```python
arr1 = np.array([1, 2, 3])

arr2 = np.array([4, 5, 6])

arr = np.concatenate((arr1, arr2))



#along the row
arr1 = np.array([[1, 2], [3, 4]])

arr2 = np.array([[5, 6], [7, 8]])

arr = np.concatenate((arr1, arr2), axis=1)
#[[1 2 5 6]
## [3 4 7 8]]

```

## Split

Splitting is reverse operation of Joining.

Joining merges multiple arrays into one and Splitting breaks one array into multiple.

We use `array_split()` for splitting arrays, we pass it the array we want to split and the number of splits.

```python
arr = np.array([1, 2, 3, 4, 5, 6])

newarr = np.array_split(arr, 3)
```

> The return value is an array containing three arrays.

If the array has less elements than required, it will adjust from the end accordingly.

> We also have the method `split()` available but it will not adjust the elements when elements are less in source array for splitting like in example above, `array_split()` worked properly but `split()` would fail.

## Search

You can search an array for a certain value, and return the indexes that get a match.

To search an array, use the `where()` method.

## Filter

Getting some elements out of an existing array and creating a new array out of them is called *filtering*.

In NumPy, you filter an array using a *boolean index list*.

```python
arr = np.array([41, 42, 43, 44])

x = [True, False, True, False]

newarr = arr[x]
```

We can directly substitute the array instead of the iterable variable in our condition and it will work just as we expect it to.

```python
arr = np.array([41, 42, 43, 44])

filter_arr = arr > 42

newarr = arr[filter_arr]
```

## Random

Random number **does NOT** mean a different number every time. Random means something that **can not be predicted logically**.

### Pseudo Random and True Random

Random numbers generated through a generation algorithm are called *pseudo random*.

In order to generate a truly random number on our computers we need to get the random data from some outside source. This outside source is generally our keystrokes, mouse movements, data on network etc.

We do not need truly random numbers, unless its related to security (e.g. encryption keys) or the basis of application is the randomness (e.g. Digital roulette wheels).

NumPy offers the `random` module to work with random numbers.

The random module's `rand()` method returns a random float between 0 and 1.

```python
from numpy import random

## Generate a random integer from 0 to 100
x = random.randint(100)
```

The `randint()` method takes a `size` parameter where you can specify the shape of an array.

```python
x=random.randint(100, size=(5,2))
```

The `rand()` method also allows you to specify the shape of the array.

The `choice()` method allows you to generate a random value based on an array of values.

The `choice()` method takes an array as a parameter and randomly returns one of the values.

### Seaborn

Seaborn is a library that uses Matplotlib underneath to plot graphs. It will be used to visualize random distributions.

## Data Distribution

Data Distribution is a list of all possible values, and how often each value occurs.

Such lists are important when working with statistics and data science.

The random module offer methods that returns randomly generated data distributions.

We can generate random numbers based on defined probabilities using the `choice()` method of the `random` module.

The `choice()` method allows us to specify the probability for each value.

```python
x = random.choice([3, 5, 7, 9], p=[0.1, 0.3, 0.6, 0.0], size=(100))
```

### Permutations

A permutation refers to an arrangement of elements. e.g. [3, 2, 1] is a permutation of [1, 2, 3] and vice-versa.

The NumPy Random module provides two methods for this: `shuffle()` and `permutation()`.

* The `shuffle()` method makes changes to the original array.
* The `permutation()` method *returns* a re-arranged array (and leaves the original array un-changed).

```python
arr = np.array([1, 2, 3, 4, 5])

random.shuffle(arr)

newarr=random.permutation(arr)
```

## Numpy ufuncs

ufuncs stands for "**Universal Functions**" and they are NumPy functions that operates on the `ndarray` object.

ufuncs are used to implement ***vectorization*** (Converting iterative statements into a vector based operation ) in NumPy which is way faster than iterating over elements.

ufuncs also take additional arguments, like:

* `where` boolean array or condition defining where the operations should take place.

* `dtype` defining the return type of elements.

* `out` output array where the return value should be copied.

### create

To create you own ufunc, you have to **define a normal function**, like you do with normal functions in Python, then you **add it to your NumPy ufunc library** with the `frompyfunc()` method.

The `frompyfunc()` method takes the following arguments:

1. `function` - the name of the function.
2. `inputs` - the number of input arguments (arrays).
3. `outputs` - the number of output arrays.

```python
def myadd(x, y):
  return x+y

myadd = np.frompyfunc(myadd, 2, 1)
```

A ufunc should return `<class 'numpy.ufunc'>`.

If it is not a ufunc, it will return another type, like this built-in NumPy function for joining two or more arrays `<class'builtin_function_or_method'>`

To test if the function is a ufunc in an if statement, use the `numpy.ufunc` value

```python
if type(np.add) == np.ufunc
```

