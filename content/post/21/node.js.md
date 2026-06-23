---
title: 【Node】Basics
date: 2021-05-16 00:00:00+0000
categories: 
- nutrition
- temple
tags:
- Node
---

## Introduction

Node.js is an open-source and cross-platform **JavaScript runtime environment.**

Node.js runs the **V8 JavaScript engine**, the core of Google Chrome, outside of the browser. 

A Node.js app runs in a **single process**, without creating a new thread for every request. Node.js provides a set of **asynchronous I/O** primitives in its standard library that prevent JavaScript code from **blocking** and generally, libraries in Node.js are written using **non-blocking paradigms**, making blocking behavior the exception rather than the norm.

When Node.js performs an I/O operation, like reading from the network, accessing a database or the filesystem, instead of blocking the thread and wasting CPU cycles waiting, Node.js will resume the operations when the response comes back.

Node.js is a **low-level** platform. In order to make things easy and exciting for developers, thousands of libraries were built upon Node.js by the community.

Many of those established over time as popular options. Here is a non-comprehensive list of the ones worth learning:

- **Express**: It provides one of the most **simple yet powerful** ways to create a web server.

- **koa**: It is built by the same team behind Express, aims to be **even simpler and smaller**,

- **Egg.js**: A framework to build **better enterprise frameworks and apps** with Node.js & Koa.

- **Gatsby**: A **React-based**, **GraphQL-powered**, **static site generator** with a very rich ecosystem of plugins and starters.

- **Next.js**: React framework that gives you the best developer experience with all the features you need for production: **hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching**, and more.

### Difference to Browsers

* You can use **Babel** to transform your code to be ES5-compatible before shipping it to the browser, but in Node.js, you won't need that.

* Another difference is that Node.js uses the **CommonJS module system**, while in the browser we are starting to see the ES Modules standard being implemented. In practice, this means that for the time being you use `require()` in Node.js and `import` in the browser.

### V8 javascript engine

V8 is the name of the JavaScript engine that powers Google Chrome. V8 was chosen to be the engine that powered Node.js back in **2009**. The Node.js ecosystem is huge and thanks to V8 which also powers desktop apps, with projects like Electron.

V8 is written in **C++**, and it's continuously improved. It is portable and runs on Mac, Windows, Linux and several other systems.

JavaScript is generally considered an interpreted language, but modern JavaScript engines no longer just interpret JavaScript, they **compile** it. This has been happening since 2009, when the **SpiderMonkey JavaScript compiler** was added to Firefox 3.5, and everyone followed this idea. JavaScript is internally compiled by V8 with **just-in-time** (JIT) **compilation** to speed up the execution.

## Run and Exit 

* **RUN**

  The usual way to run a Node.js program is to run the `node` globally available command (once you install Node.js) and pass the name of the file you want to execute.

   to restart the application automatically, `nodemon` module is used.

  Run the application using nodemon followed by application file name.

```bash
nodemon app.js
```

* **EXIT**

  * When running a program in the console you can close it with `ctrl-C`

  * The `process` core module provides`process.exit()` that allows you to programmatically exit from a Node.js program. When Node.js runs this line, the process is immediately forced to **terminate**. This means that any callback that's pending, any network request still being sent, any filesystem access, or processes writing to `stdout` or `stderr` - all is going to be **ungracefully** terminated right away.

  > Note: `process` does not require a "require", it's automatically available.

  ```js
  process.exit(1)
  ```

  By default the exit code is `0`, which means success. Different exit codes have different meaning, which you might want to use in your own system to have the program communicate to other programs.

  You can also set the `process.exitCode` property

  ```js
  process.exitCode = 1
  ```

  * Many times with Node.js we start servers, like this HTTP server:

  ```js
  const express = require('express')
  const app = express()
  
  app.get('/', (req, res) => {
    res.send('Hi!')
  })
  
  app.listen(3000, () => console.log('Server ready'))
  ```

  > Express is a framework that uses the http module under the hood, app.listen() returns an instance of http. You would use https.createServer if you needed to serve your app using HTTPS, as app.listen only uses the http module.

  This program is never going to end. If you call `process.exit()`, any currently pending or running request is going to be aborted. This is ***not nice***.

  In this case you need to send the command a SIGTERM signal, and handle that with the process signal handler:

  ```js
  const express = require('express')
  
  const app = express()
  
  app.get('/', (req, res) => {
    res.send('Hi!')
  })
  
  const server = app.listen(3000, () => console.log('Server ready'))
  
  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated')
    })
  })
  ```

  `SIGKILL` is the signal that tells a process to immediately terminate, and would ideally act like `process.exit()`.

  `SIGTERM` is the signal that tells a process to **gracefully terminate**. It is the signal that's sent from process managers like `upstart` or `supervisord` and many others.

  You can send this signal from inside the program, in another function

  ```js
  process.kill(process.pid, 'SIGTERM')
  ```

  Or from another Node.js running program, or any other app running in your system that knows the PID of the process you want to terminate.

