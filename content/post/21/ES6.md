---
title: 【JS】ES6
date: 2021-04-19 00:00:00+0000
categories: 
- nutrition
- temple
tags:
- JS
---

## Parameter

### Default Parameter

```js
function say(message='Hi') {
    console.log(message);
}

say(); // 'Hi'
say('Hello') // 'Hello'
```

If you want to use the default values for the parameters, pass `undefined` values to the parameters.

The parameter can take a default value which is a result of a function. You can assign a parameter a default value that references to other default parameters as shown in the following example:

```js
function add(x = 1, y = x, z = x + y) {
    return x + y + z;
}

console.log(add());
```

The value of **the `arguments` object** inside the function is the number of actual arguments that you pass to the function. For example:

```js
function add(x, y = 1, z = 2) {
    console.log( arguments.length );
    return x + y + z;
}

add(10); // 1
add(10, 20); // 2
add(10, 20, 30); // 3
```

### Rest Parameter

ES6 provides a new kind of parameter so-called rest parameter that has a prefix of three dots `(...)`. A rest parameter allows you to **represent an indefinite number of arguments as an array**. See the following syntax:

```js
function fn(a,b,...args) {
   //...
}
```

Notice that the rest parameters must appear **at the end of the argument list**. 

See the following example:

```js
function sum(...args) {
    let total = 0;
    for (const a of args) {
        total += a;
    }
    return total;
}

sum(1, 2, 3);
```

## Spread Operator

