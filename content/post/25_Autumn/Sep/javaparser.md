---
title: 【Shopee】JavaParser
date: 2025-09-28 00:00:00+0000
categories: [nutrition]
tags: [Shopee]
---

## JavaParser & ANTLR

JavaParser 和 ANTLR 都是用于解析代码的强大工具，但它们的设计目标、应用方式和适用场景有显著区别。为了帮你快速把握它们的关系与核心区别，我先用一个表格来概括：

| 特性维度         | JavaParser                                                   | ANTLR                                                        |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **定位**         | **专一型**，专注于 Java 语言的解析库                         | **通用型**，支持多种语言的解析器生成器                       |
| **工作原理**     | 提供开箱即用的 **Java AST API**，直接解析 Java 代码          | 根据用户定义的语法规则文件（`.g4`），**生成**特定语言的词法分析器（Lexer）和语法分析器（Parser） |
| **主要输出**     | Java 语言的 **抽象语法树 (AST)**，节点类型针对 Java 结构（如 `CompilationUnit`, `MethodDeclaration`）高度优化 | **解析树 (Parse Tree)** 或 **CST (具体语法树)**，严格反映语法规则，包含更多细节（如每个括号、逗号） |
| **易用性**       | **上手快速**，添加依赖即可调用 API 解析 Java 代码            | **学习曲线较陡**，需要学习语法文件编写，并处理生成的代码     |
| **灵活性**       | 灵活性相对较低，主要服务于 Java 语言                         | **极高**，可用于为任何自定义语言或数据格式构建解析器         |
| **典型应用场景** | Java 代码静态分析、自动化重构、文档生成、IDE 功能增强        | 编译器/解释器开发、领域特定语言 (DSL) 设计、复杂文本格式解析、多语言工具链 |

### 🔄 协同与选择

尽管定位不同，但在技术生态中，JavaParser 和 ANTLR 并非完全割裂。

- **可能的协同**：理论上，可以利用 ANTLR 强大的 Java 语法定义（如官方 grammars-v4 项目中的 Java 语法文件）来生成基础解析器，然后在此基础上构建像 JavaParser 这样更易用的高级抽象。这就像是 ANTLR 提供了“发动机零件”，而 JavaParser 组装成了一台“即开即用的汽车”。
- **如何选择**：你的选择完全取决于项目需求。
  - 如果你的任务**专注于 Java 代码的分析和处理**，希望快速上手，那么 **JavaParser** 无疑是更直接、高效的选择。
  - 如果你需要解析 **Java 以外的语言**（如 Python、SQL 等），或正在**设计一门新的编程语言或数据格式**，那么 **ANTLR** 是你必须使用的强大工具。

简单来说，可以将 JavaParser 理解为一把为 Java 代码“量身定制”的精密螺丝刀，而 ANTLR 则是一个能制造各种规格螺丝刀的“万能工具工厂”。

希望这个解释能帮助你清晰理解它们的关系。如果你有具体的应用场景，比如打算做哪方面的代码分析，或许我可以提供更进一步的建议。

## CompilationUnit

JavaParser 中的 `CompilationUnit`对象代表一个 Java 源代码文件的完整结构，是抽象语法树（AST）的根节点。下表概括了其主要组成部分：

| 组成部分                             | 说明                                              |
| ------------------------------------ | ------------------------------------------------- |
| **包声明 (Package Declaration)**     | 表示文件的包名信息（如 `package com.example;`）   |
| **导入声明 (Imports)**               | 表示文件的导入语句（如 `import java.util.List;`） |
| **类型声明 (Type Declarations)**     | 表示文件中定义的类、接口、枚举或注解              |
| **注释 (Comments)**                  | 包含文件中的行注释、块注释和 JavaDoc 注释         |
| **顶级注解 (Top-level Annotations)** | 应用于整个文件或模块的注解                        |

### 核心组成部分详解

- **包声明 (Package Declaration)**：通过 `CompilationUnit`的 `getPackageDeclaration()`方法可以获取当前文件的包声明信息。你也可以使用 `setPackageDeclaration(String packageName)`方法来设置或修改包名。
- **导入声明 (Imports)**：`CompilationUnit`提供 `getImports()`方法来获取所有导入声明的列表，以及 `addImport(String importName)`方法来添加新的导入语句。这在自动添加依赖时非常有用。
- **类型声明 (Type Declarations)**：这是 `CompilationUnit`中最核心的部分，包含了文件内实际的类、接口、枚举或注解的定义。你可以通过 `getTypes()`方法获取所有类型声明的列表，并使用 `addClass(String className)`等方法来添加新的类型定义。每个类型声明本身又是一个复杂的节点，包含方法、字段等子节点。
- **注释 (Comments)** 与 **顶级注解**：`CompilationUnit`也管理着文件中的各种注释和直接位于包声明或导入语句之前的顶级注解。

