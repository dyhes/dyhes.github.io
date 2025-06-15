---
title: 【ArkTs】struct
date: 2025-01-13 00:00:00+0000
categories: 
    - temple
tags:
    - ArkTs
---

## TypeScript
在 TypeScript 中，`struct` 并不是一个内置的关键字或概念。TypeScript 主要基于 JavaScript，而 JavaScript 是一种动态类型的语言，没有像 C 或 C++ 中的 `struct` 这样的结构体类型。

不过，TypeScript 提供了几种方式来定义和操作复杂的数据结构，类似于 `struct` 的功能：

###  使用 `interface`
`interface` 是 TypeScript 中定义对象形状的主要方式。你可以使用 `interface` 来定义一个结构化的数据类型。

```typescript
interface Person {
    name: string;
    age: number;
    isStudent: boolean;
}

const person: Person = {
    name: "Alice",
    age: 25,
    isStudent: false
};
```

###  使用 `type`
`type` 是另一种定义复杂数据类型的方式，功能与 `interface` 类似。

```typescript
type Person = {
    name: string;
    age: number;
    isStudent: boolean;
};

const person: Person = {
    name: "Bob",
    age: 30,
    isStudent: true
};
```

###  使用 `class`
如果你需要更复杂的行为（如方法），可以使用 `class` 来定义一个结构。

```typescript
class Person {
    name: string;
    age: number;
    isStudent: boolean;

    constructor(name: string, age: number, isStudent: boolean) {
        this.name = name;
        this.age = age;
        this.isStudent = isStudent;
    }

    greet() {
        console.log(`Hello, my name is ${this.name}`);
    }
}

const person = new Person("Charlie", 28, false);
person.greet();
```

###  使用 `type` 和 `interface` 的组合
你可以将 `type` 和 `interface` 结合使用，以创建更复杂的数据结构。

```typescript
interface Address {
    street: string;
    city: string;
    zipCode: string;
}

type Person = {
    name: string;
    age: number;
    address: Address;
};

const person: Person = {
    name: "David",
    age: 35,
    address: {
        street: "123 Main St",
        city: "Anytown",
        zipCode: "12345"
    }
};
```

###  使用 `readonly` 和 `optional` 属性
你还可以使用 `readonly` 和 `?` 来定义只读和可选属性。

```typescript
interface Person {
    readonly id: number;
    name: string;
    age?: number; // 可选属性
}

const person: Person = {
    id: 1,
    name: "Eve"
};
```

### 总结
虽然 TypeScript 没有直接的 `struct` 概念，但通过 `interface`、`type` 和 `class`，你可以轻松定义和使用复杂的数据结构。这些工具提供了比传统 `struct` 更强大和灵活的功能。

在 ArkTS（ArkUI TypeScript）中，`struct` 是一种用于定义自定义组件的核心数据结构。它类似于 TypeScript 中的 `class` 或 `interface`，但具有特定的用途和限制，主要用于声明式 UI 开发。以下是关于 ArkTS 中 `struct` 的详细说明：

---

##  **`struct` 的基本概念**
- **定义方式**：`struct` 是 ArkTS 中用于定义自定义组件的基础结构，通常与装饰器（如 `@Component` 和 `@Entry`）结合使用。
  ```typescript
  @Component
  struct MyComponent {
      // 成员变量和方法
      build() {
          // UI 描述
      }
  }
  ```
- **作用**：`struct` 用于封装组件的状态、属性和 UI 描述，使其成为一个可复用的独立单元。

- **与 `class` 和 `interface` 的区别**：
  - `struct` 主要用于定义数据模型和 UI 组件，通常与 UI 绑定紧密相关。
  - `struct` 不支持继承，也不能扩展或实现其他类或接口。
  - `struct` 通常设计为可序列化，便于在应用程序中传递数据。

---

##  **`struct` 的核心特性**
### （1）**`@Component` 装饰器**
- `@Component` 是 ArkTS 中用于修饰 `struct` 的装饰器，使其具备组件化的能力。
- 被 `@Component` 装饰的 `struct` 必须实现 `build()` 方法，用于定义组件的 UI 描述。
  ```typescript
  @Component
  struct MyComponent {
      build() {
          Column() {
              Text('Hello, ArkTS!')
          }
      }
  }
  ```

### （2）**`@Entry` 装饰器**
- `@Entry` 用于标记页面的入口组件，每个页面只能有一个 `@Entry` 装饰的组件。
  ```typescript
  @Entry
  @Component
  struct MainPage {
      build() {
          Column() {
              Text('This is the main page')
          }
      }
  }
  ```

### （3）**`build()` 方法**
- `build()` 方法是自定义组件的核心，用于声明组件的 UI 结构。
- 必须遵循以下规则：
  - 根节点唯一且必要，通常为容器组件（如 `Column`、`Row`）。
  - 不允许声明本地变量或创建本地作用域。
  - 不允许直接调用未使用 `@Builder` 装饰的方法。

---

##  **`struct` 的成员变量与函数**
### （1）**成员变量**
- 成员变量用于存储组件的状态和数据，通常使用装饰器（如 `@State`、`@Prop`、`@Link`）进行修饰。
- 成员变量是私有的，不支持静态变量。
  ```typescript
  @Component
  struct MyComponent {
      @State message: string = 'Hello, ArkTS!';
      build() {
          Column() {
              Text(this.message)
          }
      }
  }
  ```

### （2）**成员函数**
- 成员函数用于定义组件的逻辑，通常用于事件处理或数据操作。
- 成员函数是私有的，不支持静态函数。
  ```typescript
  @Component
  struct MyComponent {
      @State count: number = 0;
  
      private increaseCount() {
          this.count += 1;
      }
  
      build() {
          Column() {
              Text(`Count: ${this.count}`)
              Button('Increase').onClick(() => this.increaseCount())
          }
      }
  }
  ```

---

##  **`struct` 的使用场景**
### （1）**自定义组件**
- `struct` 是 ArkTS 中定义自定义组件的基础，开发者可以通过组合系统组件（如 `Text`、`Button`）和自定义逻辑来创建复杂的 UI 组件。

### （2）**状态管理**
- 通过装饰器（如 `@State`、`@Prop`、`@Link`），`struct` 可以实现组件内部状态的管理，并驱动 UI 更新。

### （3）**模块化开发**
- 使用 `export` 关键字导出 `struct`，可以在其他文件中导入并复用自定义组件。
  ```typescript
  // MyComponent.ets
  @Component
  export struct MyComponent {
      build() {
          Column() {
              Text('This is a reusable component')
          }
      }
  }
  
  // MainPage.ets
  import { MyComponent } from './MyComponent';
  
  @Entry
  @Component
  struct MainPage {
      build() {
          Column() {
              MyComponent()
          }
      }
  }
  ```

---

##  **`struct` 的限制**
- **不支持继承**：`struct` 不能继承其他类或接口。
- **实例化**：`struct` 的实例化可以省略 `new` 关键字。
- **命名规则**：自定义组件名、类名、函数名不能与系统组件名相同。

---

## 总结
在 ArkTS 中，`struct` 是一种用于定义自定义组件的核心数据结构，具有以下特点：
1. 与 `@Component` 和 `@Entry` 装饰器结合使用，用于声明式 UI 开发。
2. 支持成员变量和函数，用于管理组件状态和逻辑。
3. 不支持继承，但可以通过模块化实现代码复用。
4. 主要用于构建可复用的 UI 组件，并支持状态驱动的 UI 更新。

通过合理使用 `struct`，开发者可以高效地构建复杂的用户界面，并实现灵活的状态管理。