ES6 provides a new operator called spread operator that consists of three dots `(...).` The spread operator allows you to spread out elements of an **iterable object** such as an [array](https://www.javascripttutorial.net/javascript-array/),a [map](https://www.javascripttutorial.net/es6/javascript-map/), or a [set](https://www.javascripttutorial.net/es6/javascript-set/). For example:

```js
const odd = [1,3,5];
const combined = [2,4,6, ...odd];
```

Output:

```
[ 2, 4, 6, 1, 3, 5 ]
```

So the three dots ( `...`) represent both the spread operator and the rest parameter.

Here are the main differences:

- The spread operator **unpacks** elements.
- The rest parameter **packs** elements into an array.

The rest parameters must be the last arguments of a function. However, the spread operator can be anywhere:

```JS
var rivers = ['Nile', 'Ganges', 'Yangte'];
var moreRivers = ['Danube', 'Amazon'];

//ES5
Array.prototype.push.apply(rivers, moreRivers);
console.log(rivers);

//ES6
rivers.push(...moreRivers);
```

Note that ES2018 expands the spread operator to objects. It is known as the [object spread](https://www.javascripttutorial.net/es-next/javascript-object-spread/).

```js
const circle = {
    radius: 10
};

const coloredCircle = {
    ...circle,
    color: 'black'
};
```

## Object literal

ES6 allows you to **eliminate the duplication** when a property of an object is the same as the local variable name by including the name without a colon and value.

```JS
function createMachine(name, status) {
    return {
        name,
        status
    };
}
```

You could use the square brackets( `[]`)  to enable the **computed property names** for the properties on objects.

The square brackets allow you to use the string literals and **variables** as the property names.

When a property name is placed inside the square brackets, the JavaScript engine **evaluates it as a string**. It means that you can use an expression as a property name.

```JS
let prefix = 'machine';
let machine = {
    [prefix + ' name']: 'server',
    [prefix + ' hours']: 10000
};

console.log(machine['machine name']); // server
console.log(machine['machine hours']); // 10000
```

### Concise Method Syntax

```JS
//ES5
let server = {
	name: "Server",
	restart: function () {
		console.log("The" + this.name + " is restarting...");
	}
};
//ES6
let server = {
    name: 'Server',
    restart() {
        console.log("The" + this.name + " is restarting...");
    }
};
```

This shorthand syntax is also known as the **concise method syntax**. It’s valid to have spaces in the property name.

```JS
let server = {
    name: 'Server',
    restart() {
        console.log("The " + this.name + " is restarting...");
    },
    'starting up'() {
        console.log("The " +  this.name + " is starting up!");
    }
};

server['starting up']();Code language: JavaScript (javascript)
```

In this example, the method `'starting up'` has spaces in its name. To call the method, you use the following syntax:

```JS
object_name['property name']();
```

## New Way to Loop

ES6 introduced a new statement `for...of` that iterates over an iterable object such as:

- Built-in [Array](https://www.javascripttutorial.net/javascript-array/), [String](https://www.javascripttutorial.net/javascript-string/), [Map](https://www.javascripttutorial.net/es6/javascript-map/), [Set](https://www.javascripttutorial.net/es6/javascript-set/), …
- Array-like objects such as `arguments` or `NodeList`
- User-defined objects that implement the [iterator protocol](https://www.javascripttutorial.net/es6/javascript-iterator/).

The following illustrates the syntax of the `for...of`:

You can use `var`, `let`, or `const` to declare the `variable`.

```JS
for (variable of iterable) {
   // statements 
}

// Array destructing 
let colors = ['Red', 'Green', 'Blue'];

for (const [index, color] of colors.entries()) {
    console.log(`${color} is at index ${index}`);
}

// object destructing 
const ratings = [
    {user: 'John',score: 3},
    {user: 'Jane',score: 4},
    {user: 'David',score: 5},
    {user: 'Peter',score: 2},
];

let sum = 0;
for (const {score} of ratings) {
    sum += score;
}
```

## Destructure

### Array Destructuring

```js
let [x, y ,...args] = someFuncReturnArray()
[a, b] = [b, a];
```

If the value taken from the array is `undefined`, you can assign the variable a default value, like this:

```js
let a, b;
[a = 1, b = 2] = [10];
//a=10,b=2;
```

### Object Destructuring

ES6 introduces the object destructuring syntax that provides an alternative way to **assign properties of an object to variables**:

```
let { firstName: fname, lastName: lname } = person
```

In this example, the `firstName` and `lastName` properties are assigned to the `fName` and `lName` variables respectively.

The identifier before the colon (`:`) is the property of the object and the identifier **after** the colon is the **variable**.

If the variables have **the same names** as the properties of the object, you can make the code more concise as follows:

```js
let { firstName, lastName } = person;
```

It’s possible to separate the declaration and assignment. However, you must surround the variables in **parentheses**:

```js
({firstName, lastName} = person);
```

If you don’t use the parentheses, the JavaScript engine will interpret the left-hand side as a block and throw a syntax error.

When you assign a property that does not exist to a variable using the object destructuring, the variable is set to **`undefined`**.

```js
let { firstName, lastName, middleName = '', currentAge: age = 18 } = person;
```

To avoid typeError caused by null returned, you can use `||`  to fallback the `null` object to an empty object:

```
let { firstName, lastName } = getPerson() || {};
```

## Module

An ES6 module is a JavaScript file that **executes in strict mode only**. It means that any [variables](https://www.javascripttutorial.net/es6/javascript-let/) or [functions](https://www.javascripttutorial.net/javascript-function/) declared in the module won’t be added automatically to the global scope.

First, create a new file called `message.js` and add the following code:

```
export let message = 'ES6 Modules';
```

The `message.js` is a module in ES6 that contains the `message` variable. The `export` statement **exposes** the `message` variable to other modules.

Second, create another new file named `app.js` that uses the `message.js` module. The `app.js` module creates a new heading 1 (h1) element and attaches it to an HTML page. The `import` statement imports the `message` variable from the `message.js` module.

```jsx
import { message } from './message.js'

const h1 = document.createElement('h1');
h1.textContent = message
document.body.appendChild(h1)
```

Third, create a new HTML page that uses the `app.js` module:

```jsx
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ES6 Modules</title>
</head>
<body>
<script type="module" src="./app.js"></script>
</body>
</html>
```

Note that we used the `type="module"` in the script tag to load the `app.js` module. 

To export a [variable](https://www.javascripttutorial.net/javascript-variables/), a [function](https://www.javascripttutorial.net/javascript-function/), or a [class](https://www.javascripttutorial.net/es6/javascript-class/), you place the `export` keyword in front of it.

Note that the `export` keyword requires the function or class to **have a name** to be exported.  You **can’t export an anonymous function or class** using this syntax.

Once you define a module with exports, you can access the exported variables, functions, and classes in another module by using the `import` keyword.

In this syntax:

- First, specify what to import inside the **curly braces**, which are called bindings.
- Then, specify the module from which you import the given bindings.

Note that when you import a binding from a module, the binding behaves like it was defined using [const](https://www.javascripttutorial.net/es6/javascript-const/). It means you can’t have another identifier with the same name or change the value of the binding.

Behind the scenes, when you called the `setMessage()` function. JavaScript went back to the `greeting.js` module and executed code in there and changed the `message` variable. The change was then automatically reflected on the imported `message` binding.

To import everything from a module **as a single object**, you use the **asterisk (*) pattern** 

all the bindings become properties of the object, so you can access them.

JavaScript must *statically* determine what will be exported and imported.

JavaScript allows you to create **aliases** for variables, functions, or classes when you export and import.

```js
export { add as sum };
import {sum as total} from './math.js';


import { sum } from './math.js';
export { sum };
```

It’s possible to export bindings that you have imported. This is called **re-exporting**.

A module can have **one and only one default export**. The default export is easier to import. The default for a module can be a variable, a function, or a class.

```js
// sort.js
export default function(arr) {
  // sorting here
} 

import sort from sort.js;
```

Note that you don’t need to specify the name for the function because the module represents the function name.

Notice that we **didn’t use the curly brace `{}`** surrounding the  `sort` identifier.

To import both default and non-default bindings, you use the specify a list of bindings after the `import` keyword with the following rules:

- The default binding must **come first**.
- The non-default binding must be surrounded by curly braces.

## Arrow Function

- Use the `(...args) => expression;` to define an arrow function.
- Use the `(...args) => { statements }` to define an arrow function that has **multiple statements**.
- An arrow function **doesn’t** have its binding to `this` or `super`.
- An arrow function **doesn’t** have `arguments` object, `new.target` keyword, and `prototype` property.

the arrow function doesn’t have its own `this` value. It uses the `this` value of the **enclosing lexical scope**. 

Arrow functions don’t have the `arguments` object. Therefore, if you have a function that use `arguments` object, you cannot use the arrow function.

## Symbol

To create a new symbol, you use the global `Symbol()` function as shown in this example:

```js
let s = Symbol('foo');
```

The `Symbol()` function creates a **new *unique* value** each time you call it

The `Symbol()` function accepts a `description` as an optional argument. The `description` argument will make your symbol more **descriptive**.

You can access the symbol’s description property using the `toString()` method. The `console.log()` method calls the `toString()` method of the symbol implicitly

Since a symbol is a **primitive value**, if you attempt to create a symbol using the `new` operator, you will get an error

ES6 provides you with the global symbol registry that allows you to share symbols globally. If you want to create a symbol that will be shared, you use the `Symbol.for()` method **instead of** calling the `Symbol()` function.

* To get the key associated with a symbol, you use the `Symbol.keyFor()` method

- To get all the enumerable properties of an object, you use the `Object.keys()` method.

- To get all properties of an object whether the properties are enumerable or not, you use the `Object.getOwnPropertyNames()` method.

- To get all property symbols of an object, you use the `Object.getOwnPropertySymbols()` method, which has been added in ES6.


```js
console.log(Object.keys(task)); // ["description"]
console.log(Object.getOwnPropertyNames(task)); // ["description"]
console.log(Object.getOwnPropertySymbols(task)); //[Symbol(status)]
```

ES6 provides predefined symbols which are called well-known symbols. The well-known symbols represent the common behaviors in JavaScript. Each well-known symbol is a static property of the `Symbol` object.

## Iterator and Generator

There are two iteration protocols: **iterable protocol** and **iterator protocol**.

* **Iterator protocol**

  An object is an iterator when it implements an interface (or API) that answers two questions:

  * Is there any element left?
  * If there is, what is the element?

  Technically speaking, an object is qualified as an iterator when it has a `next()` method that returns an object with two properties:

  * `done`: a boolean value indicating whether or not there are any more elements that could be iterated upon.
  * `value`: the current element.

* **Iterable protocol**

  An object is iterable when it contains a method called `[Symbol.iterator]` that takes no argument and returns an object which conforms to the iterator protocol.

  The `[Symbol.iterator]` is one of the built-in well-known [symbols](https://www.javascripttutorial.net/es6/symbol/) in ES6.

Since ES6 provides built-in iterators for the **collection types** `Array`, `Set`, and `Map`, you don’t have to create iterators for these objects.

If you have a custom type and want to make it iterable so that you can use the `for...of` loop construct, you need to implement the iteration protocols.

> The following code creates a `Sequence` object that returns a list of numbers in the range of ( `start`, `end`) with an `interval` between subsequent numbers.

```js
class Sequence {
    constructor( start = 0, end = Infinity, interval = 1 ) {
        this.start = start;
        this.end = end;
        this.interval = interval;
    }
    [Symbol.iterator]() {
        let counter = 0;
        let nextIndex = this.start;
        return  {
            next: () => {
                if ( nextIndex <= this.end ) {
                    let result = { value: nextIndex,  done: false }
                    nextIndex += this.interval;
                    counter++;
                    return result;
                }
                return { value: counter, done: true };
            },
            return: () => {
                console.log('cleaning up...');
                return { value: undefined, done: true };
            }
        }
    }
}
```

The following code uses the `Sequence` iterator in a `for...of` loop:

```js
let evenNumbers = new Sequence(2, 10, 2);

for (const num of evenNumbers) {
    console.log(num);
}
```

In addition to the `next()` method, the `[Symbol.iterator]()` may optionally return a method called `return()`.

The `return()` method **is invoked automatically when the iteration is stopped prematurely**. It is where you can place the code to **clean up** the resources.

### Generator

ES6 introduces **a new kind of function** that is different from a regular function: function generator or generator.

A generator can **pause midway** and then **continues** from where it paused. 

```js
function* generate() {
    console.log('invoked 1st time');
    yield 1;
    console.log('invoked 2nd time');
    yield 2;
}
```

Let’s examine the `generate()` function in detail.

- First, you see the asterisk (`*`) after the `function` keyword. The asterisk **denotes** that the `generate()` is a **generator**, not a normal function.
- Second, the `yield` statement **returns a value and pauses the execution of the function**.

A generator returns a `Generator` object without executing its body when it is invoked.

The `Generator` object returns another object with two properties: `done` and `value`. In other words, a `Generator` object is **iterable**.

Since a generator is iterable, you can use the `for...of` loop:

```js
for (const g of gen) {
    console.log(g);
}
```

Here is the output:

```js
invoked 1st time
1
invoked 2nd time
2
```

And here is the new Sequence iterator that **uses a generator**:

```js
class Sequence {
    constructor( start = 0, end = Infinity, interval = 1 ) {
        this.start = start;
        this.end = end;
        this.interval = interval;
    }
    * [Symbol.iterator]() {
        for( let index = this.start; index <= this.end; index += this.interval ) {
            yield index;
        }
    }
}
```

The following shows the syntax of the `yield` keyword:

```js
[variable_name] = yield [expression];
```

In this syntax:

- The `expression` specifies the value to return from a generator function via the iteration protocol. If you omit the `expression`, the `yield` returns `undefined`.
- The `variable_name` stores the optional value passed to the `next()` method of the iterator object.

## Map and Set

### Map

Prior to ES6, when you need to map keys to values, you often use an [object](https://www.javascripttutorial.net/javascript-objects/), because an object allows you to map a key to a value of any type.

However, using an object as a map has some side effects:

- An object always has a default key like the [prototype](https://www.javascripttutorial.net/javascript-prototype/).
- A key of an object must be a [string](https://www.javascripttutorial.net/javascript-string/) or a [symbol](https://www.javascripttutorial.net/es6/symbol/), you cannot use an object as a key.
- An object does not have a property that represents the size of the map.

ES6 provides a new collection type called `Map` that addresses these deficiencies.

By definition, a `Map` object holds **key-value pairs** where values of any type can be used as either keys or values. In addition, a `Map` object remembers the original insertion order of the keys.

```js
let map = new Map([iterable]);
```

The `Map()` accepts an optional [iterable](https://www.javascripttutorial.net/es6/javascript-iterator/) object whose elements are key-value pairs.

#### Useful Methods

- `clear()` – removes all elements from the map object.
- `delete(key)` – removes an element specified by the key. It returns if the element is in the map, or false if it does not.
- `entries()` – returns a new Iterator object that contains **an array of `[key, value]`** for each element in the map object. The order of objects in the map is the same as the insertion order.
- `forEach(callback[, thisArg])` – invokes a callback for each key-value pair in the map in the insertion order. The optional thisArg parameter sets the this value for each callback.
- `get(key)` – returns the value associated with the key. If the key does not exist, it returns undefined.
- `has(key)` – returns true if a value associated with the key exists, otherwise, return false.
- `keys()` – returns a new Iterator that contains the **keys** for elements in insertion order.
- `set(key, value)` – sets the value for the key in the map object. It returns the map object itself therefore you can chain this method with other methods.
- `values()` returns a new iterator object that contains **values** for each element in insertion order.

#### WeakMap

A `WeakMap` is similar to a `Map` except the keys of a `WeakMap` **must be objects**. It means that when a reference to a key (an object) is out of scope, the corresponding value is **automatically released** from the memory.

A `WeakMap` only has subset methods of a `Map` object:

- `get(key)`
- `set(key, value)`
- `has(key)`
- `delete(key)`

Here are the main difference between a `Map` and a `WeekMap`:

- Elements of a WeakMap cannot be iterated.
- Cannot clear all elements at once.
- Cannot check the size of a WeakMap.

### Set

The `Set` constructor also accepts an optional [iterable object](https://www.javascripttutorial.net/es6/javascript-iterator/). If you pass an iterable object to the `Set` constructor, all the elements of the iterable object will be added to the new set:

```js
let setObject = new Set([iterableObject]);
```

#### Useful Methods

The `Set` object provides the following useful methods:

- `add(value)` – appends a new element with a specified value to the set. It returns the `Set` object, therefore, you can chain this method with another `Set` method.
- `clear()` – removes all elements from the `Set` object.
- `delete(value)` – deletes an element specified by the value.
- `entries()`– returns a new `Iterator` that contains **an array of `[value, value]` .**
- `forEach(callback [, thisArg])` – invokes a [callback](https://www.javascripttutorial.net/javascript-callback/) on each element of the `Set` with the `this` value sets to `thisArg` in each call.
- `has(value)` – returns `true` if an element with a given value is in the set, or `false` if it is not.
- `keys()` – is the same as `values()` function.
- `[@@iterator]` – returns a new `Iterator` object that contains values of all elements stored **in the insertion order**.

To get the number of elements that the set holds, you use the `size` property of the `Set` object

#### WeakSet

A `WeakSet` is similar to a `Set` except that it contains **only objects**. Since objects in a `WeakSet` may be automatically garbage-collected, a `WeakSet` does not have `size` property. Like a `WeakMap`, you cannot iterate elements of a `WeakSet`, therefore, you will find that WeakSet is rarely used in practice. In fact, you only use a `WeakSet` to check if a specified value is in the set.

## Proxy

A JavaScript Proxy is an **object that wraps another object** (target) and **intercepts** the fundamental operations of the target object.

The fundamental operations can be the property lookup, assignment, enumeration, and function invocations, etc.

To create a new proxy object, you use the following syntax:

```js
let proxy = new Proxy(target, handler);
```

In this syntax:

- `target` – is an object to wrap.
- `handler` – is an object that contains methods to control the behaviors of the `target`. The methods inside the `handler` object are called traps.

> A simple proxy example

```js
//First, define an object called user
const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
}
//Second, define a `handler` object:
const handler = {
    get(target, property) {
        console.log(`Property ${property} has been read.`);
        return target[property];
    }
}
//Third, create a `proxy` object:
const proxyUser = new Proxy(user, handler);
```


The following are more traps:

- `construct` – traps usage of the `new` operator
- `getPrototypeOf` – traps an internal call to `[[GetPrototypeOf]]`
- `setPrototypeOf` – traps a call to `Object.setPrototypeOf`
- `isExtensible` – traps a call to `Object.isExtensible`
- `preventExtensions` – traps a call to `Object.preventExtensions`
- `getOwnPropertyDescriptor` – traps a call to `Object.getOwnPropertyDescriptor`

## Reflection

In computer programming, reflection is the ability of a program to manipulate variables, properties, and methods of objects at **runtime**.

ES6 introduces a new global object called `Reflect` that allows you to call methods, construct objects, get and set properties, manipulate and extend properties.

The `Reflect` API is important because it allows you to develop programs and frameworks that are able to **handle dynamic code**.

Unlike the most global objects, the `Reflect` **is not a constructor**. It means that you cannot use `Reflect` with the `new` operator or invoke the `Reflect` as a function. It is similar to the `Math` and `JSON` objects. All the methods of the `Reflect` object are **static**.

- `Reflect.apply()` – call a function with specified arguments.
- `Reflect.construct()` – act like the `new` operator, but as a function. It is equivalent to calling `new target(...args)`.
- `Reflect.defineProperty()` – is similar to `Object.defineProperty()`, but return a Boolean value indicating whether or not the property was successfully defined on the object.
- `Reflect.deleteProperty()` – behave like the `delete` operator, but as a function. It’s equivalent to calling the `delete objectName[propertyName]`.
- `Reflect.get()` – return the value of a property.
- `Reflect.getOwnPropertyDescriptor()` – is similar to `Object.getOwnPropertyDescriptor()`. It returns a **property descriptor of a property** if the property **exists** on the object, or `undefined` otherwise.
- `Reflect.getPrototypeOf()` – is the same as `Object.getPrototypeOf()`.
- `Reflect.has()` – work like the `in` operator, but as a function. It returns a boolean indicating whether an property (either owned or inherited) exists.
  `Reflect.isExtensible()` – is the same as `Object.isExtensible()`.
- `Reflect.ownKeys()` – return an array of the owned property keys (not inherited) of an object.
- `Reflect.preventExtensions()` – is similar to `Object.preventExtensions()`. It returns a Boolean.
- `Reflect.set()` – assign a value to a property and return a Boolean value which is true if the property is set successfully.
- `Reflect.setPrototypeOf()` – set the prototype of an object.

## New Functions

* **`Array.of()`**

  In ES5, when you pass a number to the Array constructor, JavaScript creates an array whose length equals the number.

  However, when you pass to the `Array` constructor a value that is not a number, JavaScript creates an array that contains one element with that value. 

  ES6 introduces the `Array.of()` method to solve this problem.

  The `Array.of()` method is similar to the `Array` constructor except the `Array.of()` method does not treat a single numeric value special.

  In other words, the `Array.of()` method always creates an array that contains the values that you pass to it regardless of the types or the number of arguments.

* **`Array.from()`**

  ES6 introduces the `Array.from()` method that creates a new instance of the `Array` from an array-like or iterable object. The following illustrates the syntax of the `Array.from()` method:

  ```js
  Array.from(target [, mapFn[, thisArg]])
  ```

  In this syntax:

  * `target` is an array-like or iterable object to convert to an array.
  * `mapFn` is the **map function** to call on every element of the array
  * `thisArg` is the `this` value when executing the `mapFn` function.

  The `Array.from()` returns a new instance of `Array` that contains all elements of the `target` object.

* **`find()`**

  ES6 introduced a new method called `find()`added to the `Array.prototype` object.

  The `find()` method returns the first element in an array that satisfies a provided function.

  The following shows the syntax of the `find()` method:

  ```
  find(callback(element[, index[, array]])[, thisArg])
  ```

  The `find()` accepts two arguments: a callback function and an optional value to use for the `this` inside the `callback` function

  The `callback` is a function that executes on each element of the array. It takes three arguments:

  * `element` is the current element.
  * `index` the index of the current element.
  * `array` the array that the `find()` was called upon

  The `thisArg` is the object used as `this` inside the `callback`.

  The `find()` executes the `callback` function for each element in the array until the `callback` returns a truthy value. 

  If the callback returns a truthy value, the `find()` immediately returns the element and stop searching. Otherwise, it returns `undefined`.

* **`Object.assign()`**

  The following shows the syntax of the `Object.assign()` method:

  ```
  Object.assign(target, ...sources)
  ```

  The `Object.assign()` copies all **enumerable and own propeties** from the `source` objects to the `target` object. It **returns the `target` object**. It invokes the getters on the source objects and setters on the target. It **assigns properties only**, not copying or defining new properties. `Object.assign()` can be used to **clone or merge** objects.

  ```js
  //clone
  let widget = {
      color: 'red'
  };
  
  let clonedWidget = Object.assign({}, widget);
  
  console.log(clonedWidget);
  
  //merge
  let box = {
      height: 10,
      width: 20
  };
  
  let style = {
      color: 'Red',
      borderStyle: 'solid'
  };
  
  let styleBox = Object.assign({}, box, style);
  
  console.log(styleBox);
  
  ```

  If the source objects have the same property, the property of the **later** object **overwrites** the earlier one

* **`Object.is()`**

  The `Object.is()` behaves like the `===` operator with two differences:

  * **-0 and +0**

    The `===` operator treats `-0` and `+0` are the same value:

    However, the `Object.is()` treats +0 and -0 as different values. 

  * **NaN**

    The `===` operator considers `NaN` and `NaN` are different values. The `NaN` is the only number that does not equal itself. 

    However, `Object.is()` treats `NaN` as the same value

  The `startsWith()` returns `true` if a [string](https://www.javascripttutorial.net/javascript-string/) begins with the characters of a specified string; otherwise `false`.

* **`startsWith()`**

  The following shows the syntax of the `startsWith()` method:

    ```
  String.startsWith(searchString(pattern) [,position])
    ```

    * `searchString` is the characters to be searched for at the start of this string.
    * `position` is an optional parameter that determines the start position to search for the `searchString`. It defaults to 0.

* **`endsWith()`**
    ```js
    String.startsWith(searchString(pattern) [,position])
    ```

    The `endsWith()` returns `true` if a string ends with the characters of a specified string; otherwise `false`.Arguments

    * `searchString` is the characters to be searched for at the end of the string.
    * `length` is an optional parameter that determines the length of the string to search. It defaults to the length of the string.

* `includes()`

The `includes()` method determines whether a string contains another string:
      
  ```js 
   string.includes(searchString [,position])
  
  ```

The includes() method returns `true` if the `searchString` found in the `string`; otherwise `false`.

The optional `position` parameter specifies the position within the `string` at which to begin searching for the `searchString`. The `position` defaults to 0.

  The `includes()` matches string case-sensitively.

## Class

A JavaScript class is a **blueprint** for creating objects. A class **encapsulates data and functions** that manipulate data.

Unlike other programming languages such as Java and C#, JavaScript classes are syntactic sugar over the **prototypal inheritance** . In other words, ES6 classes are just **special functions**.

A `class` declaration is syntactic sugar over prototypal inheritance with additional **enhancements**.

ES6 introduced a new syntax for declaring a class as shown in this example:

```js
class Person {
    constructor(name) {
        this.name = name;
    }
    ...
}
```

Despite the similarities between a class and a custom type defined via a constructor function, there are some important **differences**.

* class declarations are **not hoisted** like function declarations.
* all the code inside a class **automatically executes in the strict mode**. And you cannot change this behavior.
* class methods are **non-emunerable**.If you use a constructor/prototype pattern, you have to use the `Object.defineProperty()` method to make a property non-enumerable.
* calling the class constructor without the `new` operator will result in an **error**

ES6 provides a specific syntax for defining the getter and setter using the get and set keywords. For example:

```js
class Person {
    constructor(name) {
        this.name = name;
    }
    get name() {
        return this._name;
    }
    set name(newName) {
        newName = newName.trim();
        if (newName === '') {
            throw 'The name cannot be empty';
        }
        this._name = newName;
    }
```

* **Getter**

  To call the getter, you use the following syntax:

  ```js
  let name = person.name;
  ```

  When JavaScript sees the access to `name` property of the `Person` class, it checks if the `Person` class has any **`name` property**. If not, JavaScript checks if the Person class has any **method that binds to the `name` property**. In this example, the `name()` method binds to the `name` property via the `get` keyword. Once JavaScript finds the getter method, it executes the getter method and returns a value.

* **Setter**

  The setter uses the `set` keyword followed by the method name:

  ```js
  set name(newName) {
      newName = newName.trim();
      if (newName === '') {
          throw 'The name cannot be empty';
      }
      this._name = newName;
  }
  ```

  JavaScript will call the `name()` setter when you assign a value to the `name` property like this:

  ```js
  person.name = 'Jane Smith';
  ```

  If a class has only getter but not setter and you attempt to use the setter, the change won’t take any effect.

* **Static Method**

  By definition, static methods are bound to a class, **not the instances** of that class. Therefore, static methods are useful for defining helper or utility methods.

  The following adds a static method called `createAnonymous()` to the `Person` type:

  ```js
  Person.createAnonymous = function (gender) {
      let name = gender == "male" ? "John Doe" : "Jane Doe";
      return new Person(name);
  }
  ```

  The `createAnonymous()` method is considered a static method because it doesn’t depend on any instance of the `Person` type for its property values.

  To call the `createAnonymous()` method, you use the `Person` type instead of its instances:

  ```
  var anonymous = Person.createAnonymous();
  ```

  In ES6, you define static methods using the `static` keyword.

  ```js
  class Person {
  	constructor(name) {
  		this.name = name;
  	}
  	getName() {
  		return this.name;
  	}
  	static createAnonymous(gender) {
  		let name = gender == "male" ? "John Doe" : "Jane Doe";
  		return new Person(name);
  	}
  }
  ```

  If you attempt to call the static method from an instance of the class, you’ll get an error.

  To call a static method from a class constructor or an instance method, you use the class name, followed by the `.` and the static method:

  ```
  className.staticMethodName();
  //or
  this.constructor.staticMethodName();
  ```

* **Static Property**
    Like a  static method, a static property is **shared** by all instances of a class. To define static property, you use the `static` keyword followed by the property name like this:

    ```
    class Item {
    	static count = 0;
    }
    Code language: JavaScript (javascript)
    ```

    To access a static property, you use the class name followed by the `.` operator and the static property name

    To access a static property in a class constructor or instance methods, you use the following syntax:

    ```js
    className.staticPropertyName;
    //or
    this.constructor.staticPropertyName;
    ```

* **class expression**

  A class expression **doesn’t require an identifier** after the `class` keyword. And you can use a class expression in a variable declaration and pass it into a function as an argument.

  For example, the following defines a class expression:

  ```js
  let Person = class {
      constructor(name) {
          this.name = name;
      }
      getName() {
          return this.name;
      }
  }
  ```

  Similar to function expressions, class expressions are **not hoisted**. It means that you cannot create an instance of the class before defining the class expression.

  [JavaScript classes are first-class citizens](https://www.javascripttutorial.net/javascript-functions-are-first-class-citizens/). It means that you can pass a class into a function, return it from a function, and assign it to a variable.

* **`extends` and `super`  keyword**

  Prior to ES6, implementing a proper inheritance required multiple steps. One of the most commonly used strategies is the prototypal inheritance.

  ES6 simplified these steps by using the `extends` and `super` keywords.

  First, use the `extends` keyword to make the `Bird` class inheriting from the `Animal` class:

  ```
  class Bird extends Animal {
     // ...
  }
  ```

  The `Animal` class is called a **base class** or **parent class** while the `Bird` class is known as a **derived class** or **child class**. By doing this, the `Bird` class inherits all methods and properties of the `Animal` class.

  Second, in the `Bird`‘s constructor, call `super()` to invoke the `Animal`‘s constructor with the `legs` argument.

  JavaScript **requires** the child class to call `super()` if it has a constructor. 

  Because **the `super()` initializes the `this` object**, you need to call the `super()` before accessing the `this` object. Trying to access `this` before calling `super()` also results in an error.

  ES6 allows the child class and parent class to have methods with the same name. In this case, when you call the method of an object of the child class, the method in the child class will **shadow** the method in the parent class.

  To call the method of the parent class in the child class, you use `super.method(arguments)`,

* **`new.target`**

  ES6 provides a **metaproperty** named `new.target` that allows you to detect whether a  **function** or **constructor** was called using the `new` operator.

  The `new.target` consists of the `new` keyword, a dot, and `target` property. The `new.target` is available in all functions.

  However, in [arrow functions](https://www.javascripttutorial.net/es6/javascript-arrow-function/), the `new.targe`t is the one that belongs to **the surrounding function**.

  The `new.target` is very useful to inspect at runtime whether a function is being executed **as a function or as a constructor**. It is also handy to determine a specific derived class that was called by using the `new` operator from within a parent class.

  **In a regular function call, the `new.target` returns `undefined`.** If the function was called with the `new` operator, the `new.target` returns **a reference to the function**.

  ```js
  function Person(name) {
      if (!new.target) {
          throw "must use new operator with Person";
      }
      this.name = name;
  }
  ```

## Promise

A **`Promise`** is a proxy for a value not necessarily known when the promise is created. It allows you to associate handlers with an asynchronous action's eventual success value or failure reason. This lets asynchronous methods return values like synchronous methods: instead of immediately returning the final value, the asynchronous method returns a *promise* to supply the value at some point in the **future**.

### Create

To create a promise in JavaScript, you use the `Promise` constructor:

```js
let completed = true;

let learnJS = new Promise(function (resolve, reject) {
    if (completed) {
        resolve("I have completed learning JS.");
    } else {
        reject("I haven't completed learning JS yet.");
    }
});
```

The `Promise` constructor accepts a function as an argument. This function is called the `executor`.

The `executor` function accepts two [callback functions](https://www.javascripttutorial.net/javascript-callback/) with the names `resolve()` and `reject()`.

By convention, the callback functions passed into the executor are `resolve` and `reject`. **However, you can use any names you want.**

The `new Promise(executor)` will automatically call the `executor` function. 

Inside the `executor` function, you call the `resolve()` callback if the executor in the success case and the `reject()` callback in the failed case.

### States

Suppose you promise to complete learning JavaScript by next month.

And you don’t know if you will spend your time and effort learning JavaScript until next month. You can either be completing learning JavaScript or not.

A promise has three states:

- **Pending**: you don’t know if you will complete learning JavaScript by the next month.
- **Fulfilled**: you complete learning JavaScript by the next month.
- **Rejected**: you don’t learn JavaScript at all.

A promise starts in the pending state which indicates that the promise **hasn’t** **been completed**. It ends with either fulfilled (successful) or rejected (failed) state.

Once the promise reaches either fulfilled state or rejected state, it **stays in that state and can’t switch**.

In other words, a promise cannot go from the `fulfilled` state to the `rejected` state and vice versa. Also, it cannot go back from the `fulfilled` state or `rejected` state to the `pending` state.

If the promise reaches `fulfilled` or `rejected` state, the promise is resolved. Once a new `Promise` object is created, it is in the pending state until resolved.

### Consuming a promise

* **`then()`**

  To get the value of a promise when it’s fulfilled, you call the `then()` method of the promise object. The following shows the syntax of the `then()` method:

  ```css
  promise.then(onFulfilled,onRejected);
  ```

  The `then()` method accepts two callback functions: `onFulfilled` and `onRejected`.

  The `then()` method calls the `onFulfilled()` with a value, if the promise is fulfilled or the `onRejected()` with an error if the promise is rejected.

  The `then()` method returns a new `Promise` with a value resolved to a value.

  When you return a value in the `then()` method, the `then()` method returns a new `Promise` that **immediately resolves to the return value**.

  Also, you can return **a new promise** in the `then()` method.

  > Note that both `onFulfilled` and `onRejected` arguments are **optional**. We usually use `then()` method to schedule a callback to be executed when the promise is fulfilled

* **`catch()`**

  `catch()` method schedule a callback to be invoked when the promise is rejected. If the `catch()` method to handle the error inside the promise is not provided. It will cause a runtime error and terminate the program.

* **`finally()`**

  Place the code that you want to execute in the `finally()` method whether the promise is fulfilled or rejected.

### Promise Chaining

Sometimes, you have multiple asynchronous tasks that you want to execute in sequence. In addition, you need to pass the result of the previous step to the next one. In this case, you can use the following syntax:

```js
step1()
    .then(result => step2(result))
    .then(result => step3(result))
    ...
```

If you need to pass the result from the previous task to the next one without passing the result, you use this syntax:

```css
step1()
    .then(step2)
    .then(step3)
    ...
```

Processing continues to the next link of the chain even when a `.then()` lacks a callback function that returns a Promise object. Therefore, a chain can **safely omit every *rejection* callback function** until the final `.catch()`.

### Settled Promise

An action can be assigned to an **already "settled"** promise. In that case, the action (if appropriate) will be performed **at the first asynchronous opportunity**. Note that promises are guaranteed to be asynchronous. Therefore, an action for an already "settled" promise will occur only after the stack has cleared and a clock-tick has passed. The effect is much like that of `setTimeout(action,10)`.

```js
const promiseA = new Promise( (resolutionFunc,rejectionFunc) => {
    resolutionFunc(777);
});
// At this point, "promiseA" is already settled.
promiseA.then( (val) => console.log("asynchronous logging has val:",val) );
console.log("immediate logging");

// produces output in this order:
// immediate logging
// asynchronous logging has val: 777
```

### Static methods

- [`Promise.all(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

  **Wait for all** promises to be **resolved**, or for **any** to be **rejected**.If the returned promise resolves, it is resolved with an aggregating array of the values from the resolved promises, **in the same order** as defined in the iterable of multiple promises. If it rejects, it is rejected with the reason from the first promise in the iterable that was rejected.

- [`Promise.allSettled(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

  Wait until **all promises have settled** (each may resolve or reject).Returns a Promise that resolves after all of the given promises is either fulfilled or rejected, with an array of objects that each describe the outcome of each promise.

- [`Promise.any(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

  Takes an iterable of Promise objects and, **as soon as one of the promises in the iterable fulfills**, returns a single promise that resolves with the value from that promise.

- [`Promise.race(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

  Wait until **any of the promises is fulfilled or rejected**.If the returned promise resolves, it is resolved with the value of the first promise in the iterable that resolved.If it rejects, it is rejected with the reason from the first promise that was rejected.

- [`Promise.reject(reason)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)

  Returns a new `Promise` object that **is rejected** with the given reason.

- [`Promise.resolve(value)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)

  Returns a new `Promise` object that **is resolved with the given value**. If the value is a thenable (i.e. has a `then` method), the returned promise will "follow" that thenable, adopting its eventual state; otherwise, the returned promise will be fulfilled with the value. Generally, if you don't know if a value is a promise or not, [`Promise.resolve(value)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve) it instead and work with the return value as a promise.

### `async/await`

ES2017 introduced the `async`/`await` keywords that **build on top of promises**, allowing you to write asynchronous code that looks more like synchronous code and more readable. Technically speaking, the `async` / `await` is **syntactic sugar for promises**.

If a function **returns a Promise**, you can place the `await` keyword in front of the function call. The `await` keyword to wait for a `Promise` to settle either in resolved or rejected state.

The `await` will wait for the `Promise` returned from the `f()` to settle. 

> The `await` keyword can be used only inside the `async` functions.

The following defines an `async` function that calls the three asynchronous operations in sequence:

```js
async function showServiceCost() {
    let user = await getUser(100);
    let services = await getServices(user);
    let cost = await getServiceCost(services);
    console.log(`The service cost is ${cost}`);
}

showServiceCost();
```





