### 访问与操作 AST

`CompilationUnit`作为 AST 的入口，提供了多种方式来遍历和修改其包含的节点：

- **使用 Visitor 模式（推荐）**：这是最强大和安全的方式。你可以通过继承 `VoidVisitorAdapter`或 `ModifierVisitor`来创建自定义访问器，精准地访问或修改特定类型的节点（例如，所有的方法声明）。
- **递归遍历节点**：可以直接使用 `findAll(Class<T> nodeType)`等方法查找特定类型的所有节点，但这种方式在复杂操作时不如 Visitor 模式灵活。

### 示例：生成与解析代码

- **生成新的 Java 文件**：你可以直接创建 `CompilationUnit`对象，并逐步添加包声明、导入语句和类定义，最后通过 `toString()`方法将其转换为格式化的 Java 源代码字符串。
- **解析现有代码**：使用 `StaticJavaParser.parse(String code)`或重载方法，可以将字符串、文件等解析为 `CompilationUnit`对象，从而进行后续分析或修改。

希望这份详细的说明能帮助你更好地理解和使用 JavaParser 的 `CompilationUnit`。如果你对某个具体操作场景有进一步的问题，我可以提供更深入的例子。

## MethodDeclaration & ResolvedMethodDeclaration

在 JavaParser 中，`MethodDeclaration`、`ResolvedMethodDeclaration`和 `JavassistMethodDeclaration`这三个类代表了方法在不同抽象层级和上下文中的形态。为了让你快速把握核心区别，下表对它们进行了清晰的对比。

| 特性维度        | MethodDeclaration                                            | ResolvedMethodDeclaration                                    | JavassistMethodDeclaration                                   |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **所属库/模块** | JavaParser Core                                              | JavaParser Symbol Solver                                     | JavaParser Javassist Adapter                                 |
| **核心职责**    | 表示源码中**方法声明的语法结构**                             | 表示经过**语义解析后**的方法信息，包含完整的类型信息         | 作为 **Javassist** 的 `CtMethod`在 JavaParser 中的**适配器或包装器** |
| **抽象层级**    | **语法级**（AST 节点）                                       | **语义级**（符号解析结果）                                   | **桥接层**（适配不同模型）                                   |
| **数据来源**    | 直接来自解析的**源代码**                                     | 通过符号解析器（Symbol Solver）**计算得出**                  | 封装自 **Javassist** 的 `CtMethod`对象                       |
| **主要信息**    | 方法名、参数列表（语法）、返回类型（语法）、修饰符、方法体（语句） | **完全解析的参数类型**、**完全解析的返回类型**、声明该方法的**完整类名**、泛型信息 | 依赖于底层 `CtMethod`所提供的信息                            |
| **主要用途**    | **代码结构分析**、**代码生成与重构**（语法层面）             | **高级代码分析**（如调用图分析、类型推导）、**反射式信息获取** | 在同时使用 JavaParser 和 Javassist 的项目中，**实现两种模型之间的交互和转换** |

### 💡 核心区别与联系

理解这三者的关键在于把握它们所处的不同层次：

- **`MethodDeclaration`关注“形”**：它只关心代码**看起来是什么样子**，即语法结构。例如，它知道有一个参数，但其类型 `List`可能只是一个未经解析的符号。
- **`ResolvedMethodDeclaration`关注“意”**：它通过符号解析，弄懂了代码**实际含义**。它知道 `List`具体指向 `java.util.List`，并且能解析出泛型参数 `String`。
- **`JavassistMethodDeclaration`关注“桥接”**：它本身不属于 JavaParser 的核心语义模型，而是一个**辅助工具**，用于将 Javassist 库中的方法表示方式（`CtMethod`）**转换或适配**成 JavaParser 能够理解的 `MethodDeclaration`格式，从而在混合使用两个库时提供便利。

通常，在 JavaParser 的工作流中，你会通过调用 `MethodDeclaration`的 `resolve()`方法来获取其对应的 `ResolvedMethodDeclaration`，从而进行深入的语义分析。而 `JavassistMethodDeclaration`则在特定的、需要与 Javassist 字节码操作库协同工作的场景下才会使用。

希望这个解释能帮助你清晰理解这三个概念。如果你对某个特定场景下的用法有进一步疑问，欢迎随时提出。

## 共享 TypeResolver

在多线程环境中让每个线程独立的 `JavaParser`实例共享整个项目的源码信息，关键在于正确配置和使用 **`TypeSolver`** 体系。这能确保所有解析器对项目中的类、方法等符号有统一的理解。

### 🔧 核心机制：共享的 TypeSolver