## Environment variables

The `process` core module of Node.js provides the `env` property which hosts all the environment variables that were set at the moment the process was started.

The below code runs `app.js` and set `USER_ID` and `USER_KEY`.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

and you can access them like:

```js
process.env.USER_ID // "239482"
process.env.USER_KEY // "foobar"
```

If you have multiple environment variables in your node project, you can also create an `.env` file in the root directory of your project, and then use the **dotenv package** to load them during runtime.

```js
require('dotenv').config();
```

> You can also run your js file with `node -r dotenv/config index.js` command if you don't want to import the package in your code.

## REPL

If we run the `node` command without any script to execute or without any arguments, we start a REPL session:

```bash
node
```

> Note: REPL stands for Read Evaluate Print Loop, and it is a programming language environment (basically a console window) that takes single expression as user input and returns the result back to the console after execution. The REPL session provides a convenient way to quickly test simple JavaScript code.

* **JavaScript objects**

  Try entering the name of a JavaScript class, like `Number`, add a dot and press `tab`. The REPL will print all the properties and methods you can access on that class

* **global objects**

  You can inspect the globals you have access to by typing `global.` and pressing `tab`.

* **Special commands**

  The REPL has some special commands, all starting with a dot `.`:

  - `.help`: shows the dot **commands help**
  - `.editor`: enables **editor mode**, to write multiline JavaScript code with ease. Once you are in this mode, enter **ctrl-D to run** the code you wrote.
  - `.break`: when inputting a multi-line expression, entering the `.break` command will abort further input. Same as pressing ctrl-C.
  - `.clear`: resets the REPL context to an **empty** object and clears any multi-line expression currently being input.
  - `.load`: loads a JavaScript file, **relative** to the current working directory
  - `.save`: saves all you entered in the REPL session to a file (specify the filename)
  - `.exit`: exits the repl (same as pressing ctrl-C two times)

## Accept argument

The way you retrieve accepted arguments is using the `process` object built into Node.js.

It exposes an `argv` property, which is an **array** that contains all the command line invocation arguments.

The first element is the **full path** **of the `node` command**.

The second element is the **full path of the file** being executed.

All the additional arguments are present from the third position going forward.

You can get only the additional arguments by creating a new array that excludes the first 2 params:

```js
const args = process.argv.slice(2)
```

In this case:

```bash
node app.js name=joe
```

`args[0]` is `name=joe`, and you need to parse it. The best way to do so is by using the [`minimist`](https://www.npmjs.com/package/minimist) library, which helps dealing with arguments:

```js
const args = require('minimist')(process.argv.slice(2))
args['name'] //joe
```

## Input

Node.js since version 7 provides the [`readline` module](https://nodejs.org/api/readline.html) to perform exactly this: get input from a readable stream such as the `process.stdin` stream, which during the execution of a Node.js program is the terminal input, one line at a time.

```js
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question(`What's your name?`, name => {
  console.log(`Hi ${name}!`)
  readline.close()
})
```

## Output

Node.js provides a [`console` module](https://nodejs.org/api/console.html) which provides tons of very useful ways to interact with the command line.

It is basically the same as the `console` object you find in the browser.

* **`console.log()`**

  The most basic and most used method is `console.log()`, which prints the string you pass to it to the console.

  If you pass an object, it will render it as a string.

  You can also pass multiple variables to `console.log()`

* **`console.clear()`**

  ``console.clear()` clears the console (the behavior might depend on the console used)

* **`console.count()`**

  What happens is that `console.count()` will count the number of times a string is printed, and print the count next to it.

* **`console.countReset()`**

  The `console.countReset()` method resets counter used with `console.count()`.

* **`console.trace()`**

  There might be cases where it's useful to print the call stack trace of a function, maybe to answer the question how did you reach that part of the code

