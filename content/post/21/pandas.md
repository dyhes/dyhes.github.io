---
title: 【Python】Pandas
date: 2021-01-13 00:00:00+0000
categories: 
- nutrition
- temple
tags:
- AI
---

## Intro

Pandas is a Python library, which is used to analyze data.

It has functions for analyzing, cleaning, exploring, and manipulating data.

The name "Pandas" has a reference to both "**Panel Data**", and "**Python Data Analysis**" and was created by Wes McKinney in 2008.

Pandas allows us to analyze big data and make conclusions based on statistical theories.

Pandas gives you answers about the data. Like:

- Is there a **correlation** between two or more columns?
- What is **average** value?
- **Max** value?
- **Min** value?

Pandas are also able to delete rows that are not relevant, or contains wrong values, like empty or NULL values. This is called ***cleaning*** the data.

## Series

A Pandas Series is like a column in a table.

It is a one-dimensional array holding data of any type.

### Labels

If nothing else is specified, the values are labeled with their index number. First value has index 0, second value has index 1 etc.

This label can be used to access a specified value.

With the `index` argument, you can name your own labels.

```python
a = [1, 7, 2]
myvar = pd.Series(a, index = ["x", "y", "z"])
```

You can also use a key/value object, like a dictionary, when creating a Series.

```python
calories = {"day1": 420, "day2": 380, "day3": 390}

myvar = pd.Series(calories)

myvar = pd.Series(calories, index = ["day1", "day2"])
## only using data from 'day1' and 'day2'
```

> **Note:** The keys of the dictionary become the labels.

## DataFrames

A Pandas DataFrame is a 2 dimensional data structure, like a 2 dimensional array, or a table with rows and columns.

Series is like a column, a DataFrame is the whole table.

```python
data = {
  "calories": [420, 380, 390],
  "duration": [50, 40, 45]
}

myvar = pd.DataFrame(data)
```

Pandas use the `loc` attribute to return one or more specified row(s)

```python
#use a list of indexes:
print(df.loc[[0, 1]])
```

> **Note:** When using `[]`, the result is a Pandas **DataFrame**.

With the `index` argument, you can name your own indexes.

```python
data = {
  "calories": [420, 380, 390],
  "duration": [50, 40, 45]
}

df = pd.DataFrame(data, index = ["day1", "day2", "day3"])
```

## Read CSV

A simple way to store big data sets is to use CSV files (comma separated files).

CSV files contains plain text and is a well know format that can be read by everyone including Pandas.

```python
df = pd.read_csv('data.csv')

print(df.to_string()) 
#use to_string() to print the entire DataFrame.
```

> If you have a large DataFrame with many rows, Pandas will only return the first 5 rows, and the last 5 rows:

## Read JSON

Big data sets are often stored, or extracted as JSON.

JSON is plain text, but has the format of an object, and is well known in the world of programming, including Pandas.

```python
df = pd.read_json('data.json')
```

If your JSON code is not in a file, but in a Python Dictionary, you can load it into a DataFrame directly.

```python
df = pd.DataFrame(data)
```

## Viewing Data

* `head()`

One of the most used method for getting a quick overview of the DataFrame, is the `head()` method.

The `head()` method returns the headers and a specified number of rows, starting from the top.

```python
print(df.head(10))
```

> **Note:** if the number of rows is not specified, the `head()` method will return the top 5 rows.

* `tail()`

There is also a `tail()` method for viewing the *last* rows of the DataFrame.

The `tail()` method returns the headers(names of columns) and a specified number of rows, starting from the bottom.

* `info()`

The DataFrames object has a method called `info()`, that gives you more information about the data set.

```css
print(df.info()) 

/*  <class 'pandas.core.frame.DataFrame'>
  RangeIndex: 169 entries, 0 to 168
  Data columns (total 4 columns):
   ##   Column    Non-Null Count  Dtype  
  ---  ------    --------------  -----  
   0   Duration  169 non-null    int64  
   1   Pulse     169 non-null    int64  
   2   Maxpulse  169 non-null    int64  
   3   Calories  164 non-null    float64
  dtypes: float64(1), int64(3)
  memory usage: 5.4 KB
  None */
```

## Cleaning Data

Data cleaning means fixing bad data in your data set.

Bad data could be:

- Empty cells
- Data in wrong format
- Wrong data
- Duplicates

### Empty Cell

1. Remove Rows
2. Replace Empty Values

Pandas uses the mean() median() and mode() methods to calculate the respective values for a specified column.



```python
#1
new_df = df.dropna()
#If you want to change the original DataFrame, use the inplace = True argument
df.dropna(inplace = True)

#2 
x = df["Calories"].mean()
x = df["Calories"].median()
x = df["Calories"].mode()[0]

df["Calories"].fillna(x, inplace = True)
```

> **Note:** By default, the `dropna()` method returns a *new* DataFrame, and will not change the original.

### Wrong Format

1. Remove Rows
2. Convert Format

```python
#1
df.dropna(subset=['Date'], inplace = True)
#2
df.dropna(subset=['Date'], inplace = True)
```

### Wrong Data

```python
for x in df.index:
  if df.loc[x, "Duration"] > 120:
    df.loc[x, "Duration"] = 120
    
#or
for x in df.index:
  if df.loc[x, "Duration"] > 120:
    df.loc[x, "Duration"] = 120
```

### Duplicates

```python
df.drop_duplicates(inplace = True)
```

## Data Correlations

A great aspect of the Pandas module is the `corr()` method.

The `corr()` method calculates the relationship between each column in your data set.

> **Note:** The `corr()` method ignores "not numeric" columns.

The Result of the `corr()` method is a table with a lot of numbers that represents how well the relationship is between two columns.