`TypeSolver`是 JavaParser 符号解析（Symbol Resolution）组件的核心，它负责根据一个类或方法的名称找到其完整的定义（即 `ResolvedType`或 `ResolvedMethodDeclaration`）。要让多个 `JavaParser`实例共享项目上下文，就需要为它们配置一个**共享的、包含项目所有必要源码路径的 `TypeSolver`**。

最常用的方式是使用 `CombinedTypeSolver`组合多个专门用途的求解器，并为所有线程的 `JavaParser`实例配置指向这个共享求解器的 `SymbolResolver`。

下面的流程图直观展示了这一架构的核心组成和数据流动方向：

```
flowchart TD
    A[项目源码目录] --> B[“JavaParserTypeSolver<br>(解析项目自身代码)”]
    C[JDK 核心库] --> D[“ReflectionTypeSolver<br>(解析JDK类)”]
    E[第三方依赖 Jar 包] --> F[“JarTypeSolver<br>(解析依赖库)”]
    
    B --> G[CombinedTypeSolver]
    D --> G
    F --> G
    
    G --> H[“共享的<br>JavaSymbolSolver”]
    
    H --> I[线程1的 JavaParser 实例]
    H --> J[线程2的 JavaParser 实例]
    H --> K[线程N的 JavaParser 实例]
    
    I --> I1[解析任务1]
    J --> J1[解析任务2]
    K --> K1[解析任务N]
```

### 🧩 配置共享的 TypeSolver

你需要根据项目的依赖结构，组合不同的 `TypeSolver`。一个典型的配置如下：

```
import com.github.javaparser.symbolsolver.JavaSymbolSolver;
import com.github.javaparser.symbolsolver.resolution.typesolvers.*;

// 1. 创建组合求解器
CombinedTypeSolver combinedTypeSolver = new CombinedTypeSolver();

// 2. 添加JDK核心库求解器（必须）
combinedTypeSolver.add(new ReflectionTypeSolver());

// 3. 添加项目源码根目录求解器（核心）
// 假设你的项目源码路径是 "src/main/java"
combinedTypeSolver.add(new JavaParserTypeSolver(new File("src/main/java")));

// 4. （可选）添加第三方依赖库的求解器
// 例如，指向一个包含依赖库的目录
File jarDir = new File("lib");
for (File jarFile : jarDir.listFiles((dir, name) -> name.endsWith(".jar"))) {
    combinedTypeSolver.add(new JarTypeSolver(jarFile));
}

// 5. 创建共享的符号解析器
JavaSymbolSolver sharedSymbolSolver = new JavaSymbolSolver(combinedTypeSolver);
```

### 🧵 为多线程配置 JavaParser

创建好共享的 `JavaSymbolSolver`后，你需要在每个线程创建自己的 `JavaParser`实例时，为其设置统一的配置，指定使用这个共享的解析器 。

```
// 使用共享的符号解析器创建全局配置（可选，方便使用 StaticJavaParser）
ParserConfiguration globalConfig = new ParserConfiguration();
globalConfig.setSymbolResolver(sharedSymbolSolver);
StaticJavaParser.getConfiguration().setSymbolResolver(sharedSymbolSolver);

// 或者，为每个线程内独立的 JavaParser 实例进行配置
public class MyParsingTask implements Runnable {
    private final JavaSymbolSolver symbolSolver; // 通过构造函数注入共享的解析器

    public MyParsingTask(JavaSymbolSolver symbolSolver) {
        this.symbolSolver = symbolSolver;
    }

    @Override
    public void run() {
        // 每个线程使用自己的 JavaParser 实例，但配置共享的符号解析器
        ParserConfiguration threadLocalConfig = new ParserConfiguration();
        threadLocalConfig.setSymbolResolver(symbolSolver);
        
        JavaParser parser = new JavaParser(threadLocalConfig); // 线程安全的实例
        // ... 使用这个 parser 进行解析工作
    }
}
```

### 💡 重要注意事项

- **性能与缓存**：首次解析新符号时，`JavaParserTypeSolver`会解析源码文件。后续请求相同的符号会使用缓存，因此共享的 `TypeSolver`能受益于缓存带来的性能提升 。
- **内存考量**：如果项目非常大，包含成千上万个源文件，多个 `JavaParser`实例和共享的 `TypeSolver`可能会占用可观的内存。需要监控内存使用情况。
- **配置一致性**：务必确保所有线程的 `JavaParser`实例都配置了**完全相同**的 `TypeSolver`组合，否则不同线程可能会对同一符号得出不同的解析结果。
- **依赖库处理**：对于复杂的 Maven 或 Gradle 项目，手动管理所有依赖的 Jar 包路径可能很繁琐。可以考虑使用 `MavenResolutionStrategy`等更高级的策略来自化处理依赖 。

希望这些详细的解释和示例能帮助你在多线程项目中高效地使用 JavaParser。如果你在具体实践中遇到更细致的问题，欢迎随时提出！