```js
const function2 = () => console.trace()
const function1 = () => function2()
function1()
```

output:

```bash
Trace
    at function2 (repl:1:33)
    at function1 (repl:1:25)
    at repl:1:1
    at ContextifyScript.Script.runInThisContext (vm.js:44:33)
    at REPLServer.defaultEval (repl.js:239:29)
    at bound (domain.js:301:14)
    at REPLServer.runBound [as eval] (domain.js:314:12)
    at REPLServer.onLine (repl.js:440:10)
    at emitOne (events.js:120:20)
    at REPLServer.emit (events.js:210:7)
```

* `console.time()` and `console.timeEnd()`

  You can easily calculate how much time a function takes to run, using `time()` and `timeEnd()`

```js
const doSomething = () => console.log('test')
const measureDoingSomething = () => {
  console.time('doSomething()')
  //do something, and measure the time it takes
  doSomething()
  console.timeEnd('doSomething()')
}
measureDoingSomething()
```

* **`console.error()`**

  As we saw `console.log` is great for printing messages in the Console. This is what's called the standard output, or `stdout`.

  `console.error` prints to the `stderr` stream. It will not appear in the console, but it will appear in the error log.

### Colorful

The simplest way to go about coloring the console output is by using a library. [Chalk](https://github.com/chalk/chalk) is such a library, and in addition to coloring it also helps with other styling facilities, like making text bold, italic or underlined.

```js
const chalk = require('chalk')
console.log(chalk.yellow('hi!'))
```

### Progress bar

[Progress](https://www.npmjs.com/package/progress) is an awesome package to create a progress bar in the console. Install it using `npm install progress`

This snippet creates a 10-step progress bar, and every 100ms one step is completed. When the bar completes we clear the interval:

```js
const ProgressBar = require('progress')

const bar = new ProgressBar(':bar', { total: 10 })
const timer = setInterval(() => {
  bar.tick()
  if (bar.complete) {
    clearInterval(timer)
  }
}, 100)
```

## Export

Node.js has a built-in module system. A Node.js file can import functionality exposed by other Node.js files.

```js
//1
const car = {
  brand: 'Ford',
  model: 'Fiesta'
}
module.exports = car
const car = require('./car')

//2
const car = {
  brand: 'Ford',
  model: 'Fiesta'
}
exports.car = car
//or
exports.car = {
  brand: 'Ford',
  model: 'Fiesta'
}


const items = require('./items')
const car = items.car

const car = require('./items').car

const { car } = require('./items')
```

The difference between `module.exports` and `exports`:

* `module.exports` : exposes **the object** it points to.
* `exports`: exposes ***the properties*** of the object it points to.

## Production

Node.js assumes it's always running in a development environment. You can signal Node.js that you are running in production by setting the `NODE_ENV=production` environment variable or:

```js
NODE_ENV=production node app.js
```

## Npm

### Install

If a project has a `package.json` file, by running

```bash
npm install
```

it will install everything the project needs, in the `node_modules` folder, creating it if it's not existing already.

You can also install a specific package by running

```bash
npm install <package-name>
```

Furthermore, since npm 5, this command adds `<package-name>` to the `package.json` file *dependencies*. **Before version 5**, you needed to add the flag `--save`.

Often you'll see more **flags** added to this command:

- `--save-dev` installs and adds the entry to the `package.json` file *devDependencies*
- `--no-save` installs but does not add the entry to the `package.json` file *dependencies*
- `--save-optional` installs and adds the entry to the `package.json` file *optionalDependencies*
- `--no-optional` will prevent optional dependencies from being installed

**Shorthands** of the flags can also be used:

- -S: --save
- -D: --save-dev
- -O: --save-optional

The difference between *devDependencies* and *dependencies* is that the former contains development tools, like a testing library, while the latter is bundled with the app in production.

As for the *optionalDependencies* the difference is that build failure of the dependency will not cause installation to fail. But it is your program's responsibility to handle the lack of the dependency.

A global installation is performed using the `-g` flag:

```bash
npm install -g lodash
```

You can install an old version of an npm package using the `@` syntax:

```bash
npm install <package>@<version>
```

You might also be interested in listing all the previous versions of a package. You can do it with `npm view <package> versions`

When you install a package using `npm install <packagename>`, the **latest available** version of the package is downloaded and put in the `node_modules` folder, and a corresponding entry is added to the `package.json` and `package-lock.json` files that are present in your current folder.

### Uninstall

```bash
npm uninstall <package-name>
```

Using the `-S` flag, or `--save`, this operation will also remove the reference in the `package.json` file.

`package.json` will be **automatically** updated with devDependency and dependency once you uninstall npm package.

If the package is installed **globally**, you need to add the `-g` / `--global` flag:

### Update

Updating is also made easy, by running

```js
npm update
```

`npm` will check all packages for a newer version that satisfies your versioning constraints.

You can specify a single package to update as well:

```console
npm update <package-name>
```

Since npm version 5.0.0, `npm update` will update the `package.json` with the updated version. Use `npm update --no-save` to **not update** `package.json`.

To discover new releases of the packages, you run `npm outdated`.

Some of those updates are major releases. Running `npm update` won't update the version of those. Major releases are never updated in this way because they (by definition) introduce breaking changes, and `npm` wants to save you trouble.

To update all packages to a new major version, install the `npm-check-updates` package globally:

then run :

```bash
ncu -u
```

### Script

The `package.json` file supports a format for specifying command line tasks that can be run by using

```json
npm run <task-name>


{
  "scripts": {
    "start-dev": "node lib/server-development",
    "start": "node lib/server-production"
  }
}
```

The `npm root -g` command will tell you where that global installation location is on your machine.

### `Package.json`

The `package.json` file is kind of a **manifest** for your project. It can do a lot of things, completely unrelated. It's a central repository of configuration for tools, for example. It's also where `npm` and `yarn` store the names and versions for all the installed packages.

There are no fixed requirements of what should be in a `package.json` file, for an application. The only requirement is that it **respects the JSON format**, otherwise it cannot be read by programs that try to access its properties programmatically.

* **main**

  Sets the **entry point** for the package. When you import this package in an application, that's where the application will search for the module exports.


* **private**

  if set to `true` prevents the app/package to be accidentally published on `npm`

* **engines**

  Sets which **versions of Node.js and other commands** this package/app work on

* **browserslist**

  Is used to tell **which browsers (and their versions)** you want to support. It's referenced by Babel, Autoprefixer, and other tools, to only add the polyfills and fallbacks needed to the browsers you target.

### `package-lock.json`

The goal of `package-lock.json` file is to keep track of the **exact version** of every package that is installed so that a product is 100% reproducible in the same way even if packages are updated by their maintainers.

You don't commit to Git your node_modules folder, which is generally huge, and when you try to replicate the project on another machine by using the `npm install` command, if you specified the `~` syntax and a patch release of a package has been released, that one is going to be installed. Same for `^` and minor releases.

The `package-lock.json` sets your currently installed version of each package **in stone**, and `npm` will use those exact versions when running `npm ci`.

The dependencies versions **will be updated** in the `package-lock.json` file when you run `npm update`.

### Semantic Version

The Semantic Versioning concept is simple: all versions have 3 digits: `x.y.z`.

- the first digit is the **major** version
- the second digit is the **minor** version
- the third digit is the **patch** version

The rules use those symbols:

- `^`: It will only do updates that **do not change the leftmost non-zero number** i.e there can be changes in minor version or patch version but not in major version. If you write `^13.1.0`, when running `npm update`, it can update to `13.2.0`, `13.3.0` even `13.3.1`, `13.3.2` and so on, but not to `14.0.0` or above.
- `~`: if you write `~0.13.0` when running `npm update` it can update to patch releases: `0.13.1` is ok, but `0.14.0` is not.
- `>`: you accept any version higher than the one you specify
- `>=`: you accept any version equal to or higher than the one you specify
- `<=`: you accept any version equal or lower to the one you specify
- `<`: you accept any version lower than the one you specify
- `=`: you accept that exact version
- `-`: you accept a **range** of versions. Example: `2.1.0 - 2.6.2`
- `||`: you combine **sets**. Example: `< 2.1 || > 2.6`

There are other rules too:

- no symbol: you accept only that specific version you specify (`1.2.1`)
- `latest`: you want to use the latest version available

### Scope

In your code you can only require **local** packages:

```js
require('package-name')
```

In general, **all packages should be installed locally**. This makes sure you can have dozens of applications in your computer, all running a different version of each package if needed. A package **should be installed globally** when it provides an executable command that you run from the **shell** (CLI), and it's reused across projects.

Great examples of popular global packages which you might know are

- `npm`
- `vue-cli`
- `grunt-cli`
- `mocha`
- `react-native-cli`
- `gatsby-cli`
- `forever`
- `nodemon`

### NPX

`npx` is a very powerful command that's been available in **npm** starting version 5.2, released in July 2017.

`npx` lets you run code built with Node.js and published through the npm registry.

Running `npx commandname` automatically finds the correct reference of the command inside the `node_modules` folder of a project, without needing to know the exact path, and without requiring the package to be installed globally and in the user's path.



## Event

On the backend side, Node.js offers us the option to build a similar system using the [`events` module](https://nodejs.org/api/events.html).

This module, in particular, offers the `EventEmitter` class, which we'll use to handle our events.

You initialize that using

```js
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()
```

This object exposes, among many others, the `on` and `emit` methods.

- `emit` is used to trigger an event
- `on` is used to add a callback function that's going to be executed when the event is triggered

```js
eventEmitter.on('start', () => {
  console.log('started')
})
```

when we run

```js
eventEmitter.emit('start')
```

the event handler function is triggered, and we get the console log.

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`)
})

eventEmitter.emit('start', 1, 100)
```

The EventEmitter object also exposes several other methods to interact with events, like

- `once()`: add a one-time listener
- `removeListener()` / `off()`: remove an event listener from an event
- `removeAllListeners()`: remove all listeners for an event

## Event Loop

The Node.js JavaScript code runs on a single thread. There is just one thing happening at a time.

This is a limitation that's actually very helpful, as it simplifies a lot how you program without worrying about concurrency issues.

You mainly need to be concerned that *your code* will run on a **single event loop**, and write code with this thing in mind to avoid blocking it.

Almost all the I/O primitives in JavaScript are non-blocking. Network requests, filesystem operations, and so on. Being blocking is the exception, and this is why JavaScript is based so much on **callbacks**, and more recently on **promises** and **async/await**.

### Call Stack

The event loop continuously checks the **call stack** to see if there's any function that needs to run.

```js
const bar = () => console.log('bar')
const baz = () => console.log('baz')
const foo = () => {
  console.log('foo')
  setTimeout(bar, 0)
  baz()
}

foo()
//output
foo
baz
bar
```



### The Message Queue

When `setTimeout()` is called, the Browser or Node.js starts the timer. Once the timer expires, in this case immediately as we put 0 as the timeout, the callback function is put in the **Message Queue**.

The Message Queue is also where user-initiated events like click or keyboard events, or fetch responses are queued before your code has the opportunity to react to them. Or also DOM events like `onload`.

**The loop gives priority to the call stack, and it first processes everything it finds in the call stack, and once there's nothing in there, it goes to pick up things in the message queue.**

We don't have to wait for functions like `setTimeout`, fetch or other things to do their own work, because they are provided by the browser, and they live on their own threads. For example, if you set the `setTimeout` timeout to 2 seconds, you don't have to wait 2 seconds - the wait **happens elsewhere**.

### ES6 Job Queue

ECMAScript 2015 introduced the concept of the **Job Queue**, which is used by B (also introduced in ES6/ES2015). It's a way to execute the result of an **async** function as soon as possible, rather than being put at the end of the call stack.

Promises that resolve before the current function ends will be executed right after the current function.

### `process.nextTick()`

As you try to understand the Node.js event loop, one important part of it is `process.nextTick()`. Every time the event loop takes **a full trip**, we call it a **tick**. When we pass a function to `process.nextTick()`, we instruct the engine to invoke this function at the end of the current operation, **before** the next event loop tick starts. Calling `setTimeout(() => {}, 0)` will execute the function **at the end of next tick**, much later than when using `nextTick()` which prioritizes the call and executes it just **before the beginning** of the next tick. Use `nextTick()` when you want to make sure that in the next event loop iteration that code is **already executed**.

### `setImmediate()`

When you want to execute some piece of code **asynchronously**, but **as soon as possible**, one option is to use the `setImmediate()` function. Any function passed as the `setImmediate()` argument is a **callback** that's executed **in the** **next iteration of the event loop**. 

The differences between  `setImmediate()` ,  `setTimeout(() => {}, 0)` , and `process.nextTick()`:

* A function passed to `process.nextTick()` is going to be executed on the current iteration of the event loop, after the current operation ends. This means it will always execute before `setTimeout` and `setImmediate`.

* A `setTimeout()` callback with a 0ms delay is very similar to `setImmediate()`. The execution order will depend on various factors, but they will be **both run in the next iteration of the event loop**. If you specify the timeout delay to `0`, the callback function will be executed as soon as possible, but after the current function execution. This is called **zero delay**.

## Asynchronicity

Computers are asynchronous by design. Asynchronous means that things can happen **independently** of the main program flow. In the current consumer computers, every program runs for a specific time slot and then it stops its execution to let another program continue their execution. This thing runs in a cycle so fast that it's impossible to notice. We think our computers run many programs simultaneously, but this is an illusion (except on multiprocessor machines). JavaScript is **synchronous** by default and is single threaded. This means that code cannot create new threads and run in parallel. Lines of code are executed in series, one after another.

### Promise

A promise is commonly defined as **a proxy for a value that will eventually become available**. Promises are one way to deal with asynchronous code, without getting stuck in **callback hell**. Promises have been part of the language for years (standardized and introduced in ES2015), and have recently become more integrated, with **async** and **await** in ES2017.

**Async functions** use promises **behind the scenes**, so understanding how promises work is fundamental to understanding how `async` and `await` work.

```js
let done = true

const isItDoneYet = new Promise((resolve, reject) => {
  if (done) {
    const workDone = 'Here is the thing I built'
    resolve(workDone)
  } else {
    const why = 'Still working on something else'
    reject(why)
  }
})
```

### Async and  Await

Async functions are a combination of promises and generators, and basically, they are a higher level abstraction over promises. Let me repeat: **async/await is built on promises**. An async function **returns a promise**. When you want to **call** this function you prepend `await`, and **the calling code will stop until the promise is resolved or rejected**. One caveat: the client function must be defined as `async`.

```js
const doSomethingAsync = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve('I did something'), 3000)
  })
}

const doSomething = async () => {
  console.log(await doSomethingAsync())
}

console.log('Before')
doSomething()
console.log('After')
```

## File and Folder 

### File Descriptor

A file descriptor is **a reference to an open file**, a **number** (fd) returned by opening the file using the `open()` method offered by the `fs` module. This number (`fd`) uniquely identifies an open file in operating system

```js
const fs = require('fs')

fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  //fd is our file descriptor
})
```

Other flags you'll commonly use are:

- `r+` open the file for **reading and writing**, if file doesn't exist it **won't be created**.
- `w+` open the file for **reading and writing**, positioning the stream at the **beginning** of the file. The file is **created** **if not existing.**
- `a` open the file for **writing**, positioning the stream at the **end** of the file. The file is **created if not existing**.
- `a+` open the file for **reading and writing**, positioning the stream at the **end** of the file. The file is created if not existing.

You can also open the file by using the `fs.openSync` method, which returns the file descriptor, instead of providing it in a callback:

```js
const fs = require('fs')

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r')
} catch (err) {
  console.error(err)
}
```

### Stats

The file information is included in the stats variable. We can obtain information about the file by:

- if the file is a **directory** or a file, using `stats.isFile()` and `stats.isDirectory()`
- if the file is a **symbolic link** using `stats.isSymbolicLink()`
- the file **size in bytes** using `stats.size`.

```js
const fs = require('fs')
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  //we have access to the file stats in `stats`
})

//sync
const fs = require('fs')
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}

```

### Path

Given a path, you can extract information out of it using those methods:

- `dirname`: get the parent folder of a file
- `basename`: get the filename part
- `extname`: get the file extension

You can get the absolute path calculation of a relative path using `path.resolve()`, `path.normalize()` is another useful function that will try and calculate the actual path, when it contains relative specifiers like `.` or `..`, or double slashes. **Neither resolve nor normalize will check if the path exists**. 

```js
const path = require('path')

const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.basename(notes) // notes.txt
path.extname(notes) // .txt

const name = 'joe'
path.join('/', 'users', name, 'notes.txt') //'/users/joe/notes.txt'


path.resolve('joe.txt') //'/Users/joe/joe.txt' if run from my home folder

path.normalize('/users/joe/..//test.txt') //'/users/test.txt'
```

### Read

The simplest way to read a file in Node.js is to use the `fs.readFile()` method, passing it the file path, encoding and a callback function that will be called with the file data (and the error).

Alternatively, you can use the synchronous version `fs.readFileSync()`.

```js
const fs = require('fs')

fs.readFile('/Users/joe/test.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})


//sync
const fs = require('fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}

```

Both `fs.readFile()` and `fs.readFileSync()` read the full content of the file in memory before returning the data.

This means that big files are going to have a major impact on your memory consumption and speed of execution of the program.

In this case, a better option is to read the file content using streams.

### Write

The easiest way to write to files in Node.js is to use the `fs.writeFile()` API.

Alternatively, you can use the synchronous version `fs.writeFileSync()`。

```js
const fs = require('fs')

const content = 'Some content!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
    return
  }
  //file written successfully
})


//sync
const fs = require('fs')

const content = 'Some content!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
  //file written successfully
} catch (err) {
  console.error(err)
}
```

By default, this API will **replace the contents of the file** if it does already exist.

You can modify the default by specifying a flag:

```js
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => {})
```

The flags you'll likely use are

- `r+` open the file for reading and writing
- `w+` open the file for reading and writing, positioning the stream at the beginning of the file. The file is created if it does not exist
- `a` open the file for writing, positioning the stream at the end of the file. The file is created if it does not exist
- `a+` open the file for reading and writing, positioning the stream at the end of the file. The file is created if it does not exist

### Append

 The easiest way to append content to files in Node.js is to use the `fs.appendFile()`  API.

```js
const content = 'Some content!'

fs.appendFile('file.log', content, err => {
  if (err) {
    console.error(err)
    return
  }
  //done!
})
```

### Folders

* Use `fs.access()` to check if the folder exists and Node.js can access it with its permissions.

* Use `fs.mkdir()` or `fs.mkdirSync()` to create a new folder.

```js
const fs = require('fs')

const folderName = '/Users/joe/test'

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
  }
} catch (err) {
  console.error(err)
}
```

* Use `fs.readdir()` or `fs.readdirSync()` to read the contents of a directory.

* Use `fs.rename()` or `fs.renameSync()` to rename folder.

* Use `fs.rmdir()` or `fs.rmdirSync()` to remove a folder.

  Removing a folder that has content can be more complicated than you need. You can pass the option `{ recursive: true }` to recursively remove the contents

  **NOTE:** *In Node* `v16.x` *the option* `recursive` *is* **deprecated** *for* `fs.rmdir` *of callback API, instead use* `fs.rm` *to delete folders that have content in them*

```js
const fs = require('fs')

fs.rm(dir, { recursive: true, force: true }, (err) => {
  if (err) {
    throw err;
  }

  console.log(`${dir} is deleted!`)
});
```

## Buffer and Stream

### Buffer

A buffer is **an area of memory**.  It represents **a fixed-size chunk** of memory (can't be resized) allocated **outside** of the V8 JavaScript engine. You can think of a buffer like an array of integers, which each represent a byte of data.

A buffer is created using the [`Buffer.from()`](https://nodejs.org/api/buffer.html#buffer_buffer_from_buffer_alloc_and_buffer_allocunsafe), [`Buffer.alloc()`](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_alloc_size_fill_encoding), and [`Buffer.allocUnsafe()`](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_allocunsafe_size) methods.

- [`Buffer.from(array)`](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_array)
- [`Buffer.from(arrayBuffer[, byteOffset[, length\]])`](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_arraybuffer_byteoffset_length)
- [`Buffer.from(buffer)`](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_buffer)
- [`Buffer.from(string[, encoding\])`](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_string_encoding)

```js
const buf = Buffer.from('Hey!')

const buf = Buffer.alloc(1024)
//or
const buf = Buffer.allocUnsafe(1024)
```

### Stream

Streams are a way to handle reading/writing files, network communications, or any kind of end-to-end information exchange in an efficient way. The Node.js [`stream` module](https://nodejs.org/api/stream.html) provides the foundation upon which all streaming APIs are built. **All streams are instances of EventEmitter**.

Streams basically provide two major advantages over using other data handling methods:

- **Memory efficiency**: you don't need to load large amounts of data in memory before you are able to process it
- **Time efficiency**: it takes way less time to start processing data, since you can start processing as soon as you have it, rather than waiting till the whole data payload is available

```js
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const stream = fs.createReadStream(__dirname + '/data.txt')
  stream.pipe(res)
})
server.listen(3000)
```

the `pipe()` method is called on the file stream. It takes the source, and pipes it into a destination.

The return value of the `pipe()` method is the destination stream, which is a very convenient thing that lets us chain multiple `pipe()` calls, like this:

```js
src.pipe(dest1).pipe(dest2)
```

Due to their advantages, many Node.js core modules provide native stream handling capabilities, most notably:

- `process.stdin` returns a stream connected to stdin
- `process.stdout` returns a stream connected to stdout
- `process.stderr` returns a stream connected to stderr
- `fs.createReadStream()` creates a readable stream to a file
- `fs.createWriteStream()` creates a writable stream to a file
- `net.connect()` initiates a stream-based connection
- `http.request()` returns an instance of the http.ClientRequest class, which is a writable stream
- `zlib.createGzip()` compress data using gzip (a compression algorithm) into a stream
- `zlib.createGunzip()` decompress a gzip stream.
- `zlib.createDeflate()` compress data using deflate (a compression algorithm) into a stream
- `zlib.createInflate()` decompress a deflate stream

### types

There are four classes of streams:

- `Readable`: a stream you can pipe from, but not pipe into (you can receive data, but not send data to it). When you push data into a readable stream, it is buffered, until a consumer starts to read the data.
- `Writable`: a stream you can pipe into, but not pipe from (you can send data, but not receive from it)
- `Duplex`: a stream you can both pipe into and pipe from, basically a combination of a Readable and Writable stream
- `Transform`: a Transform stream is similar to a Duplex, but the output is a transform of its input

We get the Readable stream from the [`stream` module](https://nodejs.org/api/stream.html), and we initialize it and implement the `readable._read()` method.

```js
const Stream = require('stream')
const readableStream = new Stream.Readable()
readableStream._read = () => {}
//or
const readableStream = new Stream.Readable({
  read() {}
})


readableStream.push('hi!')
readableStream.push('ho!')


const writableStream = new Stream.Writable()
writableStream._write = (chunk, encoding, next) => {
  console.log(chunk.toString())
  next()
}
```

You can also consume a readable stream directly, using the `readable` event:

```js
JScopy
readableStream.on('readable', () => {
  console.log(readableStream.read())
})
```

## Modules

### fs  module

- `fs.access()`: check if the file exists and Node.js can access it with its permissions
- `fs.appendFile()`: append data to a file. If the file does not exist, it's created
- `fs.chmod()`: change the permissions of a file specified by the filename passed. Related: `fs.lchmod()`, `fs.fchmod()`
- `fs.chown()`: change the owner and group of a file specified by the filename passed. Related: `fs.fchown()`, `fs.lchown()`
- `fs.close()`: close a file descriptor
- `fs.copyFile()`: copies a file
- `fs.createReadStream()`: create a readable file stream
- `fs.createWriteStream()`: create a writable file stream
- `fs.link()`: create a new hard link to a file
- `fs.mkdir()`: create a new folder
- `fs.mkdtemp()`: create a temporary directory
- `fs.open()`: set the file mode
- `fs.readdir()`: read the contents of a directory
- `fs.readFile()`: read the content of a file. Related: `fs.read()`
- `fs.readlink()`: read the value of a symbolic link
- `fs.realpath()`: resolve relative file path pointers (`.`, `..`) to the full path
- `fs.rename()`: rename a file or folder
- `fs.rmdir()`: remove a folder
- `fs.stat()`: returns the status of the file identified by the filename passed. Related: `fs.fstat()`, `fs.lstat()`
- `fs.symlink()`: create a new symbolic link to a file
- `fs.truncate()`: truncate to the specified length the file identified by the filename passed. Related: `fs.ftruncate()`
- `fs.unlink()`: remove a file or a symbolic link
- `fs.unwatchFile()`: stop watching for changes on a file
- `fs.utimes()`: change the timestamp of the file identified by the filename passed. Related: `fs.futimes()`
- `fs.watchFile()`: start watching for changes on a file. Related: `fs.watch()`
- `fs.writeFile()`: write data to a file. Related: `fs.write()`

One peculiar thing about the `fs` module is that all the methods are asynchronous by default, but they can also work synchronously by appending `Sync`.

### os module

This module provides many functions that you can use to retrieve information from the underlying operating system and the computer the program runs on, and interact with it.

```js
const os = require('os')
```

There are a few useful properties that tell us some key things related to handling files:

`os.EOL` gives the line delimiter sequence. It's `\n` on Linux and macOS, and `\r\n` on Windows.

`os.constants.signals` tells us all the constants related to handling process signals, like SIGHUP, SIGKILL and so on.

`os.constants.errno` sets the constants for error reporting, like EADDRINUSE, EOVERFLOW and more.









































































































